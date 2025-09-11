import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MapPin } from "lucide-react";
import Navbar from "./components/Navbar";
// @ts-ignore: Allow importing .jsx in TSX
import AITUMap from "./aitumap/src/app/App";

// If you have App.tsx, make sure it has: export default function App() { ... }
// If your build system requires .js extension, use:
// import AITUMap from "./aitumap/src/app/App.js";


function MapPage() {
  const location = useLocation();
  const [theme, setTheme] = useState(typeof window !== 'undefined' ? (localStorage.getItem('theme') || 'white') : 'white');
  useEffect(() => {
    const handler = () => setTheme(localStorage.getItem('theme') || 'white');
    window.addEventListener('storage', handler);
    window.addEventListener('themechange', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('themechange', handler);
    };
  }, []);
  let pageBg = '', glow1 = '', glow2 = '', cardBg = '', cardText = '', cardBorder = '', iconBg = '', iconText = '', infoText = '';
  if (theme === 'dark-blue') {
    pageBg = 'bg-gradient-to-br from-[#181C3A] via-[#232A4D] to-[#2B3562]';
    glow1 = 'bg-gradient-to-br from-blue-700/40 via-indigo-600/30 to-purple-700/20';
    glow2 = 'bg-gradient-to-tr from-purple-600/30 via-blue-500/20 to-indigo-700/10';
    cardBg = 'bg-gradient-to-br from-[#232A4D] to-[#181C3A]';
    cardText = 'text-white';
    cardBorder = 'border-blue-900';
    iconBg = 'bg-gradient-to-br from-blue-500 to-indigo-600';
    iconText = 'text-white';
    infoText = 'text-blue-300';
  } else if (theme === 'white') {
    pageBg = 'bg-white';
    glow1 = 'bg-white';
    glow2 = 'bg-white';
    cardBg = 'bg-white';
    cardText = 'text-slate-700';
    cardBorder = 'border-slate-200';
    iconBg = 'bg-gradient-to-br from-slate-100 to-white';
    iconText = 'text-slate-700';
    infoText = 'text-slate-400';
  } else {
    pageBg = 'bg-gradient-to-br from-[#3A181C] via-[#4D232A] to-[#2B181C]';
    glow1 = 'bg-gradient-to-br from-red-700/40 via-pink-700/30 to-red-900/20';
    glow2 = 'bg-gradient-to-tr from-pink-600/30 via-red-500/20 to-red-900/10';
    cardBg = 'bg-gradient-to-br from-[#3A181C] to-[#4D232A]';
    cardText = 'text-red-200';
    cardBorder = 'border-red-900';
    iconBg = 'bg-gradient-to-br from-red-700 to-pink-700';
    iconText = 'text-white';
    infoText = 'text-red-200';
  }
  const [searchQuery, setSearchQuery] = useState<string>("");
  useEffect(() => {
    // Get ?search= param from URL
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    if (search) setSearchQuery(search);
    else setSearchQuery("");
  }, [location.search]);
  return (
    <div className={`min-h-screen w-full ${pageBg} pb-24 pt-8 px-2 md:px-0 relative flex flex-col`}>
      {/* Glowing background effect */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] ${glow1} rounded-full blur-3xl opacity-70`} />
        <div className={`absolute bottom-0 right-0 w-[40vw] h-[30vw] ${glow2} rounded-full blur-2xl opacity-60`} />
      </div>
      <div className="relative z-10 flex flex-col items-center w-full pt-6" style={{ flex: 1 }}>
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-4 justify-center">
            <span className={`inline-flex items-center justify-center p-3 rounded-full shadow-lg ${iconBg}`}>
              <MapPin className={`h-8 w-8 ${iconText}`} />
            </span>
            <h2 className={`text-2xl font-bold tracking-tight ${cardText}`}>Map</h2>
          </div>
          <div className={`text-center text-xs mb-2 ${infoText}`}>Instantly find your classroom by clicking on them</div>
          <div className={`rounded-2xl shadow-2xl px-0 py-0 flex flex-col items-center ${cardBg} ${cardBorder}`} style={{ minHeight: 'calc(70vh)', width: '100%', maxWidth: '420px', overflow: 'hidden' }}>
            {/* Directly render the AITUMap React component, passing searchQuery as a prop */}
            <div style={{ width: '100%', maxWidth: '420px', overflow: 'hidden' }}>
              <AITUMap search={searchQuery} />
            </div>
          </div>
          <div className={`text-center text-xs mt-2 ${infoText}`}>Powered by <a href="https://yuujiso.github.io/aitumap" target="_blank" rel="noopener noreferrer" className="underline">AITU Map</a></div>
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
