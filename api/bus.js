/**
 * api/bus.js - Vercel Serverless Function & Express Route Handler
 *
 * Accepts BusStopCode query parameter, defaults to 01039.
 * Calls https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival
 * Returns: { stopCode, fetchedAt, services: [ { serviceNo, next } ] }
 */

export default async function handler(req, res) {
  // Extract query parameter (handles both standard req.query and URL parsing)
  let stopCode = '01039';
  if (req.query && req.query.BusStopCode) {
    stopCode = String(req.query.BusStopCode).trim();
  } else if (req.url) {
    const urlObj = new URL(req.url, 'http://localhost');
    const param = urlObj.searchParams.get('BusStopCode');
    if (param) stopCode = param.trim();
  }

  // Validate 5-digit bus stop code
  if (!/^\d{5}$/.test(stopCode)) {
    return res.status(400).send('Bus stop code must be 5 digits.');
  }

  // Check LTA_ACCOUNT_KEY credential
  const ltaKey = process.env.LTA_ACCOUNT_KEY;
  if (!ltaKey || ltaKey.trim().length === 0) {
    return res.status(503).json({
      error: 'LTA_ACCOUNT_KEY is not set. Add it in Vercel and redeploy.',
    });
  }

  // Set Cache-Control header
  res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=40');

  try {
    const apiUrl = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(stopCode)}`;
    const upstreamRes = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        AccountKey: ltaKey.trim(),
      },
    });

    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status >= 500 ? 502 : upstreamRes.status).json({
        error: `Upstream LTA service returned status ${upstreamRes.status}`,
        upstreamStatus: upstreamRes.status,
      });
    }

    const data = await upstreamRes.json();
    const rawServices = Array.isArray(data?.Services) ? data.Services : [];

    const now = Date.now();
    const services = rawServices.map((svc) => {
      const nextMinutes = [];
      const busList = [svc.NextBus, svc.NextBus2, svc.NextBus3].filter(Boolean);

      for (const bus of busList) {
        if (nextMinutes.length >= 2) break;
        const est = bus.EstimatedArrival;
        if (est && typeof est === 'string' && est.trim().length > 0) {
          const arrivalTime = new Date(est).getTime();
          if (!isNaN(arrivalTime)) {
            const diffMin = Math.floor((arrivalTime - now) / 60000);
            const clamped = diffMin <= 0 ? 0 : diffMin;
            nextMinutes.push(clamped);
          }
        }
      }

      return {
        serviceNo: String(svc.ServiceNo || ''),
        next: nextMinutes,
      };
    });

    return res.status(200).json({
      stopCode,
      fetchedAt: new Date().toISOString(),
      services,
    });
  } catch (err) {
    return res.status(502).json({
      error: 'Failed to connect to LTA service',
      upstreamStatus: 'unreachable',
    });
  }
}
