import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.tsx';
import MapPage from './map';
import NewsPage from './news';
import SettingsPage from './settings';
import './index.css';
import { useRegisterSW } from 'virtual:pwa-register/react';

// UpdateToast removed

function PWAUpdateHandler() {
  const { needRefresh, updateServiceWorker } = useRegisterSW();
  useEffect(() => {
    if (needRefresh) {
      updateServiceWorker(true);
    }
  }, [needRefresh, updateServiceWorker]);
  return null;
}

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
      <PWAUpdateHandler />
    </BrowserRouter>
  </StrictMode>
)
