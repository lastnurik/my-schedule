import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";

import App from "./App.tsx";
import MapPage from "./map";
import NewsPage from "./news";
import SettingsPage from "./settings";
import "./index.css";
import { useRegisterSW } from "virtual:pwa-register/react";

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

// 🔹 Page wrapper with swipe support
const pages = ["/", "/map", "/news", "/settings"];

function SwipeRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const index = pages.indexOf(location.pathname);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      <AnimatePresence initial={false} custom={index}>
        <motion.div
          key={location.pathname}
          className="absolute top-0 left-0 w-full h-full"
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
            const swipe = Math.abs(info.offset.x) * info.velocity.x;
            const threshold = 8000;

            if (swipe < -threshold && index < pages.length - 1) {
              navigate(pages[index + 1]);
            } else if (swipe > threshold && index > 0) {
              navigate(pages[index - 1]);
            }
          }}
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<App />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/">
      <SwipeRoutes />
      <PWAUpdateHandler />
    </BrowserRouter>
  </StrictMode>
);
