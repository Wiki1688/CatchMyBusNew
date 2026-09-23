import React from 'react';

interface WeatherIconProps {
  forecast?: string;
  size?: number;
  className?: string;
}

/**
 * WeatherIcon returns a clean, crisp, colorful SVG icon representing
 * the Singapore data.gov.sg two-hour forecast conditions.
 */
export const WeatherIcon: React.FC<WeatherIconProps> = ({
  forecast = '',
  size = 28,
  className = '',
}) => {
  const f = forecast.toLowerCase();

  // Thunderstorm / Thundery Showers
  if (f.includes('thundery') || f.includes('thunder')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        role="img"
        aria-label={forecast || 'Thunderstorm'}
      >
        {/* Dark Cloud */}
        <path
          d="M8.5 20C6.57 20 5 18.43 5 16.5C5 14.73 6.32 13.27 8.05 13.04C8.71 10.15 11.27 8 14.33 8C17.07 8 19.41 9.72 20.31 12.22C20.69 12.08 21.09 12 21.5 12C23.43 12 25 13.57 25 15.5C25 17.29 23.65 18.77 21.92 18.97"
          fill="#64748B"
        />
        {/* Lightning bolt */}
        <path
          d="M15 18L12.5 23H16L14.5 28L20 21.5H16.5L18.5 18H15Z"
          fill="#F59E0B"
          stroke="#D97706"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Heavy Rain / Showers / Rain
  if (f.includes('heavy rain') || f.includes('passing showers') || f.includes('showers') || f.includes('rain')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        role="img"
        aria-label={forecast || 'Rain'}
      >
        {/* Blue-gray Cloud */}
        <path
          d="M9 19C7.07 19 5.5 17.43 5.5 15.5C5.5 13.73 6.82 12.27 8.55 12.04C9.21 9.15 11.77 7 14.83 7C17.57 7 19.91 8.72 20.81 11.22C21.19 11.08 21.59 11 22 11C23.93 11 25.5 12.57 25.5 14.5C25.5 16.32 24.11 17.82 22.33 17.97"
          fill="#0284C7"
          opacity="0.9"
        />
        {/* Raindrops */}
        <path d="M10 22L8 26" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
        <path d="M15 22L13 27" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 22L18 26" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // Cloudy / Overcast
  if (f.includes('overcast') || (f.includes('cloudy') && !f.includes('partly'))) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        role="img"
        aria-label={forecast || 'Cloudy'}
      >
        {/* Back cloud */}
        <path
          d="M17 14C15.6 14 14.4 14.8 13.8 16C13.5 15.9 13.2 15.8 12.8 15.8C11.3 15.8 10 17.1 10 18.6C10 20.1 11.3 21.4 12.8 21.4H22.5C24.4 21.4 26 19.8 26 17.9C26 16.1 24.6 14.6 22.8 14.4C22.2 12.4 20.3 11 18.1 11C17.7 11 17.3 11.1 17 11.2V14Z"
          fill="#94A3B8"
        />
        {/* Front cloud */}
        <path
          d="M9 22C7.34 22 6 20.66 6 19C6 17.47 7.14 16.21 8.63 16.02C9.2 13.54 11.39 11.7 14 11.7C16.34 11.7 18.34 13.17 19.12 15.31C19.45 15.19 19.79 15.12 20.15 15.12C21.8 15.12 23.15 16.47 23.15 18.12C23.15 19.71 21.91 21 20.35 21H9V22Z"
          fill="#CBD5E1"
        />
      </svg>
    );
  }

  // Partly Cloudy (Day / Night)
  if (f.includes('partly cloudy')) {
    const isNight = f.includes('night');
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        role="img"
        aria-label={forecast || 'Partly Cloudy'}
      >
        {isNight ? (
          // Crescent moon behind
          <path
            d="M17 7C14.5 7.5 12.6 9.8 12.6 12.5C12.6 15.7 15.2 18.3 18.4 18.3C19.7 18.3 20.9 17.8 21.8 17.1C21.1 19.9 18.6 22 15.5 22C11.9 22 9 19.1 9 15.5C9 12 11.8 9.1 15.3 9C15.9 7.7 16.4 7.2 17 7Z"
            fill="#FBBF24"
          />
        ) : (
          // Sun behind
          <circle cx="20" cy="11" r="6" fill="#F59E0B" />
        )}
        {/* Soft front cloud */}
        <path
          d="M9 22C7.34 22 6 20.66 6 19C6 17.47 7.14 16.21 8.63 16.02C9.2 13.54 11.39 11.7 14 11.7C16.34 11.7 18.34 13.17 19.12 15.31C19.45 15.19 19.79 15.12 20.15 15.12C21.8 15.12 23.15 16.47 23.15 18.12C23.15 19.71 21.91 21 20.35 21H9V22Z"
          fill="#94A3B8"
        />
        <path
          d="M8.5 21.5C7.12 21.5 6 20.38 6 19C6 17.72 6.96 16.66 8.21 16.52C8.68 14.44 10.52 12.89 12.72 12.89C14.69 12.89 16.38 14.13 17.03 15.92C17.31 15.82 17.6 15.76 17.9 15.76C19.29 15.76 20.42 16.89 20.42 18.28C20.42 19.61 19.38 20.69 18.07 20.69H8.5V21.5Z"
          fill="#E2E8F0"
        />
      </svg>
    );
  }

  // Fair / Sunny / Clear (Default)
  const isNight = f.includes('night');
  if (isNight) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        role="img"
        aria-label={forecast || 'Clear'}
      >
        <path
          d="M21 16.5C21 20.09 18.09 23 14.5 23C11.55 23 9.07 21.04 8.24 18.33C9.07 18.76 10.01 19 11 19C14.31 19 17 16.31 17 13C17 11.66 16.56 10.42 15.82 9.42C18.83 10.15 21 12.86 21 16.5Z"
          fill="#F59E0B"
        />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={forecast || 'Fair / Sunny'}
    >
      <circle cx="16" cy="16" r="7" fill="#F59E0B" />
      {/* Sun rays */}
      <path d="M16 4V7" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M16 25V28" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M4 16H7" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M25 16H28" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M7.5 7.5L9.6 9.6" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M22.4 22.4L24.5 24.5" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M7.5 24.5L9.6 22.4" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M22.4 9.6L24.5 7.5" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
};
