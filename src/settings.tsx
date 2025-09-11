
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "./components/Navbar";
import { useState, useEffect, useRef } from "react";

function SettingsPage() {
  const [calendarUrl, setCalendarUrl] = useState(localStorage.getItem("calendarUrl") || "");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "white");

  const initialTheme = useRef(localStorage.getItem("theme") || "white");
  useEffect(() => {
    // Apply theme class to <html> for global styling
    const html = document.documentElement;
    html.classList.remove("theme-dark-blue", "theme-white", "theme-dark-red");
    if (theme === "dark-blue") {
      html.classList.add("theme-dark-blue");
    } else if (theme === "white") {
      html.classList.add("theme-white");
    } else if (theme === "dark-red") {
      html.classList.add("theme-dark-red");
    }
    localStorage.setItem("theme", theme);
    // Only redirect if theme is changed from initial value
    if (theme !== initialTheme.current) {
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
  }, [theme]);

  const handleFetch = () => {
    localStorage.setItem("calendarUrl", calendarUrl);
    alert("Calendar URL saved!");
  };

  // Theme classes for the whole page and theme card
  let pageBg = "", glow1 = "", glow2 = "", contactBg = "", contactTitle = "", contactText = "", contactBorder = "", inputBg = "", inputText = "", inputPlaceholder = "", fetchBtn = "", calendarBg = "", calendarTitle = "", calendarText = "", calendarBorder = "", themeBg = "", themeTitle = "", themeText = "", themeBtn = "", themeBtnActive = "", lectureText = "", contactBtn = "";
  if (theme === "dark-blue") {
  contactBtn = "bg-blue-900/40 hover:bg-blue-900/60";
    pageBg = "bg-gradient-to-br from-[#181C3A] via-[#232A4D] to-[#2B3562]";
    glow1 = "bg-gradient-to-br from-blue-700/40 via-indigo-600/30 to-purple-700/20";
    glow2 = "bg-gradient-to-tr from-purple-600/30 via-blue-500/20 to-indigo-700/10";
    contactBg = "bg-gradient-to-br from-[#232A4D] to-[#181C3A]";
    contactTitle = "text-blue-200";
    contactText = "text-blue-200";
    contactBorder = "border-blue-900";
    inputBg = "bg-[#232A4D]";
    inputText = "text-white";
    inputPlaceholder = "placeholder:text-blue-300";
    fetchBtn = "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-400";
    calendarBg = "bg-gradient-to-br from-[#232A4D] to-[#181C3A]";
    calendarTitle = "text-blue-200";
    calendarText = "text-blue-300";
    calendarBorder = "border-blue-900";
    themeBg = "bg-gradient-to-br from-[#232A4D] to-[#181C3A] border-blue-900";
    themeTitle = "text-blue-200";
    themeText = "text-blue-300";
    themeBtn = "bg-blue-900/10 text-blue-300 border-blue-200 hover:bg-blue-900/20";
    themeBtnActive = "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-400";
    lectureText = "text-purple-300";
  } else if (theme === "white") {
  contactBtn = "bg-slate-100 hover:bg-slate-200";
    pageBg = "bg-white";
    glow1 = "bg-white";
    glow2 = "bg-white";
    contactBg = "bg-white";
    contactTitle = "text-slate-700";
    contactText = "text-slate-700";
    contactBorder = "border-slate-200";
    inputBg = "bg-white";
    inputText = "text-slate-700";
    inputPlaceholder = "placeholder:text-slate-400";
    fetchBtn = "bg-gradient-to-r from-slate-100 to-white text-slate-700 border-slate-400";
    calendarBg = "bg-white";
    calendarTitle = "text-slate-700";
    calendarText = "text-slate-400";
    calendarBorder = "border-slate-200";
    themeBg = "bg-white border-slate-200";
    themeTitle = "text-slate-700";
    themeText = "text-slate-400";
    themeBtn = "bg-white/80 text-slate-500 border-slate-200 hover:bg-slate-100";
    themeBtnActive = "bg-gradient-to-r from-slate-100 to-white text-slate-700 border-slate-400";
    lectureText = "text-red-500";
  } else {
  contactBtn = "bg-red-900/40 hover:bg-red-900/60";
    pageBg = "bg-gradient-to-br from-[#3A181C] via-[#4D232A] to-[#2B181C]";
    glow1 = "bg-gradient-to-br from-red-700/40 via-pink-700/30 to-red-900/20";
    glow2 = "bg-gradient-to-tr from-pink-600/30 via-red-500/20 to-red-900/10";
    contactBg = "bg-gradient-to-br from-[#3A181C] to-[#4D232A]";
    contactTitle = "text-red-200";
    contactText = "text-red-200";
    contactBorder = "border-red-900";
    inputBg = "bg-[#4D232A]";
    inputText = "text-red-200";
    inputPlaceholder = "placeholder:text-red-200";
    fetchBtn = "bg-gradient-to-r from-red-700 to-pink-700 text-white border-red-400";
    calendarBg = "bg-gradient-to-br from-[#3A181C] to-[#4D232A]";
    calendarTitle = "text-red-200";
    calendarText = "text-red-200";
    calendarBorder = "border-red-900";
    themeBg = "bg-gradient-to-br from-[#3A181C] to-[#4D232A] border-red-900";
    themeTitle = "text-red-200";
    themeText = "text-red-200";
    themeBtn = "bg-red-900/10 text-red-300 border-red-200 hover:bg-red-900/20";
    themeBtnActive = "bg-gradient-to-r from-red-700 to-pink-700 text-white border-red-400";
    lectureText = "text-pink-300";
  }

  return (
  <div className={`min-h-screen w-full ${pageBg} pb-24 pt-8 px-2 md:px-0 relative flex flex-col`}>
      {/* Glowing background effect */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] ${glow1} rounded-full blur-3xl opacity-70`} />
        <div className={`absolute bottom-0 right-0 w-[40vw] h-[30vw] ${glow2} rounded-full blur-2xl opacity-60`} />
      </div>
      <div className="relative z-10 max-w-md mx-auto w-full flex flex-col gap-8 pt-10 pb-4">
        <div className="flex flex-col items-center gap-4">
          <div className={`${fetchBtn} rounded-full p-3 shadow-lg`}>
            <Settings className="h-10 w-10" />
          </div>
          <h2 className={`text-2xl font-bold tracking-tight ${contactText}`}>Settings</h2>
        </div>

        {/* Contact Section */}
  <div className={`${contactBg} rounded-2xl shadow-2xl px-6 py-6 flex flex-col gap-4 border-2 ${contactBorder}`}>
          <h3 className={`text-lg font-semibold mb-2 ${contactTitle}`}>Contact</h3>
          <div className="flex gap-4">
              <Button asChild variant="outline" className={`flex items-center gap-2 ${contactText} ${contactBorder} ${contactBtn}`}> 
              <a href="https://t.me/nurik_xxx7" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-telegram"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>
                Telegram
              </a>
            </Button>
              <Button asChild variant="outline" className={`flex items-center gap-2 ${contactText} ${contactBorder} ${contactBtn}`}>
              <a href="https://instagram.com/last.nurik" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="3"/><path d="M17.5 6.5v.001"/></svg>
                Instagram
              </a>
            </Button>
              <Button asChild variant="outline" className={`flex items-center gap-2 ${contactText} ${contactBorder} ${contactBtn}`}>
              <a href="https://github.com/lastnurik" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77a5.07 5.07 0 0 0-.09-3.77S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                GitHub
              </a>
            </Button>
          </div>
        </div>

        {/* Calendar URL Section */}
        <div className={`${calendarBg} rounded-2xl shadow-2xl px-6 py-6 flex flex-col gap-4 border-2 ${calendarBorder}`}>
          <h3 className={`text-lg font-semibold mb-4 ${calendarTitle}`}>Import Assignments Calendar</h3>
          <div className="flex flex-col items-center gap-3">
            <img src="/guide.jpg" alt="Instruction 1" className={`w-40 border rounded ${calendarBorder} mb-2`} />
            <div className={`text-xs ${calendarText} text-center mb-2`}>Instruction: Go to your LMS calendar, find export, copy the link and paste here.</div>
            <div className={`text-xs ${calendarText} text-center mb-2`}>Example link: <a href="https://lms.astanait.edu.kz/calendar/export.php?" className="underline">lms.astanait.edu.kz/calendar/export.php?</a></div>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <label className={`text-sm ${calendarText} mb-1`} htmlFor="calendar-url-input">Paste your Moodle calendar export URL below:</label>
            <div className="flex gap-2 w-full">
              <input
                id="calendar-url-input"
                type="text"
                className={`border rounded px-3 py-2 flex-1 ${calendarBorder} ${inputBg} ${inputText} ${inputPlaceholder}`}
                placeholder="Paste calendar URL here..."
                value={calendarUrl}
                onChange={e => setCalendarUrl(e.target.value)}
              />
              <Button onClick={handleFetch} className={`font-semibold shadow-md rounded-xl px-6 py-2 ${fetchBtn}`}>Fetch</Button>
            </div>
          </div>
        </div>

        {/* iOS Setup Section */}
        <div className={`${calendarBg} rounded-2xl shadow-2xl px-6 py-6 flex flex-col gap-4 border-2 ${calendarBorder}`}>
          <h3 className={`text-lg font-semibold mb-4 ${calendarTitle}`}>iOS Setup: Add as App (PWA)</h3>
          <div className="flex flex-col items-center gap-3">
            <div className={`text-sm ${calendarText} text-center mb-2`}>To install this app on your iPhone or iPad home screen:</div>
            <ol className={`text-xs ${calendarText} list-decimal list-inside mb-2 text-left max-w-md`}>
              <li>Open this website in Safari on your iOS device.</li>
              <li>Tap the <b>Share</b> button (the square with an arrow pointing up).</li>
              <li>Scroll down and tap <b>Add to Home Screen</b>.</li>
              <li>Confirm by tapping <b>Add</b> in the top right corner.</li>
            </ol>
            <div className="flex flex-row gap-3 justify-center mt-2">
              <img src="/step1.jpg" alt="Step 1" className={`w-24 border rounded ${calendarBorder}`} />
              <img src="/step2.jpg" alt="Step 2" className={`w-24 border rounded ${calendarBorder}`} />
              <img src="/step3.jpg" alt="Step 3" className={`w-24 border rounded ${calendarBorder}`} />
            </div>
          </div>
        </div>

        {/* Theme Section */}
        <div className={`rounded-2xl border shadow-2xl px-6 py-6 flex flex-col gap-4 ${themeBg}`}>
          <h3 className={`text-lg font-semibold mb-2 ${themeTitle}`}>Theme</h3>
          <div className="flex gap-3">
            <button
              className={`px-4 py-2 rounded-lg font-semibold shadow transition-all duration-200 border-2 text-sm ${theme === "dark-blue" ? themeBtnActive : themeBtn}`}
              onClick={() => setTheme("dark-blue")}
            >Dark Blue</button>
            <button
              className={`px-4 py-2 rounded-lg font-semibold shadow transition-all duration-200 border-2 text-sm ${theme === "white" ? themeBtnActive : themeBtn}`}
              onClick={() => setTheme("white")}
            >White</button>
            <button
              className={`px-4 py-2 rounded-lg font-semibold shadow transition-all duration-200 border-2 text-sm ${theme === "dark-red" ? themeBtnActive : themeBtn}`}
              onClick={() => setTheme("dark-red")}
            >Dark Red</button>
          </div>
          <span className={`${themeText}`}>Choose your preferred theme for the app.</span>
          {/* Practice/Lecture color demo removed as requested */}
        </div>
      </div>
      {/* Fixed Footer Navbar */}
      <div className="fixed bottom-0 left-0 w-full z-20">
        <Navbar />
      </div>
    </div>
  );
}

export default SettingsPage;
