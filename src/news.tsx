import React from "react";
import { Newspaper, Calendar, MapPin, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

function NewsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const handleNav = (path: string) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-24">
      <div className="flex flex-col items-center gap-4">
        <Newspaper className="h-16 w-16 text-pink-500" />
        <h2 className="text-2xl font-bold text-slate-700">News</h2>
        <p className="text-slate-500">News features coming soon.</p>
      </div>
      {/* Fixed Footer Navbar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-lg">
        <div className="max-w-2xl mx-auto flex justify-between items-center px-6 py-2">
          <Button
            variant="ghost"
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg ${location.pathname === '/' ? 'text-indigo-600' : 'text-slate-500'}`}
            onClick={() => handleNav('/')}
          >
            <Calendar className="h-6 w-6" />
            <span className="text-xs">Main</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg ${location.pathname === '/map' ? 'text-purple-600' : 'text-slate-500'}`}
            onClick={() => handleNav('/map')}
          >
            <MapPin className="h-6 w-6" />
            <span className="text-xs">Map</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg ${location.pathname === '/news' ? 'text-pink-600' : 'text-slate-500'}`}
            onClick={() => handleNav('/news')}
          >
            <Newspaper className="h-6 w-6" />
            <span className="text-xs">News</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg ${location.pathname === '/settings' ? 'text-indigo-500' : 'text-slate-500'}`}
            onClick={() => handleNav('/settings')}
          >
            <SettingsIcon className="h-6 w-6" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}

export default NewsPage;
