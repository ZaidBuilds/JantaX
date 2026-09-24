import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './tailwind.css';
import 'leaflet/dist/leaflet.css';
import { registerServiceWorker } from './core/pwa/registerServiceWorker';

registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
