
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, Newspaper, Settings as SettingsIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ScheduleService from "@/api/schedule";

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
  const navigate = useNavigate();
  const location = useLocation();
  // Footer navigation handler
  const handleNav = (path: string) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };
  const [scheduleData, setScheduleData] = useState<ScheduleData>({});
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [group, setGroup] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hiddenSubjects, setHiddenSubjects] = useState<string[]>([]);

  useEffect(() => {
    // Always use the latest saved schedule on app open
    const lastGroup = localStorage.getItem('lastGroup');
    if (lastGroup) {
      setGroup(lastGroup);
      fetchLocalSchedule(lastGroup);
      // Load hidden subjects for group
      const hidden = localStorage.getItem(`hiddenSubjects_${lastGroup}`);
      setHiddenSubjects(hidden ? JSON.parse(hidden) : []);
    }
  }, []);

  const fetchLocalSchedule = (groupName: string) => {
    const service = new ScheduleService();
    const local = service.getLocalSchedule(groupName);
    if (local) {
      setScheduleData(local as ScheduleData);
      // Load hidden subjects for group
      const hidden = localStorage.getItem(`hiddenSubjects_${groupName}`);
      setHiddenSubjects(hidden ? JSON.parse(hidden) : []);
    } else {
      setScheduleData({});
      setHiddenSubjects([]);
    }
  };
  // For all language subjects, always use discipline+teacher for filtering
  const languageSubjects = [
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
    // add more if needed
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

  // Handle filter change
  const handleFilterChange = (subjectKey: string) => {
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
    if (!navigator.onLine) {
      // Offline: use local only
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
      // Fetch from API and update local storage only when button is pressed
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

  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-24 pt-8 px-4">
      {/* Fixed Footer Navbar */}
      <nav className="fixed bottom-0 left-0 w-full h-15 z-50 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-lg">
        <div className="max-w-2xl mx-auto flex justify-between items-center px-6 py-3">
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
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
            <Calendar className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Weekly Schedule
          </h1>
          <p className="text-slate-600 max-w-md mx-auto">Trimester-1</p>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-2 justify-end items-center">
          <Button
            variant="ghost"
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-md hover:from-indigo-600 hover:to-purple-600 rounded-xl px-6 py-2 transition-all duration-200"
            onClick={() => setShowForm(v => !v)}
          >
            {showForm ? 'Hide' : 'Update the schedule'}
          </Button>
          <Button
            variant="ghost"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md hover:from-purple-600 hover:to-pink-600 rounded-xl px-6 py-2 transition-all duration-200"
            onClick={() => setShowFilter(v => !v)}
          >
            {showFilter ? 'Hide' : 'Filters'}
          </Button>
        </div>
        {showFilter && (
          <div className="mb-6 w-full mx-auto">
            <div className="bg-white/95 rounded-2xl border border-slate-200 shadow-xl px-4 py-7 max-w-full md:max-w-3xl md:px-8" style={{ margin: '0 auto' }}>
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-3 py-1 text-base font-semibold shadow">Filter</Badge>
                <span className="text-base font-semibold text-slate-700">Hide subjects from schedule</span>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                {allSubjects.length === 0 ? (
                  <span className="text-slate-400">No subjects to filter.</span>
                ) : (
                  allSubjects.map(subjectKey => {
                    if (subjectKey.includes('__')) {
                      const [discipline, lector] = subjectKey.split('__');
                      return (
                        <Button
                          key={subjectKey}
                          type="button"
                          variant={hiddenSubjects.includes(subjectKey) ? "secondary" : "outline"}
                          className={`rounded-full px-5 py-2 text-sm font-semibold shadow transition-all duration-200 border-2 ${hiddenSubjects.includes(subjectKey) ? 'bg-gradient-to-r from-slate-300 to-slate-200 text-slate-700 border-slate-400' : 'border-slate-200 hover:border-purple-400 hover:bg-purple-50'} hover:scale-105`}
                          onClick={() => handleFilterChange(subjectKey)}
                        >
                          <span>{discipline}</span>
                          <span className="ml-2 text-xs text-slate-400">{lector}</span>
                        </Button>
                      );
                    } else {
                      return (
                        <Button
                          key={subjectKey}
                          type="button"
                          variant={hiddenSubjects.includes(subjectKey) ? "secondary" : "outline"}
                          className={`rounded-full px-5 py-2 text-sm font-semibold shadow transition-all duration-200 border-2 ${hiddenSubjects.includes(subjectKey) ? 'bg-gradient-to-r from-slate-300 to-slate-200 text-slate-700 border-slate-400' : 'border-slate-200 hover:border-purple-400 hover:bg-purple-50'} hover:scale-105`}
                          onClick={() => handleFilterChange(subjectKey)}
                        >
                          {subjectKey}
                        </Button>
                      );
                    }
                  })
                )}
              </div>
              <div className="text-xs text-slate-400 mt-4 text-center">Subjects you hide will not appear in your schedule for this group.</div>
            </div>
          </div>
        )}

        {showForm && (
          <div className="mb-6 w-full mx-auto">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleFetchSchedule();
              }}
              className="flex flex-col gap-4 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200 shadow-lg px-4 py-6 max-w-full md:max-w-3xl md:px-8"
              style={{ margin: '0 auto' }}
            >
              <label className="flex flex-col gap-1">
                <Input
                  type="text"
                  placeholder="Enter group name..."
                  value={group}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGroup(e.target.value)}
                  required
                  className="text-base md:text-lg px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                />
                <span className="text-xs text-slate-400 pl-1">e.g. <span className="font-mono text-slate-500">SE-2417</span></span>
              </label>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-md hover:from-indigo-600 hover:to-purple-600 rounded-xl px-6 py-2 transition-all duration-200 w-full"
              >
                {loading ? 'Fetching...' : 'Fetch Schedule'}
              </Button>
              {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            </form>
          </div>
        )}

        <Tabs defaultValue="Monday" value={selectedDay} onValueChange={setSelectedDay} className="w-full">
          <div className="overflow-x-auto pb-2 mb-6">
            <TabsList className="grid w-full grid-cols-5 md:grid-cols-7 h-auto p-1 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm">
              {daysOfWeek.map(day => (
                <TabsTrigger 
                  key={day} 
                  value={day}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg py-3 text-sm font-medium transition-all duration-200"
                >
                  {day.slice(0, 3)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {daysOfWeek.map(day => (
            <TabsContent key={day} value={day} className="mt-6">
              <div className="grid gap-4">
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
                        className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm"
                      >
                        <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                            <CardTitle className="text-xl font-bold text-slate-800">
                              {item.discipline}
                            </CardTitle>
                            <Badge 
                              className={`text-sm font-semibold px-3 py-1 ${
                                item.type === 'lecture' 
                                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                                  : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              }`}
                            >
                              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="flex items-center text-slate-700 p-3 bg-slate-50 rounded-lg">
                              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 mr-3">
                                <Clock className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-sm text-slate-500">Time</p>
                                <p className="font-medium">{item.time}</p>
                              </div>
                            </div>
                            <div className="flex items-center text-slate-700 p-3 bg-slate-50 rounded-lg">
                              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 text-purple-600 mr-3">
                                <MapPin className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-sm text-slate-500">Location</p>
                                <p className="font-medium">{item.classroom}</p>
                              </div>
                            </div>
                            <div className="md:col-span-2 flex items-center text-slate-700 p-3 bg-slate-50 rounded-lg">
                              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-100 text-amber-600 mr-3">
                                <User className="h-5 w-5" />
                              </div>
                              <div className="truncate">
                                <p className="text-sm text-slate-500">Instructor</p>
                                <p className="font-medium truncate">{item.lector}</p>
                              </div>
                            </div>
                            {item.teamsMeetingUrl && (
                              <div className="md:col-span-2 flex items-center text-slate-700 p-3 bg-blue-50 rounded-lg">
                                <a
                                  href={item.teamsMeetingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline font-medium truncate"
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
                  <Card className="text-center py-12 border-dashed border-2 border-slate-200 bg-slate-50/50">
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                          <Calendar className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-600 mb-1">No classes scheduled</h3>
                        <p className="text-slate-500">Enjoy your free day on {day}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default App;