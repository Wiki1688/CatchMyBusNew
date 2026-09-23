import React from 'react';
import { CuteBusBanner } from './CuteBusBanner.tsx';
import { WeatherIcon } from './WeatherIcon.tsx';

interface GreetingHeaderProps {
  name: string;
  onEditName?: () => void;
  selectedArea?: string;
  forecast?: string;
}

export const GreetingHeader: React.FC<GreetingHeaderProps> = ({
  name,
  onEditName,
  selectedArea,
  forecast,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return `Good morning, ${name}`;
    }
    if (hour < 18) {
      return `Good afternoon, ${name}`;
    }
    return `Good evening, ${name}`;
  };

  return (
    <header className="top-header" id="app-header">
      {/* Cheerful cute caricature banner with bright colors */}
      <div className="header-hero-banner" id="header-hero-banner">
        <CuteBusBanner />
      </div>

      <div className="top-header-row">
        <div className="top-header-left">
          <span className="app-brand">Catch My Bus!</span>
          {onEditName && (
            <button
              type="button"
              className="name-change-btn"
              onClick={onEditName}
              aria-label="Change name"
              id="change-name-btn"
            >
              Change name
            </button>
          )}
        </div>

        {/* Live weather icon for the selected area */}
        {forecast && selectedArea && (
          <div
            className="top-weather-pill"
            id="top-live-weather"
            title={`Current weather in ${selectedArea}: ${forecast}`}
            aria-label={`Current weather in ${selectedArea}: ${forecast}`}
          >
            <WeatherIcon forecast={forecast} size={24} />
            <div className="top-weather-info">
              <span className="top-weather-condition">{forecast}</span>
              <span className="top-weather-area">{selectedArea}</span>
            </div>
          </div>
        )}
      </div>

      <h1 className="greeting-text" id="greeting-heading">
        {getGreeting()}
      </h1>
    </header>
  );
};

