import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-routes-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const urlObj = new URL(req.url || '/', 'http://localhost');
            const pathname = urlObj.pathname;

            const adaptRes = (res) => {
              res.status = (code) => {
                res.statusCode = code;
                return res;
              };
              res.json = (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                return res;
              };
              res.send = (body) => {
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                res.end(body);
                return res;
              };
              return res;
            };

            const adaptReq = (req, urlObj) => {
              const query = {};
              urlObj.searchParams.forEach((v, k) => {
                query[k] = v;
              });
              req.query = query;
              return req;
            };

            if (pathname === '/api/bus') {
              try {
                const { default: busHandler } = await import('./api/bus.js');
                await busHandler(adaptReq(req, urlObj), adaptRes(res));
                return;
              } catch (err) {
                console.error('Error in /api/bus:', err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
              }
            }

            if (pathname === '/api/rain') {
              try {
                const { default: rainHandler } = await import('./api/rain.js');
                await rainHandler(adaptReq(req, urlObj), adaptRes(res));
                return;
              } catch (err) {
                console.error('Error in /api/rain:', err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
              }
            }

            if (pathname === '/api/stop') {
              try {
                const { default: stopHandler } = await import('./api/stop.js');
                await stopHandler(adaptReq(req, urlObj), adaptRes(res));
                return;
              } catch (err) {
                console.error('Error in /api/stop:', err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
              }
            }

            if (pathname === '/api/health') {
              try {
                const { default: healthHandler } = await import('./api/health.js');
                await healthHandler(adaptReq(req, urlObj), adaptRes(res));
                return;
              } catch (err) {
                console.error('Error in /api/health:', err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
              }
            }

            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
