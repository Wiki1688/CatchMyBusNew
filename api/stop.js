/**
 * api/stop.js - Vercel Serverless Function & Express Route Handler
 *
 * Accepts ?BusStopCode=XXXXX (5 digits, else 400 with a plain sentence)
 * Loads full LTA BusStops list from:
 * https://datamall2.mytransport.sg/ltaodataservice/BusStops
 * (500 records per call; keep calling with ?$skip=500, 1000, ... until a call returns < 500 records)
 * Sends AccountKey header from process.env.LTA_ACCOUNT_KEY.
 * If variable is missing or empty, returns 503 with
 * {"error":"LTA_ACCOUNT_KEY is not set. Add it in Vercel and redeploy."} before calling LTA.
 * Caches the assembled list in a module-level variable for the life of the function instance.
 * Sets Cache-Control: s-maxage=86400, stale-while-revalidate=604800 on the response.
 *
 * Computes up to 4 other stops within 300 metres using haversine formula, sorted nearest first.
 * approxMetres rounded to nearest 10.
 * Never emits NaN.
 * Returns ONLY:
 * { stopCode, description, roadName, latitude, longitude,
 *   nearby: [ { stopCode, description, roadName, approxMetres } ] }
 * If code is not in LTA's list, returns 404 with {"error":"Bus stop code not found."}.
 */

// Module-level cache for full bus stops list: Array of { BusStopCode, RoadName, Description, Latitude, Longitude }
let cachedBusStops = null;

// Haversine distance in metres between two lat/lon points
function calculateHaversineMetres(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in metres
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Fetch all bus stops with pagination ($skip=0, 500, 1000, ...)
async function fetchAllBusStops(accountKey) {
  const allStops = [];
  let skip = 0;
  const pageSize = 500;

  while (true) {
    const url = `https://datamall2.mytransport.sg/ltaodataservice/BusStops${skip > 0 ? `?$skip=${skip}` : ''}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        AccountKey: accountKey.trim(),
      },
    });

    if (!res.ok) {
      const err = new Error(`LTA BusStops failed with status ${res.status}`);
      err.upstreamStatus = res.status;
      throw err;
    }

    const data = await res.json();
    const batch = Array.isArray(data?.value) ? data.value : [];
    allStops.push(...batch);

    if (batch.length < pageSize) {
      break;
    }

    skip += pageSize;
  }

  return allStops;
}

export default async function handler(req, res) {
  // Extract query parameters
  let stopCode = '';
  let searchQuery = '';

  if (req.query) {
    if (req.query.BusStopCode) stopCode = String(req.query.BusStopCode).trim();
    if (req.query.q) searchQuery = String(req.query.q).trim();
  } else if (req.url) {
    const urlObj = new URL(req.url, 'http://localhost');
    const param = urlObj.searchParams.get('BusStopCode');
    if (param) stopCode = param.trim();
    const qParam = urlObj.searchParams.get('q');
    if (qParam) searchQuery = qParam.trim();
  }

  // Check LTA_ACCOUNT_KEY credential before calling LTA
  const ltaKey = process.env.LTA_ACCOUNT_KEY;
  if (!ltaKey || ltaKey.trim().length === 0) {
    return res.status(503).json({
      error: 'LTA_ACCOUNT_KEY is not set. Add it in Vercel and redeploy.',
    });
  }

  // Set Cache-Control header
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');

  try {
    if (!cachedBusStops) {
      cachedBusStops = await fetchAllBusStops(ltaKey);
    }

    // If searchQuery is provided, search stops by description or road name
    if (searchQuery) {
      const qLower = searchQuery.toLowerCase();
      const matched = [];

      for (const stop of cachedBusStops) {
        const desc = String(stop.Description || '');
        const road = String(stop.RoadName || '');
        const code = String(stop.BusStopCode || '');

        if (
          desc.toLowerCase().includes(qLower) ||
          road.toLowerCase().includes(qLower) ||
          code.includes(qLower)
        ) {
          matched.push({
            stopCode: code,
            description: desc,
            roadName: road,
          });
          if (matched.length >= 20) break;
        }
      }

      return res.status(200).json({ stops: matched });
    }

    // Validate 5-digit bus stop code for specific stop lookup
    if (!/^\d{5}$/.test(stopCode)) {
      return res.status(400).send('Bus stop code must be 5 digits.');
    }

    // Find the requested stop
    const targetStop = cachedBusStops.find(
      (s) => String(s.BusStopCode).trim() === stopCode
    );

    if (!targetStop) {
      return res.status(404).json({
        error: 'Bus stop code not found.',
      });
    }

    const targetLat = Number(targetStop.Latitude);
    const targetLon = Number(targetStop.Longitude);

    // Compute nearby stops within 300m (excluding the target stop itself)
    const candidates = [];

    if (!isNaN(targetLat) && !isNaN(targetLon)) {
      for (const stop of cachedBusStops) {
        const otherCode = String(stop.BusStopCode).trim();
        if (otherCode === stopCode) continue;

        const otherLat = Number(stop.Latitude);
        const otherLon = Number(stop.Longitude);
        if (isNaN(otherLat) || isNaN(otherLon)) continue;

        const distMetres = calculateHaversineMetres(targetLat, targetLon, otherLat, otherLon);
        if (!isNaN(distMetres) && distMetres <= 300) {
          const approxMetres = Math.round(distMetres / 10) * 10;
          candidates.push({
            stopCode: otherCode,
            description: String(stop.Description || ''),
            roadName: String(stop.RoadName || ''),
            distMetres,
            approxMetres: isNaN(approxMetres) ? 0 : approxMetres,
          });
        }
      }
    }

    // Sort nearest first and take up to 4
    candidates.sort((a, b) => a.distMetres - b.distMetres);
    const nearby = candidates.slice(0, 4).map(({ stopCode, description, roadName, approxMetres }) => ({
      stopCode,
      description,
      roadName,
      approxMetres,
    }));

    return res.status(200).json({
      stopCode,
      description: String(targetStop.Description || ''),
      roadName: String(targetStop.RoadName || ''),
      latitude: targetLat,
      longitude: targetLon,
      nearby,
    });
  } catch (err) {
    // If upstream fetch failed, allow retrying on next request by not poisoning cache
    const upstreamStatus = err?.upstreamStatus;
    if (upstreamStatus) {
      return res.status(upstreamStatus >= 500 ? 502 : upstreamStatus).json({
        error: `Upstream LTA service returned status ${upstreamStatus}`,
        upstreamStatus,
      });
    }

    return res.status(502).json({
      error: 'Failed to connect to LTA service',
      upstreamStatus: 'unreachable',
    });
  }
}
