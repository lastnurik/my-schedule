import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Newspaper, Settings as SettingsIcon } from "lucide-react";
import { Button } from "./ui/button";

function Navbar () {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-md px-2">
      <div
        className="flex justify-between items-center px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl"
        style={{
          background: 'var(--card-bg)',
          borderColor: 'var(--card-border)'
        }}
      > 
        <Button
          variant="ghost"
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all duration-200`}
          style={{
            color: location.pathname === '/' ? 'var(--tabs-active-text)' : 'var(--tabs-text)',
            background: location.pathname === '/' ? 'var(--tabs-active-bg)' : 'transparent',
            boxShadow: location.pathname === '/' ? '0 0 0 2px var(--card-border)' : undefined
          }}
          onClick={() => navigate('/')}
        >
          <Calendar className="h-6 w-6" />
          <span className="text-xs font-semibold">Schedule</span>
        </Button>
        <Button
          variant="ghost"
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all duration-200`}
          style={{
            color: location.pathname === '/map' ? 'var(--tabs-active-text)' : 'var(--tabs-text)',
            background: location.pathname === '/map' ? 'var(--tabs-active-bg)' : 'transparent',
            boxShadow: location.pathname === '/map' ? '0 0 0 2px var(--card-border)' : undefined
          }}
          onClick={() => navigate('/map')}
        >
          <MapPin className="h-6 w-6" />
          <span className="text-xs font-semibold">Map</span>
        </Button>
        <Button
          variant="ghost"
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all duration-200`}
          style={{
            color: location.pathname === '/news' ? 'var(--tabs-active-text)' : 'var(--tabs-text)',
            background: location.pathname === '/news' ? 'var(--tabs-active-bg)' : 'transparent',
            boxShadow: location.pathname === '/news' ? '0 0 0 2px var(--card-border)' : undefined
          }}
          onClick={() => navigate('/news')}
        >
          <Newspaper className="h-6 w-6" />
          <span className="text-xs font-semibold">Assignments</span>
        </Button>
        <Button
          variant="ghost"
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all duration-200`}
          style={{
            color: location.pathname === '/settings' ? 'var(--tabs-active-text)' : 'var(--tabs-text)',
            background: location.pathname === '/settings' ? 'var(--tabs-active-bg)' : 'transparent',
            boxShadow: location.pathname === '/settings' ? '0 0 0 2px var(--card-border)' : undefined
          }}
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