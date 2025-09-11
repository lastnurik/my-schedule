import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Newspaper, Settings as SettingsIcon } from "lucide-react";
import { Button } from "./ui/button";

import { useEffect, useState } from "react";
function Navbar () {
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(typeof window !== 'undefined' ? (localStorage.getItem('theme') || 'dark-blue') : 'dark-blue');
  useEffect(() => {
    const handler = () => setTheme(localStorage.getItem('theme') || 'dark-blue');
    window.addEventListener('storage', handler);
    // Listen for custom theme change event
    const customHandler = () => setTheme(localStorage.getItem('theme') || 'dark-blue');
    window.addEventListener('themechange', customHandler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('themechange', customHandler);
    };
  }, []);
  let navBg = '', tabActive = '', tabInactive = '', tabHover = '';
  if (theme === 'dark-blue') {
    navBg = 'bg-gradient-to-br from-[#232A4D] to-[#181C3A] border-blue-900';
    tabActive = 'text-white bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg ring-2 ring-blue-400';
    tabInactive = 'text-blue-300';
    tabHover = 'hover:bg-blue-900/40';
  } else if (theme === 'white') {
    navBg = 'bg-white border-slate-200';
    tabActive = 'text-slate-700 bg-gradient-to-r from-slate-100 to-white shadow-lg ring-2 ring-slate-400';
    tabInactive = 'text-slate-500';
    tabHover = 'hover:bg-slate-100';
  } else {
    navBg = 'bg-gradient-to-br from-[#3A181C] to-[#4D232A] border-red-900';
    tabActive = 'text-white bg-gradient-to-r from-red-700 to-pink-700 shadow-lg ring-2 ring-red-400';
    tabInactive = 'text-red-300';
    tabHover = 'hover:bg-red-900/40';
  }
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-md px-2">
      <div className={`flex justify-between items-center px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl ${navBg}`}> 
        <Button
          variant="ghost"
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all duration-200 ${location.pathname === '/' ? tabActive : tabInactive} ${tabHover}`}
          onClick={() => navigate('/')}
        >
          <Calendar className="h-6 w-6" />
          <span className="text-xs font-semibold">Schedule</span>
        </Button>
        <Button
          variant="ghost"
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all duration-200 ${location.pathname === '/map' ? tabActive : tabInactive} ${tabHover}`}
          onClick={() => navigate('/map')}
        >
          <MapPin className="h-6 w-6" />
          <span className="text-xs font-semibold">Map</span>
        </Button>
        <Button
          variant="ghost"
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all duration-200 ${location.pathname === '/news' ? tabActive : tabInactive} ${tabHover}`}
          onClick={() => navigate('/news')}
        >
          <Newspaper className="h-6 w-6" />
          <span className="text-xs font-semibold">Assignments</span>
        </Button>
        <Button
          variant="ghost"
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all duration-200 ${location.pathname === '/settings' ? tabActive : tabInactive} ${tabHover}`}
          onClick={() => navigate('/settings')}
        >
          <SettingsIcon className="h-6 w-6" />
          <span className="text-xs font-semibold">Settings</span>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;