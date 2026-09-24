import React, { useEffect } from 'react';

interface DisqusPageConfig {
  url?: string;
  identifier?: string;
  [key: string]: unknown;
}

interface DisqusContext {
  page?: DisqusPageConfig;
  [key: string]: unknown;
}

declare global {
  interface Window {
    disqus_config?: (this: DisqusContext) => void;
    DISQUS?: {
      reset: (options: {
        reload: boolean;
        config?: (this: DisqusContext) => void;
      }) => void;
    };
  }
}

export const DisqusComments: React.FC = () => {
  useEffect(() => {
    const pageUrl = 'https://catchmybusnew.vercel.app';
    const pageIdentifier = 'home';

    try {
      // Set Disqus configuration variables safely
      const setupDisqusConfig = function (this: DisqusContext | void) {
        const ctx: DisqusContext = (this && typeof this === 'object') ? (this as DisqusContext) : ((window as unknown) as DisqusContext);
        if (!ctx.page) {
          ctx.page = {};
        }
        ctx.page.url = pageUrl;
        ctx.page.identifier = pageIdentifier;
      };

      window.disqus_config = setupDisqusConfig as (this: DisqusContext) => void;

      // Load the Disqus script only once, even when re-rendered or tab-switched
      if (window.DISQUS && typeof window.DISQUS.reset === 'function') {
        window.DISQUS.reset({
          reload: true,
          config: setupDisqusConfig as (this: DisqusContext) => void,
        });
      } else if (!document.getElementById('disqus-embed-script')) {
        const s = document.createElement('script');
        s.id = 'disqus-embed-script';
        s.src = 'https://catchmybus.disqus.com/embed.js';
        s.setAttribute('data-timestamp', String(+new Date()));
        s.async = true;
        s.onerror = (e) => {
          if (typeof e === 'object' && e && 'preventDefault' in e) {
            (e as Event).preventDefault();
          }
        };
        (document.head || document.body).appendChild(s);
      }
    } catch {
      // Ignore initialization errors in restricted sandboxes
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
