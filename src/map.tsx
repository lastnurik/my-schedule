import { useEffect, useState } from "react";
import { MapPin, Calendar, Newspaper, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
function MapPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mapHtml, setMapHtml] = useState<string | null>(null);

  // Try to cache the map HTML in localStorage for offline use
  useEffect(() => {
    const cacheKey = 'aituMapHtml';
    const fetchAndCache = async () => {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          setMapHtml(cached);
        } else {
          const resp = await fetch('https://yuujiso.github.io/aitumap');
          if (resp.ok) {
            const html = await resp.text();
            setMapHtml(html);
            localStorage.setItem(cacheKey, html);
          }
        }
      } catch {
        // ignore errors, fallback to iframe
      }
    };
    fetchAndCache();
  }, []);

  const handleNav = (path: string) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-24">
      <div className="flex flex-col items-center w-full pt-6" style={{ flex: 1 }}>
        <div className="w-full max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4 justify-center">
            <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-md">
              <MapPin className="h-8 w-8 text-white" />
            </span>
            <h2 className="text-3xl font-bold text-slate-700 tracking-tight">Campus Map</h2>
          </div>
          <div className="bg-white/90 rounded-2xl border border-slate-200 shadow-xl px-0 py-0 flex flex-col items-center" style={{ minHeight: 'calc(70vh)' }}>
            {/* Try to use cached HTML if available and online, else fallback to iframe */}
            {mapHtml ? (
              <iframe
                srcDoc={mapHtml}
                title="AITU Map"
                className="w-full h-[65vh] md:h-[70vh] rounded-xl overflow-hidden border-none"
                style={{ border: 0, minHeight: '350px' }}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                allowFullScreen
              />
            ) : (
              <iframe
                src="https://yuujiso.github.io/aitumap"
                title="AITU Map"
                className="w-full h-[65vh] md:h-[70vh] rounded-xl overflow-hidden border-none"
                style={{ border: 0, minHeight: '350px' }}
                allowFullScreen
              />
            )}
          </div>
          <div className="text-center text-xs text-slate-400 mt-2">Powered by <a href="https://yuujiso.github.io/aitumap" target="_blank" rel="noopener noreferrer" className="underline">AITU Map</a></div>
        </div>
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

export default MapPage;
