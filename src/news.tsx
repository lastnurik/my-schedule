import { useState, useEffect } from "react";
import { Newspaper, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "./components/Navbar";

interface CalendarEvent {
  summary: string;
  start: string;
  end: string;
  description: string;
  location: string;
  categories: string;
}

function parseICS(ics: string): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const blocks = ics.split("BEGIN:VEVENT").slice(1);
  for (const block of blocks) {
    const lines = block.split(/\r?\n/);
    const event: Partial<CalendarEvent> = {};
    let flag = false;
    for (const line of lines) {
      if (line.startsWith("SUMMARY:")) event.summary = line.slice(8);
      else if (line.startsWith("DTSTART:")) event.start = line.slice(8);
      else if (line.startsWith("DTEND:")) event.end = line.slice(6);
      else if (line.startsWith("DESCRIPTION:")) {
        flag = true;
        event.description = line.slice(12);
      }
      else if (line.startsWith("LOCATION:")) event.location = line.slice(9);
      else if (line.startsWith("CATEGORIES:")) event.categories = line.slice(11);
      else if (flag === true) {
        if (line.startsWith("CLASS")) {
          flag = false;
          continue;
        }
        event.description += line;
      }
    }
    console.log(event);
    if (event.summary && event.start) {
      events.push(event as CalendarEvent);
    }
  }
  return events;
}

function formatDate(dt: string): string {
  if (!dt) return "";
  if (dt.length >= 8) {
    const y = dt.slice(0, 4), m = dt.slice(4, 6), d = dt.slice(6, 8);
    return `${d}.${m}.${y}`;
  }
  return dt;
}

function timeRemaining(dt: string): string {
  if (!dt) return "";
  const now = new Date();
  let target: Date;
  if (dt.length >= 15) {
    target = new Date(Date.UTC(
      parseInt(dt.slice(0, 4)),
      parseInt(dt.slice(4, 6)) - 1,
      parseInt(dt.slice(6, 8)),
      parseInt(dt.slice(9, 11)),
      parseInt(dt.slice(11, 13)),
      parseInt(dt.slice(13, 15))
    ));
  } else if (dt.length >= 8) {
    target = new Date(
      parseInt(dt.slice(0, 4)),
      parseInt(dt.slice(4, 6)) - 1,
      parseInt(dt.slice(6, 8))
    );
  } else {
    return "";
  }
  const diff = target.getTime() - now.getTime();
  if (diff < 0) return "Expired";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  return `${days}d ${hours}h ${mins}m`;
}

function formatDescription(text: string): string {
  if (!text) return "";
  return text.replace(/\\n/g, '\n').replace(/\\+/g, '').trim();
}

function AssignmentsPage() {
  // Get theme from localStorage
  const theme = typeof window !== 'undefined' ? (localStorage.getItem('theme') || 'white') : 'white';
  let pageBg = '', glow1 = '', glow2 = '', cardBg = '', cardText = '', cardBorder = '', badgeBg = '', badgeText = '', dateText = '', infoText = '', timeText = '', locationText = '', calendarBg = '', calendarBorder = '', calendarTitle = '', calendarText = '';
  if (theme === 'dark-blue') {
    pageBg = 'bg-gradient-to-br from-[#181C3A] via-[#232A4D] to-[#2B3562]';
    glow1 = 'bg-gradient-to-br from-blue-700/40 via-indigo-600/30 to-purple-700/20';
    glow2 = 'bg-gradient-to-tr from-purple-600/30 via-blue-500/20 to-indigo-700/10';
    cardBg = 'bg-gradient-to-br from-[#232A4D] to-[#181C3A]';
    cardText = 'text-white';
    cardBorder = 'border-blue-900';
    badgeBg = 'bg-gradient-to-br from-blue-500 to-indigo-600';
    badgeText = 'text-white';
    dateText = 'text-blue-300';
    infoText = 'text-blue-200';
    timeText = 'text-pink-400';
    locationText = 'text-blue-300';
    calendarBg = 'bg-gradient-to-br from-[#232A4D] to-[#181C3A]';
    calendarBorder = 'border-blue-900';
    calendarTitle = 'text-blue-200';
    calendarText = 'text-blue-300';
  } else if (theme === 'white') {
    pageBg = 'bg-white';
    glow1 = 'bg-white';
    glow2 = 'bg-white';
    cardBg = 'bg-white';
    cardText = 'text-slate-700';
    cardBorder = 'border-slate-200';
    badgeBg = 'bg-gradient-to-br from-slate-100 to-white';
    badgeText = 'text-slate-700';
    dateText = 'text-slate-400';
    infoText = 'text-slate-700';
    timeText = 'text-pink-400';
    locationText = 'text-slate-400';
    calendarBg = 'bg-white';
    calendarBorder = 'border-slate-200';
    calendarTitle = 'text-slate-700';
    calendarText = 'text-slate-400';
  } else {
    pageBg = 'bg-gradient-to-br from-[#3A181C] via-[#4D232A] to-[#2B181C]';
    glow1 = 'bg-gradient-to-br from-red-700/40 via-pink-700/30 to-red-900/20';
    glow2 = 'bg-gradient-to-tr from-pink-600/30 via-red-500/20 to-red-900/10';
    cardBg = 'bg-gradient-to-br from-[#3A181C] to-[#4D232A]';
    cardText = 'text-red-200';
    cardBorder = 'border-red-900';
    badgeBg = 'bg-gradient-to-br from-red-700 to-pink-700';
    badgeText = 'text-white';
    dateText = 'text-red-200';
    infoText = 'text-red-200';
    timeText = 'text-pink-400';
    locationText = 'text-red-200';
    calendarBg = 'bg-gradient-to-br from-[#3A181C] to-[#4D232A]';
    calendarBorder = 'border-red-900';
    calendarTitle = 'text-red-200';
    calendarText = 'text-red-200';
  }
  const [calendarUrl] = useState<string>(() => localStorage.getItem("calendarUrl") || "");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (calendarUrl) {
      setLoading(true);
      setError("");
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(calendarUrl)}`;
      fetch(proxyUrl)
        .then((r) => r.text())
        .then((ics) => {
          setEvents(parseICS(ics));
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch calendar. Check the URL or try uploading the file manually.");
          setLoading(false);
        });
    }
  }, [calendarUrl]);

  const toggleCard = (index: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCards(newExpanded);
  };

  return (
  <div className={`min-h-screen w-full ${pageBg} pb-24 pt-8 px-2 md:px-0 relative flex flex-col items-center`}>
      {/* Glowing background effect */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] ${glow1} rounded-full blur-3xl opacity-70`} />
        <div className={`absolute bottom-0 right-0 w-[40vw] h-[30vw] ${glow2} rounded-full blur-2xl opacity-60`} />
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className={`${badgeBg} rounded-full p-3 shadow-lg`}>
            <Newspaper className={`h-8 w-8 ${badgeText}`} />
          </div>
          <h2 className={`text-2xl font-bold tracking-tight ${cardText}`}>Assignments & Deadlines</h2>
          {loading && <div className={`${infoText}`}>Loading assignments...</div>}
          {error && <div className="text-red-400">{error}</div>}
        </div>
        {events.length > 0 && (
          <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-2 ${calendarTitle}`}>Upcoming Assignments</h3>
            <div className="grid gap-4">
              {events
                .filter(ev => !ev.summary?.startsWith("Attendance "))
                .filter(ev => timeRemaining(ev.end) != "Expired")
                .sort((a, b) => {
                  const getTime = (dt: string) => {
                    if (!dt) return Infinity;
                    if (dt.length >= 15) {
                      return Date.UTC(
                        parseInt(dt.slice(0, 4)),
                        parseInt(dt.slice(4, 6)) - 1,
                        parseInt(dt.slice(6, 8)),
                        parseInt(dt.slice(9, 11)),
                        parseInt(dt.slice(11, 13)),
                        parseInt(dt.slice(13, 15))
                      );
                    } else if (dt.length >= 8) {
                      return new Date(
                        parseInt(dt.slice(0, 4)),
                        parseInt(dt.slice(4, 6)) - 1,
                        parseInt(dt.slice(6, 8))
                      ).getTime();
                    } else {
                      return Infinity;
                    }
                  };
                  return getTime(a.start) - getTime(b.start);
                })
                .map((ev, index) => {
                  const course = ev.categories ? ev.categories.split("|")[0].trim() : "Assignment";
                  const assignment = ev.summary || "Assignment";
                  const info = formatDescription(ev.description) || "";
                  const isExpanded = expandedCards.has(index);
                  return (
                    <div
                      key={`${ev.summary}-${ev.start}-${index}`}
                      className={`${cardBg} rounded-2xl shadow-2xl p-4 flex flex-col gap-2 cursor-pointer transition-all duration-200 border ${cardBorder} ${cardText} ${isExpanded ? (theme === 'dark-blue' ? 'ring-2 ring-blue-400' : theme === 'white' ? 'ring-2 ring-slate-400' : 'ring-2 ring-red-400') : ''}`}
                      onClick={() => toggleCard(index)}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`font-bold text-lg ${calendarTitle}`}>{course}</span>
                        <span className={`text-xs ${dateText}`}>{formatDate(ev.start)}</span>
                      </div>
                      <div className={`text-base font-semibold ${cardText}`}>{assignment}</div>
                      <div className={`text-sm overflow-hidden ${infoText} ${isExpanded ? '' : 'line-clamp-2'}`}>{info}</div>
                      <div className="flex justify-between items-center text-xs mt-2">
                        <span className={`font-bold ${timeText} text-bg`}>⏳ Time left: {timeRemaining(ev.start)}</span>
                        <div className="flex items-center">
                          {ev.location && <span className={`${locationText} mr-2`}>{ev.location}</span>}
                          {isExpanded ? (
                            <ChevronUp className={`h-4 w-4 ${locationText}`} />
                          ) : (
                            <ChevronDown className={`h-4 w-4 ${locationText}`} />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
        {events.length > 0 && (
          <div className={`${calendarBg} rounded-2xl shadow-2xl p-4 mt-4 border ${calendarBorder}`}>
            <h3 className={`text-lg font-semibold mb-2 ${calendarTitle}`}>Calendar (coming soon)</h3>
            <div className={`text-sm ${calendarText}`}>A visual calendar will be shown here in future updates.</div>
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 w-full z-20">
        <Navbar />
      </div>
    </div>
  );
}

export default AssignmentsPage;