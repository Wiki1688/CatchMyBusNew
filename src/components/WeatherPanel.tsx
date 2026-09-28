import React, { useState, useRef, useEffect } from 'react';
import { RainData, FetchState, SENTENCES } from '../types.ts';
import { WeatherIcon } from './WeatherIcon.tsx';

interface WeatherPanelProps {
  rainData: RainData | null;
  selectedArea: string;
  onSelectArea: (area: string) => void;
  fetchState: FetchState;
  errorStatus?: string | number;
  idPrefix?: string;
}

export const WeatherPanel: React.FC<WeatherPanelProps> = ({
  rainData,
  selectedArea,
  onSelectArea,
  fetchState,
  errorStatus = 'unknown',
  idPrefix = 'main',
}) => {
  const [isChangingArea, setIsChangingArea] = useState<boolean>(false);
  const changeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (changeTimeoutRef.current) {
        clearTimeout(changeTimeoutRef.current);
      }
    };
  }, []);

  const handleAreaChange = (newArea: string) => {
    if (newArea === selectedArea) return;
    onSelectArea(newArea);
    setIsChangingArea(true);
    if (changeTimeoutRef.current) {
      clearTimeout(changeTimeoutRef.current);
    }
    changeTimeoutRef.current = setTimeout(() => {
      setIsChangingArea(false);
    }, 350);
  };

  const currentAreaForecast = rainData?.areas.find(
    (a) => a.area.toLowerCase() === selectedArea.toLowerCase()
  );

  // Read available areas directly from the live rainData response
  const areaOptions =
    rainData?.areas && rainData.areas.length > 0
      ? rainData.areas.map((a) => a.area)
      : selectedArea
      ? [selectedArea]
      : ['City'];

  return (
    <section className="weather-panel" id={`${idPrefix}-weather-panel`}>
      <h2 className="weather-heading" id={`${idPrefix}-weather-heading`}>
        Forecast for the {selectedArea} area
      </h2>

      <div className="weather-select-group">
        <label htmlFor={`${idPrefix}-area-select`} className="input-label" style={{ fontSize: '16px' }}>
          Select forecast area:
        </label>
        <select
          id={`${idPrefix}-area-select`}
          className="area-dropdown"
          value={selectedArea}
          onChange={(e) => handleAreaChange(e.target.value)}
        >
          {areaOptions.map((areaName) => (
            <option key={areaName} value={areaName}>
              {areaName}
            </option>
          ))}
        </select>
      </div>

      {(fetchState === 'loading' || (isChangingArea && fetchState === 'success')) && (
        <div className="status-banner loading" id={`${idPrefix}-rain-loading`}>
          {SENTENCES.RAIN.loading(selectedArea)}
        </div>
      )}

      {fetchState === 'refused' && (
        <div className="status-banner error" id={`${idPrefix}-rain-refused`}>
          {SENTENCES.RAIN.refused(errorStatus)}
        </div>
      )}

      {fetchState === 'unreachable' && (
        <div className="status-banner error" id={`${idPrefix}-rain-unreachable`}>
          {SENTENCES.RAIN.unreachable}
        </div>
      )}

      {fetchState === 'empty' && (
        <div className="status-banner empty" id={`${idPrefix}-rain-empty`}>
          {SENTENCES.RAIN.empty(selectedArea)}
        </div>
      )}

      {!isChangingArea && fetchState === 'success' && currentAreaForecast && (
        <div className="weather-details" id={`${idPrefix}-weather-details`}>
          <div className="weather-condition-row">
            <WeatherIcon forecast={currentAreaForecast.forecast} size={32} />
            <div className="weather-condition" id={`${idPrefix}-weather-wording`}>
              {selectedArea}: {currentAreaForecast.forecast}
            </div>
          </div>
          {rainData?.validPeriod && (
            <div className="weather-period" id={`${idPrefix}-weather-period`}>
              Valid: {rainData.validPeriod}
            </div>
          )}
          {rainData?.updatedAt && (
            <div className="weather-updated" id={`${idPrefix}-weather-updated`}>
              Last updated {rainData.updatedAt}
            </div>
          )}
        </div>
      )}

      {!isChangingArea && fetchState === 'success' && !currentAreaForecast && (
        <div className="status-banner empty">
          {SENTENCES.RAIN.empty(selectedArea)}
        </div>
      )}
    </section>
  );
};
