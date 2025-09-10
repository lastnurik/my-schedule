import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.tsx';
import MapPage from './map';
import NewsPage from './news';
import SettingsPage from './settings';
import './index.css';


import { registerSW } from 'virtual:pwa-register';

// Simple toast for update notification
function showUpdateToast(reloadFn: () => void) {
  const toast = document.createElement('div');
  toast.innerHTML = `
    <div style="position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#fff;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,0.12);padding:16px 24px;z-index:9999;display:flex;align-items:center;gap:12px;font-family:sans-serif">
      <span style="color:#4f46e5;font-weight:600">New version available!</span>
      <button style="background:#4f46e5;color:#fff;border:none;border-radius:8px;padding:8px 16px;font-weight:500;cursor:pointer">Update</button>
    </div>
  `;
  document.body.appendChild(toast);
  const btn = toast.querySelector('button');
  btn?.addEventListener('click', () => {
    reloadFn();
    document.body.removeChild(toast);
  });
}

registerSW({
  immediate: true,
  onNeedRefresh() {
    showUpdateToast(() => {
      window.location.reload();
    });
  },
  onOfflineReady() {
    // Optionally show a toast: "App is ready to work offline"
    // Uncomment below to enable
    // const toast = document.createElement('div');
    // toast.innerHTML = `<div style="position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#fff;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,0.12);padding:16px 24px;z-index:9999;font-family:sans-serif">App is ready to work offline</div>`;
    // document.body.appendChild(toast);
    // setTimeout(() => document.body.removeChild(toast), 3000);
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
