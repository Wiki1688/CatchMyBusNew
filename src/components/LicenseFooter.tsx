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
      <p>
        This page uses Microsoft Clarity and Disqus, which use cookies to record how visitors use the
        site and to host comments. By using this page you agree that we and Microsoft may collect and
        use this data. See the{' '}
        <a
          href="https://www.microsoft.com/privacy/privacystatement"
          target="_blank"
          rel="noopener noreferrer"
        >
          Microsoft Privacy Statement (https://www.microsoft.com/privacy/privacystatement)
        </a>
        , the{' '}
        <a
          href="https://disqus.com/privacy-policy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Disqus privacy policy (https://disqus.com/privacy-policy/)
        </a>{' '}
        and the{' '}
        <a
          href="https://disqus.com/data-sharing-settings/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Disqus data sharing settings (https://disqus.com/data-sharing-settings/)
        </a>
        .
      </p>
    </footer>
  );
};
