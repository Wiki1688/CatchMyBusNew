import React, { useEffect } from 'react';

declare global {
  interface Window {
    disqus_config?: (this: { page: { url: string; identifier: string } }) => void;
    DISQUS?: {
      reset: (options: {
        reload: boolean;
        config?: (this: { page: { url: string; identifier: string } }) => void;
      }) => void;
    };
  }
}

export const DisqusComments: React.FC = () => {
  useEffect(() => {
    const pageUrl = 'https://catchmybusnew.vercel.app';
    const pageIdentifier = 'home';

    // Set Disqus configuration variables
    window.disqus_config = function () {
      this.page.url = pageUrl;
      this.page.identifier = pageIdentifier;
    };

    // Load the Disqus script only once, even when re-rendered or tab-switched
    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
        config: function () {
          this.page.url = pageUrl;
          this.page.identifier = pageIdentifier;
        },
      });
    } else if (!document.getElementById('disqus-embed-script')) {
      const s = document.createElement('script');
      s.id = 'disqus-embed-script';
      s.src = 'https://catchmybus.disqus.com/embed.js';
      s.setAttribute('data-timestamp', String(+new Date()));
      s.async = true;
      (document.head || document.body).appendChild(s);
    }
  }, []);

  return (
    <section className="disqus-card" aria-label="Community Feedback">
      <p className="disqus-invite-line">
        Please share your feedback below on what worked for you and what didn't!
      </p>
      <div id="disqus_thread" />
      <noscript>
        Please enable JavaScript to view the{' '}
        <a href="https://disqus.com/?ref_noscript" rel="nofollow">
          comments powered by Disqus.
        </a>
      </noscript>
    </section>
  );
};
