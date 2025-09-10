import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "./components/Navbar";
import { useState } from "react";

function SettingsPage() {
  const [calendarUrl, setCalendarUrl] = useState(localStorage.getItem("calendarUrl") || "");

  const handleFetch = () => {
    localStorage.setItem("calendarUrl", calendarUrl);
    // You can add fetch logic here if needed
    alert("Calendar URL saved!");
  };

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
              <a href="t.me/nurik_xxx7" target="_blank" rel="noopener noreferrer">
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

        {/* Calendar URL Section */}
        <div className="bg-white/90 rounded-xl border border-slate-200 shadow-lg px-6 py-6 flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Import Assignments Calendar</h3>
          <p className="text-slate-500 text-sm">Paste your Moodle calendar export URL below. You can get it from your LMS calendar export page.</p>
          <input
            type="text"
            className="border rounded px-3 py-2 w-full max-w-md"
            placeholder="Paste calendar URL here..."
            value={calendarUrl}
            onChange={e => setCalendarUrl(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <Button onClick={handleFetch}>Fetch</Button>
          </div>
          <div className="mt-1 text-s text-blue-500"><a href="https://lms.astanait.edu.kz/calendar/export.php?">link</a></div>
          <div className="mt-1 text-xs text-slate-400">Instruction: Go to your LMS calendar, find export, copy the link and paste here.</div>
          <div className="flex gap-2 mt-2">
            <img src="/guide.jpg" alt="Instruction 1" className="w-32 border rounded" />
          </div>
        </div>

        {/* Theme Section (placeholder) */}
        <div className="bg-white/90 rounded-xl border border-slate-200 shadow-lg px-6 py-6 flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Theme</h3>
          <span className="text-slate-400">Theme selection coming soon...</span>
        </div>
      </div>
      {/* Fixed Footer Navbar */}
      <Navbar />
    </div>
  );
}

export default SettingsPage;
