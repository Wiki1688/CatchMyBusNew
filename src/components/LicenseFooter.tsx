import React from 'react';

export const LicenseFooter: React.FC = () => {
  // Format accessed date as requested
  const accessDate = new Date().toLocaleDateString('en-SG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <footer className="app-footer" id="app-license-footer">
      <p>
        Contains information from LTA DataMall Bus Arrival, accessed {accessDate}, made available
        under the terms of the Singapore Open Data Licence version 1.0, data.gov.sg/open-data-licence.
      </p>
      <p>
        Contains information from data.gov.sg Two-hour Weather Forecast, accessed {accessDate}, made
        available under the terms of the Singapore Open Data Licence version 1.0, data.gov.sg/open-data-licence.
      </p>
      <p>
        Contains information from LTA DataMall Bus Stops, accessed {accessDate}, made available under the terms of the Singapore Open Data Licence version 1.0, data.gov.sg/open-data-licence.
      </p>
    </footer>
  );
};
