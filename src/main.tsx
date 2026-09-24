// Suppress cross-origin third-party script errors (e.g. Disqus / tracking in iframe environments)
if (typeof window !== 'undefined') {
  const isExternalScriptError = (msg: unknown, src?: unknown) => {
    const msgStr = typeof msg === 'string' ? msg : '';
    const srcStr = typeof src === 'string' ? src : '';
    return (
      msgStr === 'Script error.' ||
      msgStr.includes('disqus') ||
      msgStr.includes('Disqus') ||
      srcStr.includes('disqus') ||
      srcStr.includes('disquscdn')
    );
  };

  window.addEventListener(
    'error',
    (event) => {
      if (isExternalScriptError(event.message, event.filename)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return true;
      }
    },
    true
  );

  const origOnError = window.onerror;
  window.onerror = function (msg, url, lineNo, colNo, err) {
    if (isExternalScriptError(msg, url)) {
      return true;
    }
    if (typeof origOnError === 'function') {
      return origOnError.apply(this, [msg, url, lineNo, colNo, err]);
    }
    return false;
  };

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      const reason = event.reason;
      const str = reason ? (reason.message || String(reason)) : '';
      if (isExternalScriptError(str)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
