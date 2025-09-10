import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Newspaper, Settings as SettingsIcon } from "lucide-react";
import { Button } from "./ui/button";

function Navbar () {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 w-full h-15 z-50 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-lg">
      <div className="max-w-2xl mx-auto flex justify-between items-center px-6 py-3">
        <Button
          variant="ghost"
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg ${location.pathname === '/' ? 'text-indigo-600' : 'text-slate-500'}`}
          onClick={() => navigate('/')}
        >
          <Calendar className="h-6 w-6" />
          <span className="text-xs">Main</span>
        </Button>
        <Button
          variant="ghost"
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg ${location.pathname === '/map' ? 'text-purple-600' : 'text-slate-500'}`}
          onClick={() => navigate('/map')}
        >
          <MapPin className="h-6 w-6" />
          <span className="text-xs">Map</span>
        </Button>
        <Button
          variant="ghost"
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg ${location.pathname === '/news' ? 'text-pink-600' : 'text-slate-500'}`}
          onClick={() => navigate('/news')}
        >
          <Newspaper className="h-6 w-6" />
          <span className="text-xs">Assignments</span>
        </Button>
        <Button
          variant="ghost"
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg ${location.pathname === '/settings' ? 'text-indigo-500' : 'text-slate-500'}`}
          onClick={() => navigate('/settings')}
        >
          <SettingsIcon className="h-6 w-6" />
          <span className="text-xs">Settings</span>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;