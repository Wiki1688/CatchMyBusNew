/**
 * api/health.js - Health Check Endpoint
 *
 * Reports whether the key is configured (keyConfigured) and whether LTA
 * and data.gov.sg each answered, including upstream HTTP status code (or "unreachable").
 * MUST NEVER print the key or any part of it, not even its length.
 */

export default async function handler(req, res) {
  const ltaKey = process.env.LTA_ACCOUNT_KEY;
  const keyConfigured = Boolean(ltaKey && ltaKey.trim().length > 0);

  let ltaStatus = 'not_configured';
  if (keyConfigured) {
    try {
      const ltaRes = await fetch(
        'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=01039',
        {
          method: 'GET',
          headers: {
            AccountKey: ltaKey.trim(),
          },
        }
      );
      ltaStatus = ltaRes.status;
    } catch {
      ltaStatus = 'unreachable';
    }
  }

  let dataGovStatus = 'unreachable';
  try {
    const rainRes = await fetch(
      'https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast',
      {
        method: 'GET',
      }
    );
    dataGovStatus = rainRes.status;
  } catch {
    dataGovStatus = 'unreachable';
  }

  return res.status(200).json({
    keyConfigured,
    ltaStatus,
    dataGovStatus,
  });
}
