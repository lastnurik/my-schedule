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
  const [calendarUrl] = useState<string>(() => localStorage.getItem("calendarUrl") || "");
  const [icsData, setIcsData] = useState<string>("");
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
          setIcsData(ics);
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
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-24">
      <div className="w-full max-w-2xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-4 mb-6">
          <Newspaper className="h-16 w-16 text-pink-500" />
          <h2 className="text-2xl font-bold text-slate-700">Assignments & Deadlines</h2>
          {loading && <div className="text-slate-500">Loading assignments...</div>}
          {error && <div className="text-red-500">{error}</div>}
        </div>
        {events.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Upcoming Assignments</h3>
            <div className="grid gap-4">
              {events
                .filter(ev => !ev.summary?.startsWith("Attendance "))
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
                      className={`bg-white rounded-lg shadow p-4 flex flex-col gap-2 cursor-pointer transition-all duration-200 ${isExpanded ? 'ring-2 ring-indigo-300' : ''}`}
                      onClick={() => toggleCard(index)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-indigo-700 text-lg">{course}</span>
                        <span className="text-xs text-slate-400">{formatDate(ev.start)}</span>
                      </div>
                      <div className="text-slate-700 text-base font-semibold">{assignment}</div>
                      <div className={`text-slate-500 text-sm overflow-hidden ${isExpanded ? '' : 'line-clamp-2'}`}>{info}</div>
                      <div className="flex justify-between items-center text-xs mt-2">
                        <span className="font-bold text-red-700 text-bg">⏳ Time left: {timeRemaining(ev.start)}</span>
                        <div className="flex items-center">
                          {ev.location && <span className="text-slate-400 mr-2">{ev.location}</span>}
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-slate-400" />
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
          <div className="bg-white rounded-lg shadow p-4 mt-4">
            <h3 className="text-lg font-semibold mb-2">Calendar (coming soon)</h3>
            <div className="text-slate-400 text-sm">A visual calendar will be shown here in future updates.</div>
          </div>
        )}
      </div>
      <Navbar />
    </div>
  );
}

export default AssignmentsPage;