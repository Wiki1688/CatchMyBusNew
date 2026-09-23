import React, { useState } from 'react';
import { FavouriteStop } from './types.ts';
import { GreetingHeader } from './components/GreetingHeader.tsx';
import { NameModal } from './components/NameModal.tsx';
import { LiveArrivalsScreen } from './components/LiveArrivalsScreen.tsx';
import { FavouritesScreen } from './components/FavouritesScreen.tsx';
import { TabBar, ScreenTab } from './components/TabBar.tsx';
import { LicenseFooter } from './components/LicenseFooter.tsx';

export default function App() {
  // Screen tab state: 'live' or 'favourites'
  const [activeTab, setActiveTab] = useState<ScreenTab>('live');

  // Selected weather area (defaults to 'City', remembered in localStorage)
  const [selectedArea, setSelectedArea] = useState<string>(() => {
    return localStorage.getItem('catchMyBus.selectedArea') || 'City';
  });
  const [currentForecast, setCurrentForecast] = useState<string>('');

  const handleSelectArea = (area: string) => {
    setSelectedArea(area);
    localStorage.setItem('catchMyBus.selectedArea', area);
  };

  // User's first name, stored in localStorage under 'catchMyBus.name'
  const [name, setName] = useState<string>(() => {
    return localStorage.getItem('catchMyBus.name') || '';
  });
  const [showNameModal, setShowNameModal] = useState<boolean>(() => {
    return !localStorage.getItem('catchMyBus.name');
  });

  // Favourites, stored under 'catchMyBus.favourites'
  const [favourites, setFavourites] = useState<FavouriteStop[]>(() => {
    try {
      const stored = localStorage.getItem('catchMyBus.favourites');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore parse error
    }
    return [];
  });

  // Save name handler
  const handleSaveName = (newName: string) => {
    localStorage.setItem('catchMyBus.name', newName);
    setName(newName);
    setShowNameModal(false);
  };

  // Update favourites handler
  const handleUpdateFavourites = (updated: FavouriteStop[]) => {
    setFavourites(updated);
    localStorage.setItem('catchMyBus.favourites', JSON.stringify(updated));
  };

  // Toggle favourite bus at a stop from Screen 1
  const handleToggleFavourite = (
    stopCode: string,
    serviceNo: string,
    currentArea: string
  ) => {
    const existingIndex = favourites.findIndex((f) => f.stopCode === stopCode);

    if (existingIndex >= 0) {
      const existingStop = favourites[existingIndex];
      const hasService = existingStop.services.includes(serviceNo);

      if (hasService) {
        // Remove service
        const remainingServices = existingStop.services.filter((s) => s !== serviceNo);
        if (remainingServices.length === 0) {
          // Removing the last bus removes the card
          const nextList = favourites.filter((f) => f.stopCode !== stopCode);
          handleUpdateFavourites(nextList);
        } else {
          const nextList = favourites.map((f) =>
            f.stopCode === stopCode ? { ...f, services: remainingServices } : f
          );
          handleUpdateFavourites(nextList);
        }
      } else {
        // Add service
        const nextList = favourites.map((f) =>
          f.stopCode === stopCode
            ? {
                ...f,
                services: [...f.services, serviceNo],
              }
            : f
        );
        handleUpdateFavourites(nextList);
      }
    } else {
      // New stop card: stopName is initialized to stopCode
      const newStop: FavouriteStop = {
        stopCode,
        stopName: stopCode,
        area: currentArea || 'City',
        services: [serviceNo],
      };
      handleUpdateFavourites([...favourites, newStop]);
    }
  };

  return (
    <div className="app-container" id="app-root-container">
      {/* First-time first name prompt */}
      {showNameModal && (
        <NameModal
          currentName={name}
          onSaveName={handleSaveName}
          onCancel={name ? () => setShowNameModal(false) : undefined}
        />
      )}

      {/* Greeting by name and time of day at top of both screens */}
      {name && (
        <GreetingHeader
          name={name}
          onEditName={() => setShowNameModal(true)}
          selectedArea={selectedArea}
          forecast={currentForecast}
        />
      )}

      {/* Screen 1: Live Bus Arrivals */}
      {activeTab === 'live' && (
        <LiveArrivalsScreen
          favourites={favourites}
          onToggleFavourite={handleToggleFavourite}
          selectedArea={selectedArea}
          onSelectArea={handleSelectArea}
          onWeatherUpdate={setCurrentForecast}
        />
      )}

      {/* Screen 2: My Favourites */}
      {activeTab === 'favourites' && (
        <FavouritesScreen
          favourites={favourites}
          onUpdateFavourites={handleUpdateFavourites}
          selectedArea={selectedArea}
          onWeatherUpdate={setCurrentForecast}
        />
      )}

      {/* Mandatory licensing footer */}
      <LicenseFooter />

      {/* Fixed bottom two-tab bar */}
      <TabBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        favouritesCount={favourites.length}
      />
    </div>
  );
}
