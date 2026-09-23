/**
 * src/data.js - Live Data Fetchers
 *
 * Calls /api/bus?BusStopCode=XXXXX and /api/rain
 * Adheres strictly to the error contract:
 * - "refused": function answered 4xx/5xx — .status set to upstreamStatus in its JSON
 * - "unreachable": fetch itself threw, or function returned 502
 * - "not_found": function returned 400 for a code that is not five digits
 */

/**
 * getBus(stopCode)
 * Returns: { stopCode, fetchedAt, services: [ { serviceNo, next: [ 4, 11 ] } ] }
 * where next holds 0, 1 or 2 whole minutes and 0 means "Arriving".
 */
export async function getBus(stopCode) {
  let res;
  try {
    res = await fetch(`/api/bus?BusStopCode=${encodeURIComponent(stopCode)}`);
  } catch (err) {
    const error = new Error('No connection to LTA');
    error.code = 'unreachable';
    error.status = 'unreachable';
    throw error;
  }

  // Handle 400 (not 5 digits) -> "not_found"
  if (res.status === 400) {
    const error = new Error('Bus stop code is invalid');
    error.code = 'not_found';
    error.status = 400;
    throw error;
  }

  // Handle 502 -> "unreachable"
  if (res.status === 502) {
    const error = new Error('No connection to LTA');
    error.code = 'unreachable';
    error.status = 'unreachable';
    throw error;
  }

  // Handle non-2xx responses (e.g. 503 missing key, 401, 403, 500) -> "refused"
  if (!res.ok) {
    let upstreamStatus = res.status;
    try {
      const errData = await res.json();
      if (errData && errData.upstreamStatus !== undefined) {
        upstreamStatus = errData.upstreamStatus;
      }
    } catch {
      // response body was not JSON
    }

    if (upstreamStatus === 'unreachable') {
      const error = new Error('No connection to LTA');
      error.code = 'unreachable';
      error.status = 'unreachable';
      throw error;
    }

    const error = new Error(`Unable to retrieve bus arrivals (error ${upstreamStatus})`);
    error.code = 'refused';
    error.status = upstreamStatus;
    throw error;
  }

  // On 2xx success
  const data = await res.json();
  return {
    stopCode: data.stopCode || stopCode,
    fetchedAt: data.fetchedAt || new Date().toISOString(),
    services: Array.isArray(data.services) ? data.services : [],
  };
}

/**
 * getRain()
 * Returns: { validPeriod, updatedAt, areas: [ { area, forecast, rainExpected } ] }
 */
export async function getRain() {
  let res;
  try {
    res = await fetch('/api/rain');
  } catch (err) {
    const error = new Error('No connection to the weather service');
    error.code = 'unreachable';
    error.status = 'unreachable';
    throw error;
  }

  // Handle 502 -> "unreachable"
  if (res.status === 502) {
    const error = new Error('No connection to the weather service');
    error.code = 'unreachable';
    error.status = 'unreachable';
    throw error;
  }

  // Handle non-2xx responses -> "refused"
  if (!res.ok) {
    let upstreamStatus = res.status;
    try {
      const errData = await res.json();
      if (errData && errData.upstreamStatus !== undefined) {
        upstreamStatus = errData.upstreamStatus;
      }
    } catch {
      // response body was not JSON
    }

    if (upstreamStatus === 'unreachable') {
      const error = new Error('No connection to the weather service');
      error.code = 'unreachable';
      error.status = 'unreachable';
      throw error;
    }

    const error = new Error(`Unable to retrieve weather forecast (error ${upstreamStatus})`);
    error.code = 'refused';
    error.status = upstreamStatus;
    throw error;
  }

  // On 2xx success
  const data = await res.json();
  return {
    validPeriod: data.validPeriod || '',
    updatedAt: data.updatedAt || '',
    areas: Array.isArray(data.areas) ? data.areas : [],
  };
}

/**
 * getStop(stopCode)
 * Calls /api/stop?BusStopCode=XXXXX
 * Returns: { stopCode, description, roadName, latitude, longitude, nearby: [ { stopCode, description, roadName, approxMetres } ] }
 * Error contract:
 * - "not_found" for 400 AND 404
 * - "unreachable" for network errors or 502
 * - "refused" with .status for other non-2xx statuses (e.g. 503)
 */
export async function getStop(stopCode) {
  let res;
  try {
    res = await fetch(`/api/stop?BusStopCode=${encodeURIComponent(stopCode)}`);
  } catch (err) {
    const error = new Error('No connection to stop service');
    error.code = 'unreachable';
    error.status = 'unreachable';
    throw error;
  }

  // Handle 400 or 404 -> "not_found"
  if (res.status === 400 || res.status === 404) {
    const error = new Error('Bus stop code not found');
    error.code = 'not_found';
    error.status = res.status;
    throw error;
  }

  // Handle 502 -> "unreachable"
  if (res.status === 502) {
    const error = new Error('No connection to LTA');
    error.code = 'unreachable';
    error.status = 'unreachable';
    throw error;
  }

  // Handle non-2xx responses (e.g. 503 missing key, 500) -> "refused"
  if (!res.ok) {
    let upstreamStatus = res.status;
    try {
      const errData = await res.json();
      if (errData && errData.upstreamStatus !== undefined) {
        upstreamStatus = errData.upstreamStatus;
      }
    } catch {
      // response body was not JSON
    }

    if (upstreamStatus === 'unreachable') {
      const error = new Error('No connection to LTA');
      error.code = 'unreachable';
      error.status = 'unreachable';
      throw error;
    }

    const error = new Error(`Unable to retrieve stop information (error ${upstreamStatus})`);
    error.code = 'refused';
    error.status = upstreamStatus;
    throw error;
  }

  // On 2xx success
  const data = await res.json();
  return {
    stopCode: data.stopCode || stopCode,
    description: data.description || '',
    roadName: data.roadName || '',
    latitude: data.latitude,
    longitude: data.longitude,
    nearby: Array.isArray(data.nearby) ? data.nearby : [],
  };
}

/**
 * searchStops(query)
 * Calls /api/stop?q=...
 * Returns an array of matched stops: [ { stopCode, description, roadName } ]
 */
export async function searchStops(query) {
  if (!query || !query.trim()) return [];
  try {
    const res = await fetch(`/api/stop?q=${encodeURIComponent(query.trim())}`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.stops) ? data.stops : [];
  } catch {
    return [];
  }
}


