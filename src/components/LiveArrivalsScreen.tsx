import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BusArrivalData, RainData, FavouriteStop, StopInfo, StopSearchResult, FetchState, SENTENCES } from '../types.ts';
import { getBus, getRain, getStop, searchStops } from '../data.js';
import { WeatherPanel } from './WeatherPanel.tsx';

interface LiveArrivalsScreenProps {
  favourites: FavouriteStop[];
  onToggleFavourite: (
    stopCode: string,
    serviceNo: string,
    currentArea: string
  ) => void;
  selectedArea: string;
  onSelectArea: (area: string) => void;
  onWeatherUpdate?: (forecast: string) => void;
}

export const LiveArrivalsScreen: React.FC<LiveArrivalsScreenProps> = ({
  favourites,
  onToggleFavourite,
  selectedArea,
  onSelectArea,
  onWeatherUpdate,
}) => {
  // Remember last looked at stop code, defaulting to 01039 (Bugis Cube)
  const [stopCodeInput, setStopCodeInput] = useState<string>(() => {
    return localStorage.getItem('catchMyBus.lastStopCode') || '01039';
  });
  const [activeStopCode, setActiveStopCode] = useState<string>(() => {
    return localStorage.getItem('catchMyBus.lastStopCode') || '01039';
  });

  const [busData, setBusData] = useState<BusArrivalData | null>(null);
  const [busState, setBusState] = useState<FetchState>('loading');
  const [busErrorStatus, setBusErrorStatus] = useState<string | number>('unknown');

  const [stopInfo, setStopInfo] = useState<StopInfo | null>(null);

  const [rainData, setRainData] = useState<RainData | null>(null);
  const [rainState, setRainState] = useState<FetchState>('loading');
  const [rainErrorStatus, setRainErrorStatus] = useState<string | number>('unknown');

  // Notify parent of forecast when rainData or selectedArea updates
  useEffect(() => {
    if (rainData?.areas && onWeatherUpdate) {
      const match = rainData.areas.find(
        (a) => a.area.toLowerCase() === selectedArea.toLowerCase()
      );
      if (match) {
        onWeatherUpdate(match.forecast);
      }
    }
  }, [rainData, selectedArea, onWeatherUpdate]);

  // Bus stop description or road name search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [shortlistedStops, setShortlistedStops] = useState<StopSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search for bus stop description or road name
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setShortlistedStops([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchStops(trimmed);
        setShortlistedStops(results);
      } catch {
        setShortlistedStops([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Handle selecting a bus stop from the shortlisted list
  const handleSelectShortlistedStop = (stop: StopSearchResult) => {
    setStopCodeInput(stop.stopCode);
    localStorage.setItem('catchMyBus.lastStopCode', stop.stopCode);
    setActiveStopCode(stop.stopCode);
    fetchBusData(stop.stopCode);
  };

  // Load weather and bus arrivals
  const fetchBusData = useCallback(async (code: string) => {
    // Validate 5-digit stop code
    if (!/^\d{5}$/.test(code.trim())) {
      setBusState('not_found');
      setBusData(null);
      setStopInfo(null);
      return;
    }

    setBusState('loading');

    // Fetch stop info (official description, road name, nearby stops)
    getStop(code)
      .then((info) => {
        setStopInfo(info);
      })
      .catch((err: any) => {
        setStopInfo(null);
        if (err?.code === 'not_found') {
          setBusState('not_found');
        }
      });

    try {
      const data = await getBus(code);
      if (!data || !data.services || data.services.length === 0) {
        setBusData(data);
        setBusState('empty');
      } else {
        setBusData(data);
        setBusState('success');
      }
    } catch (err: any) {
      const codeType = err?.code;
      const statusVal = err?.status || err?.statusCode || 'unknown';
      setBusErrorStatus(statusVal);
      if (codeType === 'refused') {
        setBusState('refused');
      } else if (codeType === 'unreachable') {
        setBusState('unreachable');
      } else if (codeType === 'not_found') {
        setBusState('not_found');
      } else {
        setBusState('unreachable');
      }
    }
  }, []);

  const fetchRainData = useCallback(async () => {
    setRainState('loading');
    try {
      const data = await getRain();
      if (!data || !data.areas || data.areas.length === 0) {
        setRainData(data);
        setRainState('empty');
      } else {
        setRainData(data);
        setRainState('success');
      }
    } catch (err: any) {
      const codeType = err?.code;
      const statusVal = err?.status || err?.statusCode || 'unknown';
      setRainErrorStatus(statusVal);
      if (codeType === 'refused') {
        setRainState('refused');
      } else if (codeType === 'unreachable') {
        setRainState('unreachable');
      } else {
        setRainState('unreachable');
      }
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchBusData(activeStopCode);
    fetchRainData();
  }, [activeStopCode, fetchBusData, fetchRainData]);

  // Refresh every 20 seconds, matching LTA update frequency
  useEffect(() => {
    const timer = setInterval(() => {
      fetchBusData(activeStopCode);
      fetchRainData();
    }, 20000);

    return () => clearInterval(timer);
  }, [activeStopCode, fetchBusData, fetchRainData]);

  // Handle stop code submission
  const handleShowBuses = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = stopCodeInput.trim();
    if (cleanCode.length > 0) {
      localStorage.setItem('catchMyBus.lastStopCode', cleanCode);
      setActiveStopCode(cleanCode);
      fetchBusData(cleanCode);
    }
  };

  // Switch to a nearby stop when tapped
  const handleSelectNearbyStop = (nearbyCode: string) => {
    setStopCodeInput(nearbyCode);
    localStorage.setItem('catchMyBus.lastStopCode', nearbyCode);
    setActiveStopCode(nearbyCode);
    fetchBusData(nearbyCode);
  };

  // Check if a service is starred at the current stop
  const isStarred = (serviceNo: string) => {
    const existingStop = favourites.find((f) => f.stopCode === activeStopCode);
    return Boolean(existingStop?.services.includes(serviceNo));
  };

  // Format arrival times according to spec:
  // "0 means 'Arriving', showing 'Arriving' under one minute, and showing a plain sentence when a service has no buses running"
  const formatArrivals = (serviceNo: string, next: number[]) => {
    if (!next || next.length === 0) {
      return SENTENCES.FAVOURITES.savedBusNotRunning(serviceNo);
    }

    const parts = next.slice(0, 2).map((min) => {
      if (min <= 0) {
        return <span key={min} className="arrival-pill">Arriving</span>;
      }
      return `${min} min`;
    });

    if (parts.length === 1) {
      return parts[0];
    }

    return (
      <>
        {parts[0]}, {parts[1]}
      </>
    );
  };

  return (
    <div className="main-content" id="live-arrivals-screen">
      {/* 5-digit bus stop code input with "Show buses" button and description/road name search */}
      <section className="search-card" id="stop-search-card">
        <form onSubmit={handleShowBuses}>
          <label htmlFor="bus-stop-code" className="input-label">
            Bus stop code
          </label>
          <div className="input-group">
            <input
              type="text"
              id="bus-stop-code"
              className="stop-code-input"
              value={stopCodeInput}
              onChange={(e) => setStopCodeInput(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="01039"
              maxLength={5}
              pattern="[0-9]{5}"
              inputMode="numeric"
              aria-label="5-digit bus stop code"
            />
            <button type="submit" className="primary-btn" id="show-buses-btn">
              Show buses
            </button>
          </div>
        </form>

        {/* Text box allowing user to input description of bus stop or road name */}
        <div className="search-field-wrapper" style={{ marginTop: '16px' }}>
          <label htmlFor="search-stop-desc" className="input-label">
            Search by bus stop description or road name
          </label>
          <input
            type="text"
            id="search-stop-desc"
            className="search-desc-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. Orchard, Bugis, Victoria St..."
            aria-label="Search bus stops by description or road name"
          />
        </div>

        {/* Shortlisted list of related bus stops */}
        {searchQuery.trim().length > 0 && (
          <div className="shortlisted-stops-container" id="shortlisted-stops-container">
            <div className="shortlisted-heading">
              {isSearching ? 'Searching related bus stops…' : `Related Bus Stops (${shortlistedStops.length})`}
            </div>
            {shortlistedStops.length > 0 ? (
              <div className="shortlisted-stops-list" role="listbox" aria-label="Shortlisted bus stops">
                {shortlistedStops.map((stop) => {
                  const isCurrent = stop.stopCode === activeStopCode;
                  return (
                    <button
                      key={stop.stopCode}
                      type="button"
                      className={`shortlisted-stop-btn ${isCurrent ? 'selected' : ''}`}
                      onClick={() => handleSelectShortlistedStop(stop)}
                      id={`select-shortlisted-stop-${stop.stopCode}`}
                      role="option"
                      aria-selected={isCurrent}
                    >
                      <div className="shortlisted-stop-info">
                        <span className="shortlisted-stop-desc">{stop.description}</span>
                        <span className="shortlisted-stop-road">{stop.roadName}</span>
                      </div>
                      <span className="shortlisted-badge">Stop {stop.stopCode}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              !isSearching && (
                <div className="shortlisted-empty-hint" id="no-shortlisted-stops-hint">
                  No matching bus stops found for "{searchQuery}".
                </div>
              )
            )}
          </div>
        )}
      </section>

      {/* Bus Services Panel */}
      <section className="services-panel" id="services-panel">
        <div className="panel-header">
          <div className="panel-header-main">
            <div className="panel-header-tag">
              <span className="panel-stop-num">Stop {activeStopCode}</span>
            </div>
            {stopInfo && stopInfo.description && (
              <h2 className="panel-stop-desc">{stopInfo.description}</h2>
            )}
            {stopInfo && stopInfo.roadName && (
              <div className="panel-stop-road">{stopInfo.roadName}</div>
            )}
          </div>
          <span className="refresh-indicator">Refreshes every 20s</span>
        </div>

        {/* States according to item 5 */}
        {busState === 'loading' && (
          <div className="status-banner loading" id="bus-loading-state" style={{ margin: '14px' }}>
            {SENTENCES.BUS.loading(activeStopCode)}
          </div>
        )}

        {busState === 'empty' && (
          <div className="status-banner empty" id="bus-empty-state" style={{ margin: '14px' }}>
            {SENTENCES.BUS.empty(activeStopCode)}
          </div>
        )}

        {busState === 'refused' && (
          <div className="status-banner error" id="bus-refused-state" style={{ margin: '14px' }}>
            {SENTENCES.BUS.refused(busErrorStatus)}
          </div>
        )}

        {busState === 'unreachable' && (
          <div className="status-banner error" id="bus-unreachable-state" style={{ margin: '14px' }}>
            {SENTENCES.BUS.unreachable}
          </div>
        )}

        {busState === 'not_found' && (
          <div className="status-banner error" id="bus-not-found-state" style={{ margin: '14px' }}>
            Bus stop code is invalid!! The 5-digit code is printed on the pole at the bus stop.
          </div>
        )}

        {busState === 'success' && busData && (
          <ul className="services-list" id="bus-services-list">
            {busData.services.map((svc) => {
              const starred = isStarred(svc.serviceNo);
              return (
                <li key={svc.serviceNo} className="service-row" id={`service-row-${svc.serviceNo}`}>
                  <div className="service-main">
                    <span className="service-badge">{svc.serviceNo}</span>
                    <span className="service-arrivals">
                      {formatArrivals(svc.serviceNo, svc.next)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={`star-btn ${starred ? 'starred' : ''}`}
                    onClick={() =>
                    onToggleFavourite(
                      activeStopCode,
                      svc.serviceNo,
                      selectedArea
                    )
                  }
                  aria-label={
                    starred
                      ? `Remove service ${svc.serviceNo} from favourites`
                      : `Add service ${svc.serviceNo} to favourites`
                  }
                  title={starred ? 'Starred in favourites' : 'Star this bus'}
                  id={`star-btn-${svc.serviceNo}`}
                >
                  {starred ? '★' : '☆'}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {busState === 'success' && busData?.fetchedAt && (
        <div className="bus-updated" id="bus-last-updated">
          Last updated {new Date(busData.fetchedAt).toLocaleTimeString('en-GB', {
            timeZone: 'Asia/Singapore',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </div>
      )}
    </section>

      {/* Nearby Bus Stops Section (sourced from LTA via /api/stop) */}
      {stopInfo && stopInfo.nearby && stopInfo.nearby.length > 0 && (
        <section className="nearby-stops-card" id="nearby-stops-card">
          <div className="nearby-header">
            <h3 className="nearby-heading">Nearby bus stops</h3>
            <span className="nearby-hint">Within 300m</span>
          </div>
          <div className="nearby-stops-list">
            {stopInfo.nearby.map((nb) => (
              <button
                key={nb.stopCode}
                type="button"
                className="nearby-stop-chip"
                onClick={() => handleSelectNearbyStop(nb.stopCode)}
                id={`nearby-stop-${nb.stopCode}`}
              >
                <div className="nearby-chip-top">
                  <span className="nearby-badge">{nb.stopCode}</span>
                  <span className="nearby-dist">approx. {nb.approxMetres}m</span>
                </div>
                {nb.description && (
                  <span className="nearby-chip-desc" title={nb.description}>
                    {nb.description}
                  </span>
                )}
                {nb.roadName && (
                  <span className="nearby-chip-road" title={nb.roadName}>
                    {nb.roadName}
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Weather Panel */}
      <WeatherPanel
        rainData={rainData}
        selectedArea={selectedArea}
        onSelectArea={onSelectArea}
        fetchState={rainState}
        errorStatus={rainErrorStatus}
        idPrefix="live"
      />
    </div>
  );
};
