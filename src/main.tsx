import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource-variable/inter';
import '@fontsource-variable/anek-latin';
import '@fontsource-variable/anek-devanagari';
import '@fontsource-variable/noto-sans-devanagari';
import '@fontsource-variable/jetbrains-mono';
import 'leaflet/dist/leaflet.css';
import './tailwind.css';
import './index.css';
import App from './App';
import { applyStoredTheme } from './core/context/ThemeContext';

applyStoredTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
