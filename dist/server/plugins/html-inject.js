import { defineNitroPlugin } from 'nitropack/runtime/plugin';
export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('render:html', (html, { event }) => {
        html.head.push(`
      <style>
        .first-loader {
          position: fixed;
          z-index: 1000;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          height: 100vh;
          background-color: #FF4560;
          animation: body-load-effect 3s forwards;
        }
        
        .first-loader, .first-loader-logo {
          display: flex;
          width: 100%;
          justify-content: center;
          align-items: center;
        }
        
        .first-loader-logo {
          max-width: 800px;
          flex-direction: column;
          gap: 2rem;
          font-size: 3em;
          line-height: 1.4;
          font-weight: 600;
          animation: logo-load 3s forwards;
        }
        
        .first-loader-logo img {
          width: 200px;
          height: auto;
        }
        
        @keyframes body-load-effect {
          0% { opacity: 100%; z-index: 1000; }
          75% { opacity: 100%; z-index: 1000; }
          100% { opacity: 0; z-index: -100; }
        }
        
        @keyframes logo-load {
          0% { transform: scale(1.05); }
          60% { transform: scale(1); opacity: 1; }
          80% { transform: scale(.6); opacity: 0; }
          100% { opacity: 0; }
        }
      </style>
    `);
        html.body.unshift(`
      <div id="loader"></div>
      <div id="first-loader" class="first-loader">
        <div class="first-loader-logo">
          <img src="/assets/logo.png" alt="logo" />
        </div>
      </div>
    `);
    });
});
//# sourceMappingURL=html-inject.js.map