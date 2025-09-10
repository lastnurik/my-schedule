import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.tsx';
import MapPage from './map';
import NewsPage from './news';
import SettingsPage from './settings';
import './index.css';



import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

function UpdateToast({ onUpdate }: { readonly onUpdate: () => void }) {
  return (
    <div style={{position:'fixed',bottom:80,left:'50%',transform:'translateX(-50%)',background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.12)',padding:'16px 24px',zIndex:9999,display:'flex',alignItems:'center',gap:12,fontFamily:'sans-serif'}}>
      <span style={{color:'#4f46e5',fontWeight:600}}>New version available!</span>
      <button style={{background:'#4f46e5',color:'#fff',border:'none',borderRadius:8,padding:'8px 16px',fontWeight:500,cursor:'pointer'}} onClick={onUpdate}>Update</button>
    </div>
  );
}

function PWAUpdateHandler() {
  const { needRefresh, updateServiceWorker } = useRegisterSW();
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    if (needRefresh) setShowUpdate(true);
  }, [needRefresh]);

  return showUpdate ? (
    <UpdateToast onUpdate={() => {
      updateServiceWorker(true);
      setShowUpdate(false);
    }} />
  ) : null;
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
