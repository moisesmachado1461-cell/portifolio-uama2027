import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { PWAInstallPrompt } from './components/PWAInstallPrompt.tsx';
import './index.css';

const isAdminArea = window.location.pathname.startsWith('/admin');

const manifestLink = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
if (manifestLink) {
  manifestLink.href = isAdminArea ? '/admin-manifest.webmanifest' : '/manifest.webmanifest';
}

const appleTouchIcon = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');
if (appleTouchIcon) {
  appleTouchIcon.href = isAdminArea ? '/icons/uama-admin-192.png' : '/icons/uama-192.png';
}

const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
if (themeColor) {
  themeColor.content = isAdminArea ? '#24161B' : '#6B1F36';
}

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    const script = isAdminArea ? '/admin-sw.js' : '/sw.js';
    const scope = isAdminArea ? '/admin' : '/';

    navigator.serviceWorker
      .register(script, { scope })
      .catch((error) => console.error('Falha ao registrar o aplicativo:', error));
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <PWAInstallPrompt />
  </StrictMode>,
);
