/**
 * api/rain.js - Vercel Serverless Function & Express Route Handler
 *
 * Takes no parameters.
 * Calls https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast ONCE.
 * Returns: { validPeriod, updatedAt, areas: [ { area, forecast, rainExpected } ] }
 */

export default async function handler(req, res) {
  // Set Cache-Control header
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  try {
    const upstreamRes = await fetch(
      'https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast',
      {
        method: 'GET',
      }
    );

    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status >= 500 ? 502 : upstreamRes.status).json({
        error: `Upstream weather service returned status ${upstreamRes.status}`,
        upstreamStatus: upstreamRes.status,
      });
    }

    const json = await upstreamRes.json();
    const dataObj = json?.data;
    const items = Array.isArray(dataObj?.items) ? dataObj.items : [];

    if (items.length === 0) {
      return res.status(200).json({
        validPeriod: '',
        updatedAt: '',
        areas: [],
      });
    }

    const latestItem = items[0];
    const validPeriod = latestItem?.valid_period?.text || '';

    // Format update_timestamp as HH:MM in Singapore time (Asia/Singapore)
    let updatedAt = '';
    const rawTimestamp = latestItem?.update_timestamp || latestItem?.timestamp;
    if (rawTimestamp) {
      const d = new Date(rawTimestamp);
      if (!isNaN(d.getTime())) {
        updatedAt = d.toLocaleTimeString('en-GB', {
          timeZone: 'Asia/Singapore',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      }
    }

    const rawForecasts = Array.isArray(latestItem?.forecasts)
      ? latestItem.forecasts
      : [];

    const rainRegex = /Rain|Showers|Thundery/i;
    const areas = rawForecasts.map((f) => {
      const forecastText = String(f.forecast || '');
      return {
        area: String(f.area || ''),
        forecast: forecastText,
        rainExpected: rainRegex.test(forecastText),
      };
    });

    return res.status(200).json({
      validPeriod,
      updatedAt,
      areas,
    });
  } catch (err) {
    return res.status(502).json({
      error: 'Failed to connect to weather service',
      upstreamStatus: 'unreachable',
    });
  }
}
