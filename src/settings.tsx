import React from "react";
// Import schedule and filters from localStorage
function getHiddenSubjects() {
  const lastGroup = localStorage.getItem('lastGroup');
  if (!lastGroup) return [];
  const hidden = localStorage.getItem(`hiddenSubjects_${lastGroup}`);
  return hidden ? JSON.parse(hidden) : [];
}
function getScheduleForGroup() {
  const lastGroup = localStorage.getItem('lastGroup');
  if (!lastGroup) return {};
  const data = localStorage.getItem(`schedule_${lastGroup}`);
  return data ? JSON.parse(data) : {};
}
import { Settings, Calendar, MapPin, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

function SettingsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const handleNav = (path: string) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };
  // State for toggles and time selection

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-24">
      <div className="max-w-xl mx-auto w-full flex flex-col gap-8 pt-10 pb-4">
        <div className="flex flex-col items-center gap-4">
          <Settings className="h-16 w-16 text-indigo-500" />
          <h2 className="text-2xl font-bold text-slate-700">Settings</h2>
        </div>

        {/* Contact Section */}
        <div className="bg-white/90 rounded-xl border border-slate-200 shadow-lg px-6 py-6 flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Contact</h3>
          <div className="flex gap-4">
            <Button asChild variant="outline" className="flex items-center gap-2">
              <a href="https://t.me/last_nurik" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-telegram"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>
                Telegram
              </a>
            </Button>
            <Button asChild variant="outline" className="flex items-center gap-2">
              <a href="https://instagram.com/last.nurik" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="3"/><path d="M17.5 6.5v.001"/></svg>
                Instagram
              </a>
            </Button>
            <Button asChild variant="outline" className="flex items-center gap-2">
              <a href="https://github.com/lastnurik" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77a5.07 5.07 0 0 0-.09-3.77S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                GitHub
              </a>
            </Button>
          </div>
        </div>


        {/* Theme Section (placeholder) */}
        <div className="bg-white/90 rounded-xl border border-slate-200 shadow-lg px-6 py-6 flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Theme</h3>
          <span className="text-slate-400">Theme selection coming soon...</span>
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
            <Settings className="h-6 w-6" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}

export default SettingsPage;
