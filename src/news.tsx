import { useState, useEffect } from "react";
import { Newspaper, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "./components/Navbar";
import { useThemeClass } from "./useThemeClass";

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
  // --- Extracted Components ---
  const GlowingBackground = () => (
    <div className="absolute inset-0 pointer-events-none z-0">
      <div className={
        "absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] rounded-full blur-3xl opacity-70 " +
        (document.documentElement.classList.contains('theme-dark-blue')
          ? "bg-gradient-to-br from-blue-700/40 via-indigo-600/30 to-purple-700/20"
          : document.documentElement.classList.contains('theme-dark-red')
          ? "bg-gradient-to-br from-red-700/40 via-pink-700/30 to-red-900/20"
          : "bg-white")
      } />
      <div className={
        "absolute bottom-0 right-0 w-[40vw] h-[30vw] rounded-full blur-2xl opacity-60 " +
        (document.documentElement.classList.contains('theme-dark-blue')
          ? "bg-gradient-to-tr from-purple-600/30 via-blue-500/20 to-indigo-700/10"
          : document.documentElement.classList.contains('theme-dark-red')
          ? "bg-gradient-to-tr from-pink-600/30 via-red-500/20 to-red-900/10"
          : "bg-white")
      } />
    </div>
  );

  const AssignmentsHeader = ({ loading, error }: { loading: boolean, error: string }) => (
    <div className="flex flex-col items-center gap-4 mb-6">
      <div className="rounded-full p-3 shadow-lg" style={{ background: 'var(--badge-lecture)' }}>
        <Newspaper className="h-8 w-8" style={{ color: 'var(--icon-text)' }} />
      </div>
      <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--card-text)' }}>Assignments & Deadlines</h2>
      {loading && <div style={{ color: 'var(--info-text)' }}>Loading assignments...</div>}
      {error && <div className="text-red-400">{error}</div>}
    </div>
  );

  const AssignmentCard = ({ ev, index, expanded, onToggle, onHide, getAssignmentKey }: any) => {
    const course = ev.categories ? ev.categories.split("|")[0].trim() : "Assignment";
    const assignment = ev.summary || "Assignment";
    const info = formatDescription(ev.description) || "";
    return (
      <div
        key={getAssignmentKey(ev, index)}
        className="rounded-2xl shadow-2xl p-4 flex flex-col gap-2 cursor-pointer transition-all duration-200 border"
        style={{
          background: 'var(--card-bg)',
          color: 'var(--card-text)',
          borderColor: 'var(--card-border)',
          boxShadow: expanded ? '0 0 0 2px var(--card-border)' : undefined
        }}
        onClick={() => onToggle(index)}
      >
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg" style={{ color: 'var(--calendar-title)' }}>{course}</span>
          <span className="text-xs" style={{ color: 'var(--empty-card-text)' }}>{formatDate(ev.start)}</span>
        </div>
        <div className="text-base font-semibold" style={{ color: 'var(--card-text)' }}>{assignment}</div>
        <div className={`text-sm overflow-hidden`} style={{ color: 'var(--info-text)', ...(expanded ? {} : { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }) }}>{info}</div>
        <div className="flex justify-between items-center text-xs mt-2">
          <span className="font-bold" style={{ color: 'var(--practice-text)' }}>⏳ Time left: {timeRemaining(ev.start)}</span>
          <div className="flex items-center gap-2">
            {ev.location && <span style={{ color: 'var(--empty-card-text)' }}>{ev.location}</span>}
            <button
              className="text-xs underline px-1 py-0.5 rounded hover:bg-opacity-30 transition"
              style={{ color: 'var(--info-text)' }}
              onClick={e => { e.stopPropagation(); onHide(ev, index); }}
              type="button"
              title="Hide this assignment"
            >
              Hide
            </button>
            {expanded ? (
              <ChevronUp className="h-4 w-4" style={{ color: 'var(--empty-card-text)' }} />
            ) : (
              <ChevronDown className="h-4 w-4" style={{ color: 'var(--empty-card-text)' }} />
            )}
          </div>
        </div>
      </div>
    );
  };

  const CalendarComingSoon = () => (
    <div className="rounded-2xl shadow-2xl p-4 mt-4 border"
      style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--calendar-title)' }}>Calendar (coming soon)</h3>
      <div className="text-sm" style={{ color: 'var(--calendar-text)' }}>A visual calendar will be shown here in future updates.</div>
    </div>
  );

  function AssignmentsPage() {
    useThemeClass();

    const [calendarUrl] = useState<string>(() => localStorage.getItem("calendarUrl") || "");
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
    const [hiddenAssignments, setHiddenAssignments] = useState<Set<string>>(() => {
      try {
        const saved = localStorage.getItem("hiddenAssignments");
        if (saved) return new Set(JSON.parse(saved));
      } catch {}
      return new Set();
    });

    const getAssignmentKey = (ev: CalendarEvent, index: number) => `${ev.summary}-${ev.start}-${index}`;

    const hideAssignment = (ev: CalendarEvent, index: number) => {
      setHiddenAssignments(prev => {
        const updated = new Set(prev).add(getAssignmentKey(ev, index));
        localStorage.setItem("hiddenAssignments", JSON.stringify(Array.from(updated)));
        return updated;
      });
    };

    const resetHiddenAssignments = () => {
      setHiddenAssignments(() => {
        localStorage.removeItem("hiddenAssignments");
        return new Set();
      });
    };

    const fetchAssignments = () => {
      if (!calendarUrl) return;
      setLoading(true);
      setError("");
      if (!navigator.onLine) {
        const cached = localStorage.getItem("assignmentsCache");
        if (cached) {
          try {
            setEvents(JSON.parse(cached));
          } catch {}
        }
        setLoading(false);
        setError("You are offline. Showing cached assignments.");
        return;
      }
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(calendarUrl)}`;
      fetch(proxyUrl)
        .then((r) => r.text())
        .then((ics) => {
          const parsed = parseICS(ics);
          setEvents(parsed);
          localStorage.setItem("assignmentsCache", JSON.stringify(parsed));
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch calendar. Check the URL or try uploading the file manually.");
          setLoading(false);
        });
    };

    useEffect(() => {
      if (!calendarUrl) return;
      if (!navigator.onLine) {
        const cached = localStorage.getItem("assignmentsCache");
        if (cached) {
          try {
            setEvents(JSON.parse(cached));
          } catch {}
        }
        setError("You are offline. Showing cached assignments.");
      } else {
        fetchAssignments();
      }
      const onVisibility = () => {
        if (document.visibilityState === "visible") fetchAssignments();
      };
      document.addEventListener("visibilitychange", onVisibility);
      return () => {
        document.removeEventListener("visibilitychange", onVisibility);
      };
    // eslint-disable-next-line
    }, [calendarUrl]);

    const toggleCard = (index: number) => {
      setExpandedCards(prev => {
        const newExpanded = new Set(prev);
        if (newExpanded.has(index)) {
          newExpanded.delete(index);
        } else {
          newExpanded.add(index);
        }
        return newExpanded;
      });
    };

    // Filter, sort, and map assignments for display
    const assignmentList = events
      .filter(ev => !ev.summary?.startsWith("Attendance "))
      .filter(ev => timeRemaining(ev.end) !== "Expired")
      .map((ev, index) => ({ ev, index }))
      .filter(({ ev, index }) => !hiddenAssignments.has(getAssignmentKey(ev, index)))
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
        return getTime(a.ev.start) - getTime(b.ev.start);
      });

    return (
      <div
        className={
          "min-h-screen w-full pb-24 pt-8 px-2 md:px-0 relative flex flex-col items-center " +
          (document.documentElement.classList.contains('theme-dark-blue')
            ? "bg-gradient-to-br from-[#181C3A] via-[#232A4D] to-[#2B3562]"
            : document.documentElement.classList.contains('theme-dark-red')
            ? "bg-gradient-to-br from-[#3A181C] via-[#4D232A] to-[#2B181C]"
            : "bg-white")
        }
      >
        <GlowingBackground />
        <div className="relative z-10 w-full max-w-md mx-auto px-4 py-6">
          <AssignmentsHeader loading={loading} error={error} />
          {assignmentList.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--calendar-title)' }}>Upcoming Assignments</h3>
                {hiddenAssignments.size > 0 && (
                  <button
                    className="text-xs underline px-2 py-1 rounded transition font-semibold"
                    style={{ background: 'var(--tabs-bg)', color: 'var(--tabs-text)', border: '1px solid var(--card-border)' }}
                    onClick={resetHiddenAssignments}
                    type="button"
                  >
                    Reset Hidden
                  </button>
                )}
              </div>
              <div className="grid gap-4">
                {assignmentList.map(({ ev, index }) => (
                  <AssignmentCard
                    key={getAssignmentKey(ev, index)}
                    ev={ev}
                    index={index}
                    expanded={expandedCards.has(index)}
                    onToggle={toggleCard}
                    onHide={hideAssignment}
                    getAssignmentKey={getAssignmentKey}
                  />
                ))}
              </div>
            </div>
          )}
          {events.length > 0 && <CalendarComingSoon />}
        </div>
        <div className="fixed bottom-0 left-0 w-full z-20">
          <Navbar />
        </div>
      </div>
    );
  }

export default AssignmentsPage;