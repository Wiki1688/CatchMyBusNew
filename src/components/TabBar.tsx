import React from 'react';

export type ScreenTab = 'live' | 'favourites';

interface TabBarProps {
  activeTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  favouritesCount?: number;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onSelectTab, favouritesCount = 0 }) => {
  return (
    <nav className="bottom-tab-bar" aria-label="Bottom Navigation" id="bottom-tab-bar">
      <div className="tab-bar-inner">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'live' ? 'active' : ''}`}
          onClick={() => onSelectTab('live')}
          id="tab-live-arrivals"
          aria-current={activeTab === 'live' ? 'page' : undefined}
        >
          <span>Live Bus Arrivals</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'favourites' ? 'active' : ''}`}
          onClick={() => onSelectTab('favourites')}
          id="tab-my-favourites"
          aria-current={activeTab === 'favourites' ? 'page' : undefined}
        >
          <span>
            My Favourites {favouritesCount > 0 ? `(${favouritesCount})` : ''}
          </span>
        </button>
      </div>
    </nav>
  );
};
