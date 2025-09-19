import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "./components/Navbar";
import { useState, useEffect, useRef } from "react";


// --- Extracted Components ---
const GlowingBackground = ({ theme }: { theme: string }) => (
  <div className="absolute inset-0 pointer-events-none z-0">
    <div className={
      "absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] rounded-full blur-3xl opacity-70 " +
      (theme === 'dark-blue'
        ? "bg-gradient-to-br from-blue-700/40 via-indigo-600/30 to-purple-700/20"
        : theme === 'dark-red'
        ? "bg-gradient-to-br from-red-700/40 via-pink-700/30 to-red-900/20"
        : "bg-white")
    } />
    <div className={
      "absolute bottom-0 right-0 w-[40vw] h-[30vw] rounded-full blur-2xl opacity-60 " +
      (theme === 'dark-blue'
        ? "bg-gradient-to-tr from-purple-600/30 via-blue-500/20 to-indigo-700/10"
        : theme === 'dark-red'
        ? "bg-gradient-to-tr from-pink-600/30 via-red-500/20 to-red-900/10"
        : "bg-white")
    } />
  </div>
);

const ContactSection = () => (
  <div className="rounded-2xl shadow-2xl px-6 py-6 flex flex-col gap-4 border-2"
    style={{ background: 'var(--card-bg)', borderColor: 'var(--contact-border)' }}>
    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--contact-title)' }}>Contact</h3>
    <div className="flex gap-4">
      <Button asChild variant="outline" className="flex items-center gap-2"
        style={{ color: 'var(--contact-text)', borderColor: 'var(--contact-border)', background: 'var(--contact-btn)' }}>
        <a href="https://t.me/nurik_xxx7" target="_blank" rel="noopener noreferrer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-telegram"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>
          Telegram
        </a>
      </Button>
      <Button asChild variant="outline" className="flex items-center gap-2"
        style={{ color: 'var(--contact-text)', borderColor: 'var(--contact-border)', background: 'var(--contact-btn)' }}>
        <a href="https://instagram.com/last.nurik" target="_blank" rel="noopener noreferrer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="3"/><path d="M17.5 6.5v.001"/></svg>
          Instagram
        </a>
      </Button>
      <Button asChild variant="outline" className="flex items-center gap-2"
        style={{ color: 'var(--contact-text)', borderColor: 'var(--contact-border)', background: 'var(--contact-btn)' }}>
        <a href="https://github.com/lastnurik" target="_blank" rel="noopener noreferrer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77a5.07 5.07 0 0 0-.09-3.77S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          GitHub
        </a>
      </Button>
    </div>
  </div>
);

const CalendarUrlSection = ({ calendarUrl, setCalendarUrl, handleFetch }: any) => (
  <div className="rounded-2xl shadow-2xl px-6 py-6 flex flex-col gap-4 border-2"
    style={{ background: 'var(--card-bg)', borderColor: 'var(--calendar-border)' }}>
    <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--calendar-title)' }}>Import Assignments Calendar</h3>
    <div className="flex flex-col items-center gap-3">
      <img src="/guide.jpg" alt="Instruction 1" className="w-40 border rounded mb-2" style={{ borderColor: 'var(--calendar-border)' }} />
      <div className="text-xs text-center mb-2" style={{ color: 'var(--calendar-text)' }}>Instruction: Go to your LMS calendar, find export, copy the link and paste here.</div>
      <div className="text-xs text-center mb-2" style={{ color: 'var(--calendar-text)' }}>Example link: <a href="https://lms.astanait.edu.kz/calendar/export.php?" className="underline">lms.astanait.edu.kz/calendar/export.php?</a></div>
    </div>
    <div className="flex flex-col gap-2 mt-2">
      <label className="text-sm mb-1" htmlFor="calendar-url-input" style={{ color: 'var(--calendar-text)' }}>Paste your Moodle calendar export URL below:</label>
      <div className="flex gap-2 w-full">
        <input
          id="calendar-url-input"
          type="text"
          className="border rounded px-3 py-2 flex-1"
          style={{ borderColor: 'var(--calendar-border)', background: 'var(--input-bg)', color: 'var(--input-text)' }}
          placeholder="Paste calendar URL here..."
          value={calendarUrl}
          onChange={e => setCalendarUrl(e.target.value)}
        />
        <Button onClick={handleFetch} className="font-semibold shadow-md rounded-xl px-6 py-2" style={{ background: 'var(--fetch-btn)', color: 'var(--card-text)' }}>Fetch</Button>
      </div>
    </div>
  </div>
);

const IosSetupSection = () => (
  <div className="rounded-2xl shadow-2xl px-6 py-6 flex flex-col gap-4 border-2"
    style={{ background: 'var(--card-bg)', borderColor: 'var(--calendar-border)' }}>
    <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--calendar-title)' }}>iOS Setup: Add as App (PWA)</h3>
    <div className="flex flex-col items-center gap-3">
      <div className="text-sm text-center mb-2" style={{ color: 'var(--calendar-text)' }}>To install this app on your iPhone or iPad home screen:</div>
      <ol className="text-xs list-decimal list-inside mb-2 text-left max-w-md" style={{ color: 'var(--calendar-text)' }}>
        <li>Open this website in Safari on your iOS device.</li>
        <li>Tap the <b>Share</b> button (the square with an arrow pointing up).</li>
        <li>Scroll down and tap <b>Add to Home Screen</b>.</li>
        <li>Confirm by tapping <b>Add</b> in the top right corner.</li>
      </ol>
      <div className="flex flex-row gap-3 justify-center mt-2">
        <img src="/step1.jpg" alt="Step 1" className="w-24 border rounded" style={{ borderColor: 'var(--calendar-border)' }} />
        <img src="/step2.jpg" alt="Step 2" className="w-24 border rounded" style={{ borderColor: 'var(--calendar-border)' }} />
        <img src="/step3.jpg" alt="Step 3" className="w-24 border rounded" style={{ borderColor: 'var(--calendar-border)' }} />
      </div>
    </div>
  </div>
);

const ThemeSection = ({ theme, setTheme }: any) => (
  <div className="rounded-2xl border shadow-2xl px-6 py-6 flex flex-col gap-4" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--theme-title)' }}>Theme</h3>
    <div className="flex gap-3">
      <button
        className="px-4 py-2 rounded-lg font-semibold shadow transition-all duration-200 border-2 text-sm"
        style={{ background: theme === "dark-blue" ? 'var(--theme-btn-active)' : 'var(--theme-btn)', color: theme === "dark-blue" ? '#fff' : 'var(--theme-text)', borderColor: 'var(--card-border)' }}
        onClick={() => setTheme("dark-blue")}
      >Dark Blue</button>
      <button
        className="px-4 py-2 rounded-lg font-semibold shadow transition-all duration-200 border-2 text-sm"
        style={{ background: theme === "white" ? 'var(--theme-btn-active)' : 'var(--theme-btn)', color: theme === "white" ? 'var(--card-text)' : 'var(--theme-text)', borderColor: 'var(--card-border)' }}
        onClick={() => setTheme("white")}
      >White</button>
      <button
        className="px-4 py-2 rounded-lg font-semibold shadow transition-all duration-200 border-2 text-sm"
        style={{ background: theme === "dark-red" ? 'var(--theme-btn-active)' : 'var(--theme-btn)', color: theme === "dark-red" ? '#fff' : 'var(--theme-text)', borderColor: 'var(--card-border)' }}
        onClick={() => setTheme("dark-red")}
      >Dark Red</button>
    </div>
    <span style={{ color: 'var(--theme-text)' }}>Choose your preferred theme for the app.</span>
  </div>
);

function SettingsPage() {
  const [calendarUrl, setCalendarUrl] = useState(localStorage.getItem("calendarUrl") || "");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "white");
  const initialTheme = useRef(localStorage.getItem("theme") || "white");

  useEffect(() => {
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

  return (
    <div
      className={
        "min-h-screen w-full pb-24 pt-8 px-2 md:px-0 relative flex flex-col " +
        (theme === 'dark-blue'
          ? "bg-gradient-to-br from-[#181C3A] via-[#232A4D] to-[#2B3562]"
          : theme === 'dark-red'
          ? "bg-gradient-to-br from-[#3A181C] via-[#4D232A] to-[#2B181C]"
          : "bg-white")
      }
    >
      <GlowingBackground theme={theme} />
      <div className="relative z-10 max-w-md mx-auto w-full flex flex-col gap-8 pt-10 pb-4">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full p-3 shadow-lg" style={{ background: 'var(--fetch-btn)' }}>
            <Settings className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--contact-text)' }}>Settings</h2>
        </div>
        <ContactSection />
        <CalendarUrlSection calendarUrl={calendarUrl} setCalendarUrl={setCalendarUrl} handleFetch={handleFetch} />
        <IosSetupSection />
        <ThemeSection theme={theme} setTheme={setTheme} />
      </div>
      <div className="fixed bottom-0 left-0 w-full z-20">
        <Navbar />
      </div>
    </div>
  );
}

export default SettingsPage;
