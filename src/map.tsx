import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MapPin } from "lucide-react";
import Navbar from "./components/Navbar";
// @ts-ignore
import AITUMap from "./aitumap/src/app/App.jsx";
import { useThemeClass } from "./useThemeClass";

function MapPage() {
  useThemeClass();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    // Get ?search= param from URL
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    if (search) setSearchQuery(search);
    else setSearchQuery("");
  }, [location.search]);

  return (
    <div
      className={
        "min-h-screen w-full pb-24 pt-8 px-2 md:px-0 relative flex flex-col items-center " +
        (document.documentElement.classList.contains('theme-dark-blue')
          ? "bg-gradient-to-br from-[#181C3A] via-[#232A4D] to-[#2B3562]"
          : document.documentElement.classList.contains('theme-dark-red')
          ? "bg-gradient-to-br from-[#3A181C] via-[#4D232A] to-[#2B181C]"
          : "bg-white")
      }
      style={{ color: 'var(--card-text)' }}
    >
      {/* Glowing background effect */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={
          "absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] rounded-full blur-3xl opacity-70 " +
          (document.documentElement.classList.contains('theme-dark-blue')
            ? "bg-gradient-to-br from-blue-700/40 via-indigo-600/30 to-purple-700/20"
            : document.documentElement.classList.contains('theme-dark-red')
            ? "bg-gradient-to-br from-red-700/40 via-pink-700/30 to-red-900/20"
            : "bg-white")
        } />
        <div className={
          "absolute bottom-0 right-0 w-[40vw] h-[30vw] rounded-full blur-2xl opacity-60 " +
          (document.documentElement.classList.contains('theme-dark-blue')
            ? "bg-gradient-to-tr from-purple-600/30 via-blue-500/20 to-indigo-700/10"
            : document.documentElement.classList.contains('theme-dark-red')
            ? "bg-gradient-to-tr from-pink-600/30 via-red-500/20 to-red-900/10"
            : "bg-white")
        } />
      </div>
      <div className="relative z-10 flex flex-col items-center w-full pt-6" style={{ flex: 1 }}>
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-4 justify-center">
            <span className="inline-flex items-center justify-center p-3 rounded-full shadow-lg"
              style={{ background: 'var(--icon-bg)' }}>
              <MapPin className="h-8 w-8" style={{ color: 'var(--icon-text)' }} />
            </span>
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--card-text)' }}>Map</h2>
          </div>
          <div className="text-center text-xs mb-2" style={{ color: 'var(--info-text)' }}>Instantly find your classroom by clicking on them</div>
          <div className="rounded-2xl shadow-2xl px-0 py-0 flex flex-col items-center"
            style={{
              background: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
              minHeight: 'calc(70vh)',
              width: '100%',
              maxWidth: '420px',
              overflow: 'hidden'
            }}>
            <div
              className="aitumap-root w-full h-full"
              style={{
                color: 'inherit',
                background: 'inherit',
                minHeight: 'calc(70vh)',
                width: '100%',
                maxWidth: '420px',
                overflow: 'hidden'
              }}
            >
              <AITUMap search={searchQuery} />
            </div>
          </div>
          <div className="text-center text-xs mt-2" style={{ color: 'var(--info-text)' }}>
            Powered by <a href="https://yuujiso.github.io/aitumap" target="_blank" rel="noopener noreferrer" className="underline">AITU Map</a>
          </div>
        </div>
      </div>
      {/* Fixed Footer Navbar */}
      <div className="fixed bottom-0 left-0 w-full z-20">
        <Navbar />
      </div>
    </div>
  );
}

export default MapPage;
