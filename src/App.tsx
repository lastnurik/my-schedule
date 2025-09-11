import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ScheduleService from "@/api/schedule";
import Navbar from './components/Navbar';
import { useNavigate } from 'react-router-dom';

type ScheduleItem = {
  time: string;
  discipline: string;
  classroom: string;
  type: 'lecture' | 'practice';
  lector: string;
  teamsMeetingUrl?: string | null;
};

type ScheduleData = {
  [key: string]: ScheduleItem[];
};


function App() {
  // Get theme from localStorage
  const theme = typeof window !== 'undefined' ? (localStorage.getItem('theme') || 'white') : 'white';
  let pageBg = '', glow1 = '', glow2 = '';
  let cardBg = '', cardText = '', cardBorder = '', badgeLecture = '', badgePractice = '', inputBg = '', inputText = '', inputPlaceholder = '', tabsBg = '', tabsText = '', tabsActiveBg = '', tabsActiveText = '', emptyCardBg = '', emptyCardBorder = '', emptyCardText = '', modalBg = '', modalBorder = '';
  let practiceText = '', lectureText = '';
  if (theme === 'dark-blue') {
    pageBg = 'bg-gradient-to-br from-[#181C3A] via-[#232A4D] to-[#2B3562]';
    glow1 = 'bg-gradient-to-br from-blue-700/40 via-indigo-600/30 to-purple-700/20';
    glow2 = 'bg-gradient-to-tr from-purple-600/30 via-blue-500/20 to-indigo-700/10';
    cardBg = 'bg-gradient-to-br from-[#232A4D] to-[#181C3A]';
    cardText = 'text-white';
    cardBorder = 'border-blue-900';
    badgeLecture = 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
    badgePractice = 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white';
    inputBg = 'bg-[#232A4D]';
    inputText = 'text-white';
    inputPlaceholder = 'placeholder:text-blue-300';
    tabsBg = 'bg-gradient-to-r from-blue-900/80 to-indigo-900/80 border-blue-800';
    tabsText = 'text-blue-200';
    tabsActiveBg = 'bg-gradient-to-r from-blue-500 to-indigo-500';
    tabsActiveText = 'text-white';
    emptyCardBg = 'bg-blue-900/30';
    emptyCardBorder = 'border-blue-900';
    emptyCardText = 'text-blue-300';
    modalBg = 'bg-gradient-to-br from-[#232A4D] to-[#181C3A]';
    modalBorder = 'border-blue-900';
  // removed modalText
    practiceText = 'text-cyan-300';
    lectureText = 'text-purple-300';
  } else if (theme === 'white') {
    pageBg = 'bg-white';
    glow1 = 'bg-white';
    glow2 = 'bg-white';
    cardBg = 'bg-white';
    cardText = 'text-slate-700';
    cardBorder = 'border-slate-200';
    badgeLecture = 'bg-gradient-to-r from-slate-100 to-white text-slate-700';
    badgePractice = 'bg-gradient-to-r from-emerald-200 to-teal-200 text-slate-700';
    inputBg = 'bg-white';
    inputText = 'text-slate-700';
    inputPlaceholder = 'placeholder:text-slate-400';
    tabsBg = 'bg-slate-100 border-slate-200';
    tabsText = 'text-slate-700';
    tabsActiveBg = 'bg-gradient-to-r from-slate-100 to-white';
    tabsActiveText = 'text-slate-700';
    emptyCardBg = 'bg-slate-100';
    emptyCardBorder = 'border-slate-200';
    emptyCardText = 'text-slate-400';
    modalBg = 'bg-white';
    modalBorder = 'border-slate-200';
  // removed modalText
    practiceText = 'text-blue-500';
    lectureText = 'text-red-500';
  } else {
    pageBg = 'bg-gradient-to-br from-[#3A181C] via-[#4D232A] to-[#2B181C]';
    glow1 = 'bg-gradient-to-br from-red-700/40 via-pink-700/30 to-red-900/20';
    glow2 = 'bg-gradient-to-tr from-pink-600/30 via-red-500/20 to-red-900/10';
    cardBg = 'bg-gradient-to-br from-[#3A181C] to-[#4D232A]';
    cardText = 'text-red-200';
    cardBorder = 'border-red-900';
    badgeLecture = 'bg-gradient-to-r from-red-700 to-pink-700 text-white';
    badgePractice = 'bg-gradient-to-r from-rose-700 to-pink-700 text-white';
    inputBg = 'bg-[#4D232A]';
    inputText = 'text-red-200';
    inputPlaceholder = 'placeholder:text-red-200';
    tabsBg = 'bg-gradient-to-r from-red-900/80 to-pink-900/80 border-red-800';
    tabsText = 'text-red-200';
    tabsActiveBg = 'bg-gradient-to-r from-red-700 to-pink-700';
    tabsActiveText = 'text-white';
    emptyCardBg = 'bg-red-900/30';
    emptyCardBorder = 'border-red-900';
    emptyCardText = 'text-red-200';
    modalBg = 'bg-gradient-to-br from-[#3A181C] to-[#4D232A]';
    modalBorder = 'border-red-900';
  // removed modalText
    practiceText = 'text-yellow-300';
    lectureText = 'text-pink-300';
  }
  // ...existing logic...
  const [scheduleData, setScheduleData] = useState<ScheduleData>({});
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [group, setGroup] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hiddenSubjects, setHiddenSubjects] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // ...existing code...
    const lastGroup = localStorage.getItem('lastGroup');
    if (lastGroup) {
      setGroup(lastGroup);
      fetchLocalSchedule(lastGroup);
      const hidden = localStorage.getItem(`hiddenSubjects_${lastGroup}`);
      setHiddenSubjects(hidden ? JSON.parse(hidden) : []);
    }
  }, []);

  const fetchLocalSchedule = (groupName: string) => {
    // ...existing code...
    const service = new ScheduleService();
    const local = service.getLocalSchedule(groupName);
    if (local) {
      setScheduleData(local as ScheduleData);
      const hidden = localStorage.getItem(`hiddenSubjects_${groupName}`);
      setHiddenSubjects(hidden ? JSON.parse(hidden) : []);
    } else {
      setScheduleData({});
      setHiddenSubjects([]);
    }
  };

  const languageSubjects = [
    // ...existing code...
    'Foreign language',
    'Kazakh language',
    'Russian language',
    'Казахский язык',
    'Русский язык',
    'Иностранный язык',
    'Казах тілі',
    'Орыс тілі',
    'Ағылшын тілі',
    'Ағылшын язык',
    'German language',
    'Chinese language',
    'Немецкий язык',
    'Китайский язык',
  ];
  const allSubjects = Array.from(
    new Set(
      Object.values(scheduleData)
        .flat()
        .map(item =>
          languageSubjects.some(lang => item.discipline.toLowerCase().includes(lang.toLowerCase()))
            ? `${item.discipline}__${item.lector}`
            : item.discipline
        )
    )
  );

  const handleFilterChange = (subjectKey: string) => {
    // ...existing code...
    let updated: string[];
    if (hiddenSubjects.includes(subjectKey)) {
      updated = hiddenSubjects.filter(s => s !== subjectKey);
    } else {
      updated = [...hiddenSubjects, subjectKey];
    }
    setHiddenSubjects(updated);
    localStorage.setItem(`hiddenSubjects_${group}`, JSON.stringify(updated));
  };

  const handleFetchSchedule = async () => {
    // ...existing code...
    if (!navigator.onLine) {
      const service = new ScheduleService();
      const local = service.getLocalSchedule(group);
      setScheduleData((local || {}) as ScheduleData);
      setError("You are offline. Showing stored schedule.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const service = new ScheduleService();
      const data = await service.fetchSchedule(group);
      setScheduleData(data as ScheduleData);
      service.storeScheduleLocally(group, data);
      localStorage.setItem('lastGroup', group);
      setShowForm(false);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch schedule');
    } finally {
      setLoading(false);
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // --- UI Redesign ---
  return (
  <div className={`min-h-screen w-full ${pageBg} pb-24 pt-8 px-2 md:px-0 relative`}>
      {/* Glowing background effect */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] ${glow1} rounded-full blur-3xl opacity-70`} />
        <div className={`absolute bottom-0 right-0 w-[40vw] h-[30vw] ${glow2} rounded-full blur-2xl opacity-60`} />
      </div>

      <div className="relative z-10 max-w-md mx-auto">
        {/* Header Card */}
  <Card className={`mb-6 ${cardBg} border-2 ${cardBorder} shadow-2xl rounded-3xl px-6 py-7 ${cardText}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-3">
              <div className={`${badgeLecture} rounded-full p-3 shadow-lg`}>
                <Calendar className="h-7 w-7" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Schedule</CardTitle>
            </div>
            <div className={`rounded-full ${theme === 'dark-blue' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-blue-400' : theme === 'white' ? 'bg-slate-200 border-2 border-slate-400' : 'bg-gradient-to-br from-pink-700 to-red-700 border-2 border-red-400'} shadow-lg`}>
              <img src="/icon/apple-touch-icon.png" alt="User" className="h-8 w-8 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex flex-col gap-2">
              <div className={`flex items-center justify-between ${tabsBg} rounded-xl px-3 py-2 shadow-inner`}>
                <div>
                  <div className={`text-xs ${tabsText}`}>Current Group</div>
                  <div className={`text-base font-semibold ${cardText}`}>{group || 'No group selected'}</div>
                </div>
                <Button
                  variant="ghost"
                  className={`${badgeLecture} font-semibold shadow-md rounded-lg px-3 py-1 text-sm`}
                  onClick={() => setShowForm(v => !v)}
                >
                  {showForm ? 'Hide' : 'Update'}
                </Button>
              </div>
              <div className={`flex items-center justify-between ${theme === 'dark-blue' ? 'bg-gradient-to-r from-indigo-700/80 to-purple-700/80' : theme === 'white' ? 'bg-slate-100' : 'bg-gradient-to-r from-pink-900/80 to-red-900/80'} rounded-xl px-3 py-2 shadow-inner mt-2`}>
                <div>
                  <div className={`text-xs ${theme === 'dark-blue' ? 'text-purple-200' : theme === 'white' ? 'text-slate-400' : 'text-pink-200'}`}>Filters</div>
                  <div className={`text-base font-semibold ${cardText}`}>{allSubjects.length} subjects</div>
                </div>
                <Button
                  variant="ghost"
                  className={`${badgeLecture} font-semibold shadow-md rounded-lg px-3 py-1 text-sm`}
                  onClick={() => setShowFilter(v => !v)}
                >
                  {showFilter ? 'Hide' : 'Show'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Modal */}
        {showFilter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFilter(false)} />
            <div
              className={`relative w-full max-w-md mx-auto rounded-3xl shadow-2xl border-0 px-0 py-0 overflow-hidden`}
              style={{ background: theme === 'dark-blue' ? 'linear-gradient(135deg, #232A4D 80%, #181C3A 100%)' : theme === 'white' ? '#fff' : 'linear-gradient(135deg, #4D232A 80%, #3A181C 100%)' }}
            >
              <div className={`px-7 pt-7 pb-4 border-b ${theme === 'dark-blue' ? 'border-blue-900' : theme === 'white' ? 'border-slate-200' : 'border-red-900'}`}>
                <h3 className={`text-xl font-bold ${theme === 'dark-blue' ? 'text-blue-200' : theme === 'white' ? 'text-slate-700' : 'text-red-200'}`}>Filter Subjects</h3>
              </div>
              <div className="px-7 pt-4 pb-2">
                {/* Select All / Unselect All Toggle Button */}
                {allSubjects.length > 0 && (
                  <Button
                    type="button"
                    variant={hiddenSubjects.length < allSubjects.length ? "destructive" : "outline"}
                    className={`mb-4 w-full rounded-full px-5 py-2 text-sm font-semibold shadow border-2 transition-all duration-200
                      ${hiddenSubjects.length < allSubjects.length
                        ? theme === 'dark-blue'
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-400 hover:bg-red-600'
                          : theme === 'white'
                            ? 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200'
                            : 'bg-gradient-to-r from-pink-700 to-red-700 text-white border-red-400 hover:bg-red-800'
                        : theme === 'dark-blue'
                          ? 'bg-gradient-to-r from-blue-900/80 to-indigo-900/80 text-blue-200 border-blue-800 hover:bg-blue-900/40'
                          : theme === 'white'
                            ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                            : 'bg-gradient-to-r from-red-900/80 to-pink-900/80 text-red-200 border-red-800 hover:bg-red-900/40'
                      }`}
                    onClick={() => {
                      if (hiddenSubjects.length < allSubjects.length) {
                        // Hide all subjects
                        setHiddenSubjects([...allSubjects]);
                        localStorage.setItem(`hiddenSubjects_${group}`, JSON.stringify([...allSubjects]));
                      } else {
                        // Show all subjects
                        setHiddenSubjects([]);
                        localStorage.setItem(`hiddenSubjects_${group}`, JSON.stringify([]));
                      }
                    }}
                  >
                    {hiddenSubjects.length < allSubjects.length ? 'Unselect All' : 'Select All'}
                  </Button>
                )}
                <div className="max-h-[45vh] overflow-y-auto flex flex-col gap-2 pb-2">
                  {allSubjects.length === 0 ? (
                    <span className={theme === 'dark-blue' ? 'text-blue-300' : theme === 'white' ? 'text-slate-400' : 'text-red-200'}>No subjects to filter.</span>
                  ) : (
                    allSubjects.map(subjectKey => {
                      const isHidden = hiddenSubjects.includes(subjectKey);
                      const buttonBg = isHidden
                        ? theme === 'dark-blue'
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-400'
                          : theme === 'white'
                            ? 'bg-slate-200 text-slate-700 border-slate-400'
                            : 'bg-gradient-to-r from-pink-700 to-red-700 text-white border-red-400'
                        : theme === 'dark-blue'
                          ? 'bg-indigo-900/40 text-blue-200 border-blue-900'
                          : theme === 'white'
                            ? 'bg-white text-slate-700 border-slate-200'
                            : 'bg-red-900/40 text-red-200 border-red-900';
                      if (subjectKey.includes('__')) {
                        const [discipline, lector] = subjectKey.split('__');
                        return (
                          <Button
                            key={subjectKey}
                            type="button"
                            variant="outline"
                            className={`rounded-full px-5 py-2 text-sm font-semibold shadow border-2 transition-all duration-100 hover:scale-105 ${buttonBg}`}
                            onClick={() => handleFilterChange(subjectKey)}
                          >
                            <span>{discipline}</span>
                            <span className={`ml-2 text-xs ${theme === 'dark-blue' ? 'text-blue-300' : theme === 'white' ? 'text-slate-400' : 'text-red-200'}`}>{lector}</span>
                          </Button>
                        );
                      } else {
                        return (
                          <Button
                            key={subjectKey}
                            type="button"
                            variant="outline"
                            className={`rounded-full px-5 py-2 text-sm font-semibold shadow border-2 transition-all duration-200 hover:scale-105 ${buttonBg}`}
                            onClick={() => handleFilterChange(subjectKey)}
                          >
                            {subjectKey}
                          </Button>
                        );
                      }
                    })
                  )}
                </div>
                <div className="w-full flex justify-end mt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className={`rounded-xl px-5 py-2 font-semibold shadow ${theme === 'dark-blue' ? 'bg-indigo-900/40 text-blue-200 hover:bg-indigo-900/60' : theme === 'white' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-red-900/40 text-red-200 hover:bg-red-900/60'}`}
                    onClick={() => setShowFilter(false)}
                  >Close</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Group Modal */}
        {showForm && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleFetchSchedule();
              }}
              className={`flex flex-col gap-4 ${modalBg} rounded-3xl border ${modalBorder} shadow-2xl px-6 py-8 w-[90vw] max-w-md mx-auto`}
            >
              <label className="flex flex-col gap-1">
                <Input
                  type="text"
                  placeholder="Enter group name..."
                  value={group}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGroup(e.target.value)}
                  required
                  className={`text-base md:text-lg px-4 py-3 rounded-lg border ${cardBorder} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 ${inputBg} ${inputText} ${inputPlaceholder}`}
                />
                <span className={`text-xs ${emptyCardText} pl-1`}>e.g. <span className={`font-mono ${cardText}`}>SE-2417</span></span>
              </label>
              <Button
                type="submit"
                disabled={loading}
                className={`${badgeLecture} font-semibold shadow-md rounded-xl px-6 py-2 w-full`}
              >
                {loading ? 'Fetching...' : 'Fetch Schedule'}
              </Button>
              {error && <p className={`text-red-400 text-sm text-center mt-2`}>{error}</p>}
              <Button
                variant="ghost"
                className={`mt-2 w-full ${badgeLecture} font-semibold shadow rounded-xl px-6 py-2`}
                onClick={() => setShowForm(false)}
              >Close</Button>
            </form>
          </div>
        )}

        {/* Tabs for days */}
  <Tabs defaultValue="Monday" value={selectedDay} onValueChange={setSelectedDay} className="w-full mt-2">
          <div className="overflow-x-auto pb-2 mb-6">
            <TabsList className={`grid w-full grid-cols-6 h-auto p-1 rounded-2xl border shadow-lg ${tabsBg}`}>
              {daysOfWeek.map(day => (
                <TabsTrigger 
                  key={day} 
                  value={day}
                  className={`rounded-xl py-3 text-sm font-medium transition-all duration-200 ${tabsText} data-[state=active]:${tabsActiveBg} data-[state=active]:${tabsActiveText}`}
                >
                  {day.slice(0, 3)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {daysOfWeek.map(day => (
            <TabsContent key={day} value={day} className="mt-6">
              <div className="grid gap-6">
                {scheduleData[day]?.filter(item => {
                  const key = languageSubjects.some(lang => item.discipline.toLowerCase().includes(lang.toLowerCase()))
                    ? `${item.discipline}__${item.lector}`
                    : item.discipline;
                  return !hiddenSubjects.includes(key);
                }).length > 0 ? (
                  scheduleData[day]
                    .filter(item => {
                      const key = languageSubjects.some(lang => item.discipline.toLowerCase().includes(lang.toLowerCase()))
                        ? `${item.discipline}__${item.lector}`
                        : item.discipline;
                      return !hiddenSubjects.includes(key);
                    })
                    .map((item) => (
                      <Card 
                        key={item.time + item.discipline + item.classroom} 
                        className={`overflow-hidden border-2 ${cardBorder} shadow-2xl transition-all duration-300 ${cardBg} backdrop-blur-xl rounded-3xl ${cardText} px-6 py-5`}
                      >
                        <CardHeader className={`pb-3 border-b ${cardBorder}`}>
                          <div className="flex flex-row justify-between items-center gap-2">
                            <CardTitle className={`text-xl font-bold ${cardText}`}>{item.discipline}</CardTitle>
                            <Badge 
                              className={`text-sm font-semibold px-3 py-1 rounded-full shadow ${item.type === 'lecture' ? badgeLecture + ' ' + lectureText : badgePractice + ' ' + practiceText}`}
                            >
                              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className={`flex items-center p-3 rounded-xl ${theme === 'dark-blue' ? 'text-blue-200 bg-indigo-900/40' : theme === 'white' ? 'text-slate-700 bg-slate-100' : 'text-red-200 bg-pink-900/40'}`}> 
                              <div className={`flex items-center justify-center h-10 w-10 rounded-full mr-3 ${theme === 'dark-blue' ? 'bg-indigo-700 text-white' : theme === 'white' ? 'bg-slate-200 text-slate-700' : 'bg-pink-700 text-white'}`}> 
                                <Clock className="h-5 w-5" />
                              </div>
                              <div>
                                <p className={`text-xs ${theme === 'dark-blue' ? 'text-blue-300' : theme === 'white' ? 'text-slate-400' : 'text-red-200'}`}>Time</p>
                                <p className={`font-medium ${cardText}`}>{item.time}</p>
                              </div>
                            </div>
                            <div className={`flex items-center p-3 rounded-xl ${theme === 'dark-blue' ? 'text-blue-200 bg-indigo-900/40' : theme === 'white' ? 'text-slate-700 bg-slate-100' : 'text-red-200 bg-pink-900/40'}`}> 
                              <div className={`flex items-center justify-center h-10 w-10 rounded-full mr-3 ${theme === 'dark-blue' ? 'bg-indigo-700 text-white' : theme === 'white' ? 'bg-slate-200 text-slate-700' : 'bg-pink-700 text-white'}`}> 
                                <MapPin className="h-5 w-5" />
                              </div>
                              <div>
                                <p className={`text-xs ${theme === 'dark-blue' ? 'text-blue-300' : theme === 'white' ? 'text-slate-400' : 'text-red-200'}`}>Location</p>
                                {item.classroom == 'online' ? (
                                  <p className={`font-medium ${cardText}`}>{item.classroom}</p>
                                ) : (
                                  <button
                                    className={`font-medium underline ${cardText} cursor-pointer hover:text-blue-500 transition`}
                                    style={{ background: 'none', border: 'none', padding: 0 }}
                                    onClick={() => navigate(`/map?search=${encodeURIComponent(item.classroom)}`)}
                                  >
                                    {item.classroom}
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className={`md:col-span-2 flex items-center p-3 rounded-xl ${theme === 'dark-blue' ? 'text-blue-200 bg-purple-900/40' : theme === 'white' ? 'text-slate-700 bg-slate-100' : 'text-red-200 bg-red-900/40'}`}> 
                              <div className={`flex items-center justify-center h-10 w-10 rounded-full mr-3 ${theme === 'dark-blue' ? 'bg-purple-700 text-white' : theme === 'white' ? 'bg-slate-200 text-slate-700' : 'bg-red-700 text-white'}`}> 
                                <User className="h-5 w-5" />
                              </div>
                              <div className="truncate">
                                <p className={`text-xs ${theme === 'dark-blue' ? 'text-blue-300' : theme === 'white' ? 'text-slate-400' : 'text-red-200'}`}>Instructor</p>
                                <p className={`font-medium truncate ${cardText}`}>{item.lector}</p>
                              </div>
                            </div>
                            {item.teamsMeetingUrl && (
                              <div className={`md:col-span-2 flex items-center p-3 rounded-xl ${theme === 'dark-blue' ? 'text-blue-200 bg-blue-900/40' : theme === 'white' ? 'text-slate-700 bg-slate-100' : 'text-red-200 bg-red-900/40'}`}> 
                                <a
                                  href={item.teamsMeetingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`underline font-medium truncate ${theme === 'dark-blue' ? 'text-blue-300' : theme === 'white' ? 'text-slate-400' : 'text-red-200'}`}
                                >
                                  Join Teams Meeting
                                </a>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                ) : (
                  <Card className={`text-center py-12 border-dashed border-2 rounded-3xl ${emptyCardBorder} ${emptyCardBg}`}>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 ${theme === 'dark-blue' ? 'bg-blue-900' : theme === 'white' ? 'bg-slate-200' : 'bg-red-900'}`}> 
                          <Calendar className={`h-8 w-8 ${emptyCardText}`} />
                        </div>
                        <h3 className={`text-lg font-medium mb-1 ${emptyCardText}`}>No classes scheduled</h3>
                        <p className={`${emptyCardText}`}>Enjoy your free day on {day}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      {/* Fixed Footer Navbar */}
      <div className="fixed bottom-0 left-0 w-full z-20">
        <Navbar />
      </div>
    </div>
  );
}

export default App;