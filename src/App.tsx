import { useState, useEffect, Fragment } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ScheduleService from "@/api/schedule";
import Navbar from './components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useThemeClass } from './useThemeClass';


type ScheduleItem = {
  time: string;
  discipline: string;
  classroom: string;
  type: 'lecture' | 'practice';
  lector: string;
  teamsMeetingUrl?: string | null;
};
type ScheduleData = Record<string, ScheduleItem[]>;



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

const HeaderCard = ({ group, visibleDisciplines, showForm, setShowForm, showFilter, setShowFilter }: any) => (
  <Card className="mb-6 border-2 shadow-2xl rounded-3xl px-6 py-7"
    style={{ background: 'var(--card-bg)', color: 'var(--card-text)', borderColor: 'var(--card-border)' }}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <div className="flex items-center gap-3">
        <div className="rounded-full p-3 shadow-lg" style={{ background: 'var(--badge-lecture)', color: 'var(--card-text)' }}>
          <Calendar className="h-7 w-7" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Schedule</CardTitle>
      </div>
      <div className="rounded-full shadow-lg" style={{ background: 'var(--badge-lecture)', border: '2px solid var(--card-border)' }}>
        <img src="/icon/apple-touch-icon.png" alt="User" className="h-8 w-8 rounded-full" />
      </div>
    </CardHeader>
    <CardContent className="pt-2">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between rounded-xl px-3 py-2 shadow-inner" style={{ background: 'var(--tabs-bg)' }}>
          <div>
            <div className="text-xs" style={{ color: 'var(--tabs-text)' }}>Current Group</div>
            <div className="text-base font-semibold" style={{ color: 'var(--card-text)' }}>{group || 'No group selected'}</div>
          </div>
          <Button
            variant="ghost"
            className="font-semibold shadow-md rounded-lg px-3 py-1 text-sm"
            style={{ background: 'var(--badge-lecture)', color: 'var(--card-text)' }}
            onClick={() => setShowForm((v: boolean) => !v)}
          >
            {showForm ? 'Hide' : 'Update'}
          </Button>
        </div>
        <div className="flex items-center justify-between rounded-xl px-3 py-2 shadow-inner mt-2" style={{ background: 'var(--tabs-bg)' }}>
          <div>
            <div className="text-xs" style={{ color: 'var(--tabs-text)' }}>Filters</div>
            <div className="text-base font-semibold" style={{ color: 'var(--card-text)' }}>{visibleDisciplines.length} subjects</div>
          </div>
          <Button
            variant="ghost"
            className="font-semibold shadow-md rounded-lg px-3 py-1 text-sm"
            style={{ background: 'var(--badge-lecture)', color: 'var(--card-text)' }}
            onClick={() => setShowFilter((v: boolean) => !v)}
          >
            {showFilter ? 'Hide' : 'Show'}
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const SubjectFilterModal = ({ allSubjects, hiddenSubjects, handleFilterChange, setHiddenSubjects, group, showFilter, setShowFilter }: any) => (
  showFilter && (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFilter(false)} />
      <div
        className="relative w-full max-w-md mx-auto rounded-3xl shadow-2xl border-0 px-0 py-0 overflow-hidden"
        style={{
          background: 'var(--modal-bg)',
          color: 'var(--card-text)',
          // Add a subtle border for white theme for better separation
          border: document.documentElement.classList.contains('theme-dark-blue') || document.documentElement.classList.contains('theme-dark-red')
            ? 'none'
            : '1.5px solid #e5e7eb'
        }}
      >
        <div className="px-7 pt-7 pb-4 border-b" style={{ borderColor: 'var(--modal-border)' }}>
          <h3 className="text-xl font-bold" style={{ color: 'var(--card-text)' }}>Filter Subjects</h3>
        </div>
        <div className="px-7 pt-4 pb-2">
          {allSubjects.length > 0 && (
            <Button
              type="button"
              variant={hiddenSubjects.length < allSubjects.length ? "destructive" : "outline"}
              className="mb-4 w-full rounded-full px-5 py-2 text-sm font-semibold shadow border-2 transition-all duration-200"
              style={{
                background:
                  hiddenSubjects.length < allSubjects.length
                    ? (document.documentElement.classList.contains('theme-dark-blue') || document.documentElement.classList.contains('theme-dark-red')
                        ? 'var(--fetch-btn)'
                        : '#f3f4f6')
                    : (document.documentElement.classList.contains('theme-dark-blue') || document.documentElement.classList.contains('theme-dark-red')
                        ? 'var(--tabs-bg)'
                        : '#fff'),
                color:
                  hiddenSubjects.length < allSubjects.length
                    ? (document.documentElement.classList.contains('theme-dark-blue') || document.documentElement.classList.contains('theme-dark-red')
                        ? '#fff'
                        : '#dc2626')
                    : (document.documentElement.classList.contains('theme-dark-blue') || document.documentElement.classList.contains('theme-dark-red')
                        ? 'var(--tabs-text)'
                        : '#374151'),
                borderColor:
                  hiddenSubjects.length < allSubjects.length
                    ? (document.documentElement.classList.contains('theme-dark-blue') || document.documentElement.classList.contains('theme-dark-red')
                        ? 'var(--card-border)'
                        : '#fca5a5')
                    : (document.documentElement.classList.contains('theme-dark-blue') || document.documentElement.classList.contains('theme-dark-red')
                        ? 'var(--tabs-bg)'
                        : '#e5e7eb')
              }}
              onClick={() => {
                if (hiddenSubjects.length < allSubjects.length) {
                  setHiddenSubjects([...allSubjects]);
                  localStorage.setItem(`hiddenSubjects_${group}`, JSON.stringify([...allSubjects]));
                } else {
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
              <span style={{ color: 'var(--empty-card-text)' }}>No subjects to filter.</span>
            ) : (
              allSubjects.map((subjectKey: string) => {
                const isHidden = hiddenSubjects.includes(subjectKey);
                // Improved button style for white theme
                let buttonStyle;
                if (isHidden) {
                  buttonStyle = document.documentElement.classList.contains('theme-dark-blue') || document.documentElement.classList.contains('theme-dark-red')
                    ? { background: 'var(--badge-lecture)', color: '#fff', borderColor: 'var(--card-border)' }
                    : { background: '#2563eb', color: '#fff', borderColor: '#2563eb' };
                } else {
                  buttonStyle = document.documentElement.classList.contains('theme-dark-blue') || document.documentElement.classList.contains('theme-dark-red')
                    ? { background: 'var(--tabs-bg)', color: 'var(--tabs-text)', borderColor: 'var(--tabs-bg)' }
                    : { background: '#f3f4f6', color: '#374151', borderColor: '#e5e7eb' };
                }
                if (subjectKey.includes('__')) {
                  const [discipline, lector] = subjectKey.split('__');
                  return (
                    <Button
                      key={subjectKey}
                      type="button"
                      variant="outline"
                      className="rounded-full px-5 py-2 text-sm font-semibold shadow border-2 transition-all duration-100 hover:scale-105"
                      style={buttonStyle}
                      onClick={() => handleFilterChange(subjectKey)}
                    >
                      <span>{discipline}</span>
                      <span className="ml-2 text-xs" style={{ color: document.documentElement.classList.contains('theme-dark-blue') || document.documentElement.classList.contains('theme-dark-red') ? 'var(--empty-card-text)' : '#6b7280' }}>{lector}</span>
                    </Button>
                  );
                } else {
                  return (
                    <Button
                      key={subjectKey}
                      type="button"
                      variant="outline"
                      className="rounded-full px-5 py-2 text-sm font-semibold shadow border-2 transition-all duration-200 hover:scale-105"
                      style={buttonStyle}
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
              className="rounded-xl px-5 py-2 font-semibold shadow"
              style={{
                background: document.documentElement.classList.contains('theme-dark-blue') || document.documentElement.classList.contains('theme-dark-red')
                  ? 'var(--tabs-bg)'
                  : '#f3f4f6',
                color: document.documentElement.classList.contains('theme-dark-blue') || document.documentElement.classList.contains('theme-dark-red')
                  ? 'var(--tabs-text)'
                  : '#374151'
              }}
              onClick={() => setShowFilter(false)}
            >Close</Button>
          </div>
        </div>
      </div>
    </div>
  )
);

const GroupModal = ({ showForm, setShowForm, groupPrefix, setGroupPrefix, groupNumber, setGroupNumber, groupSuffix, setGroupSuffix, formatPrefix, handleFetchSchedule, loading, error }: any) => (
  showForm && (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <form
        onSubmit={e => {
          e.preventDefault();
          handleFetchSchedule();
        }}
        className="flex flex-col gap-4 rounded-3xl border shadow-2xl px-6 py-8 w-[90vw] max-w-md mx-auto"
        style={{ background: 'var(--modal-bg)', borderColor: 'var(--modal-border)' }}
      >
        <label className="flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              placeholder="Prefix"
              value={groupPrefix}
              onChange={e => {
                let val = e.target.value.replace(/[^a-zA-Z]/g, '');
                val = formatPrefix(val);
                setGroupPrefix(val);
              }}
              maxLength={5}
              required
              className="w-20 text-base md:text-lg px-4 py-3 rounded-lg border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
              style={{ borderColor: 'var(--card-border)', background: 'var(--input-bg)', color: 'var(--input-text)' }}
            />
            <span className="font-bold text-lg" style={{ color: 'var(--card-text)' }}>-</span>
            <Input
              type="text"
              placeholder="Number"
              value={groupNumber}
              onChange={e => {
                let val = e.target.value.replace(/[^0-9]/g, '');
                setGroupNumber(val);
              }}
              maxLength={4}
              required
              className="w-20 text-base md:text-lg px-4 py-3 rounded-lg border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
              style={{ borderColor: 'var(--card-border)', background: 'var(--input-bg)', color: 'var(--input-text)' }}
            />
            <Input
              type="text"
              placeholder="M"
              value={groupSuffix}
              onChange={e => {
                let val = e.target.value.replace(/[^mM]/g, '').toUpperCase();
                setGroupSuffix(val);
              }}
              maxLength={1}
              className="w-10 text-base md:text-lg px-2 py-3 rounded-lg border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
              style={{ borderColor: 'var(--card-border)', background: 'var(--input-bg)', color: 'var(--input-text)' }}
            />
          </div>
          <span className="text-xs pl-1" style={{ color: 'var(--empty-card-text)' }}>
            e.g. <span className="font-mono" style={{ color: 'var(--card-text)' }}>SE-2417</span> or <span className="font-mono" style={{ color: 'var(--card-text)' }}>CSE-2406M</span> or <span className="font-mono" style={{ color: 'var(--card-text)' }}>IoT-2401</span>
          </span>
        </label>
        <Button
          type="submit"
          disabled={loading || !groupPrefix || !groupNumber}
          className="font-semibold shadow-md rounded-xl px-6 py-2 w-full"
          style={{ background: 'var(--badge-lecture)', color: 'var(--card-text)' }}
        >
          {loading ? 'Fetching...' : 'Fetch Schedule'}
        </Button>
        {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}
        <Button
          variant="ghost"
          className="mt-2 w-full font-semibold shadow rounded-xl px-6 py-2"
          style={{ background: 'var(--badge-lecture)', color: 'var(--card-text)' }}
          onClick={() => setShowForm(false)}
        >Close</Button>
      </form>
    </div>
  )
);

const ScheduleCard = ({ item, languageSubjects, navigate }: any) => (
  <Card
    key={item.time + item.discipline + item.classroom}
    className="overflow-hidden border-2 shadow-2xl transition-all duration-300 backdrop-blur-xl rounded-3xl px-6 py-5"
    style={{ background: 'var(--card-bg)', color: 'var(--card-text)', borderColor: 'var(--card-border)' }}
  >
    <CardHeader className="pb-3 border-b" style={{ borderColor: 'var(--card-border)' }}>
      <div className="flex flex-row justify-between items-center gap-2">
        <CardTitle className="text-xl font-bold" style={{ color: 'var(--card-text)' }}>{item.discipline}</CardTitle>
        <Badge
          className="text-sm font-semibold px-3 py-1 rounded-full shadow"
          style={{
            background: item.type === 'lecture' ? 'var(--badge-lecture)' : 'var(--badge-practice)',
            color: item.type === 'lecture' ? 'var(--lecture-text)' : 'var(--practice-text)'
          }}
        >
          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="pt-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="flex items-center p-3 rounded-xl" style={{ color: 'var(--tabs-text)', background: 'var(--tabs-bg)' }}>
          <div className="flex items-center justify-center h-10 w-10 rounded-full mr-3" style={{ background: 'var(--badge-lecture)', color: 'var(--icon-text)' }}>
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs" style={{ color: 'var(--empty-card-text)' }}>Time</p>
            <p className="font-medium" style={{ color: 'var(--card-text)' }}>{item.time}</p>
          </div>
        </div>
        <div className="flex items-center p-3 rounded-xl" style={{ color: 'var(--tabs-text)', background: 'var(--tabs-bg)' }}>
          <div className="flex items-center justify-center h-10 w-10 rounded-full mr-3" style={{ background: 'var(--badge-lecture)', color: 'var(--icon-text)' }}>
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs" style={{ color: 'var(--empty-card-text)' }}>Location</p>
            {item.classroom === 'online' ? (
              <p className="font-medium" style={{ color: 'var(--card-text)' }}>{item.classroom}</p>
            ) : (
              <button
                className="font-medium underline cursor-pointer hover:text-blue-500 transition"
                style={{ background: 'none', border: 'none', padding: 0, color: 'var(--card-text)' }}
                onClick={() => navigate(`/map?search=${encodeURIComponent(item.classroom)}`)}
              >
                {item.classroom}
              </button>
            )}
          </div>
        </div>
        <div className="md:col-span-2 flex items-center p-3 rounded-xl" style={{ color: 'var(--tabs-text)', background: 'var(--tabs-bg)' }}>
          <div className="flex items-center justify-center h-10 w-10 rounded-full mr-3" style={{ background: 'var(--badge-lecture)', color: 'var(--icon-text)' }}>
            <User className="h-5 w-5" />
          </div>
          <div className="truncate">
            <p className="text-xs" style={{ color: 'var(--empty-card-text)' }}>Instructor</p>
            <p className="font-medium truncate" style={{ color: 'var(--card-text)' }}>{item.lector}</p>
          </div>
        </div>
        {item.teamsMeetingUrl && (
          <div className="md:col-span-2 flex items-center p-3 rounded-xl" style={{ color: 'var(--tabs-text)', background: 'var(--tabs-bg)' }}>
            <a
              href={item.teamsMeetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium truncate"
              style={{ color: 'var(--empty-card-text)' }}
            >
              Join Teams Meeting
            </a>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const EmptyDayCard = ({ day }: { day: string }) => (
  <Card className="text-center py-12 border-dashed border-2 rounded-3xl" style={{ borderColor: 'var(--empty-card-border)', background: 'var(--empty-card-bg)' }}>
    <CardContent>
      <div className="flex flex-col items-center">
        <div className="h-16 w-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'var(--empty-card-border)' }}>
          <Calendar className="h-8 w-8" style={{ color: 'var(--empty-card-text)' }} />
        </div>
        <h3 className="text-lg font-medium mb-1" style={{ color: 'var(--empty-card-text)' }}>No classes scheduled</h3>
        <p style={{ color: 'var(--empty-card-text)' }}>Enjoy your free day on {day}</p>
      </div>
    </CardContent>
  </Card>
);

function App() {
  useThemeClass();

  const [scheduleData, setScheduleData] = useState<ScheduleData>({});
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [group, setGroup] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hiddenSubjects, setHiddenSubjects] = useState<string[]>([]);
  const navigate = useNavigate();
  const [groupPrefix, setGroupPrefix] = useState<string>('');
  const [groupNumber, setGroupNumber] = useState<string>('');
  const [groupSuffix, setGroupSuffix] = useState<string>('');

  const formatPrefix = (input: string) => {
    if (/^iot$/i.test(input)) return 'IoT';
    return input.toUpperCase();
  };

  useEffect(() => {
    if (groupPrefix && groupNumber) {
      setGroup(groupPrefix + '-' + groupNumber + (groupSuffix ? groupSuffix : ''));
    } else {
      setGroup('');
    }
  }, [groupPrefix, groupNumber, groupSuffix]);

  useEffect(() => {
    const lastGroup = localStorage.getItem('lastGroup');
    if (lastGroup) {
      const match = lastGroup.match(/^([A-Za-z]+)-(\d+)(M?)$/i);
      if (match) {
        setGroupPrefix(formatPrefix(match[1]));
        setGroupNumber(match[2]);
        setGroupSuffix(match[3].toUpperCase());
      } else {
        setGroupPrefix('');
        setGroupNumber('');
        setGroupSuffix('');
      }
      setGroup(lastGroup);
      fetchLocalSchedule(lastGroup);
      const hidden = localStorage.getItem(`hiddenSubjects_${lastGroup}`);
      setHiddenSubjects(hidden ? JSON.parse(hidden) : []);
    }
  }, []);

  const fetchLocalSchedule = (groupName: string) => {
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
    'Foreign language', 'Kazakh language', 'Russian language', 'Казахский язык', 'Русский язык',
    'Иностранный язык', 'Казах тілі', 'Орыс тілі', 'Ағылшын тілі', 'Ағылшын язык',
    'German language', 'Chinese language', 'Немецкий язык', 'Китайский язык',
  ];

  const allSubjects = Array.from(
    new Set(
      Object.values(scheduleData).flat().map(item =>
        languageSubjects.some(lang => item.discipline.toLowerCase().includes(lang.toLowerCase()))
          ? `${item.discipline}__${item.lector}`
          : item.discipline
      )
    )
  );

  const visibleDisciplines = Array.from(
    new Set(
      Object.values(scheduleData)
        .flat()
        .filter(item => {
          const subjectKey = languageSubjects.some(lang => item.discipline.toLowerCase().includes(lang.toLowerCase()))
            ? `${item.discipline}__${item.lector}`
            : item.discipline;
          return !hiddenSubjects.includes(subjectKey);
        })
        .map(item => item.discipline)
    )
  );

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
    setLoading(true);
    setError(null);
    const service = new ScheduleService();
    try {
      const data = await service.fetchSchedule(group);
      setScheduleData(data as ScheduleData);
      service.storeScheduleLocally(group, data);
      localStorage.setItem('lastGroup', group);
      setShowForm(false);
    } catch (e: any) {
      const local = service.getLocalSchedule(group);
      setScheduleData((local || {}) as ScheduleData);
      setError((e.message ? e.message + '. ' : '') + 'Showing stored schedule if available.');
    } finally {
      setLoading(false);
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className={
      "min-h-screen w-full pb-24 pt-8 px-2 md:px-0 relative " +
      (document.documentElement.classList.contains('theme-dark-blue')
        ? "bg-gradient-to-br from-[#181C3A] via-[#232A4D] to-[#2B3562]"
        : document.documentElement.classList.contains('theme-dark-red')
        ? "bg-gradient-to-br from-[#3A181C] via-[#4D232A] to-[#2B181C]"
        : "bg-white")
    }>
      <GlowingBackground />
      <div className="relative z-10 max-w-md mx-auto">
        <HeaderCard
          group={group}
          visibleDisciplines={visibleDisciplines}
          showForm={showForm}
          setShowForm={setShowForm}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
        />
        <SubjectFilterModal
          allSubjects={allSubjects}
          hiddenSubjects={hiddenSubjects}
          handleFilterChange={handleFilterChange}
          setHiddenSubjects={setHiddenSubjects}
          group={group}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
        />
        <GroupModal
          showForm={showForm}
          setShowForm={setShowForm}
          groupPrefix={groupPrefix}
          setGroupPrefix={setGroupPrefix}
          groupNumber={groupNumber}
          setGroupNumber={setGroupNumber}
          groupSuffix={groupSuffix}
          setGroupSuffix={setGroupSuffix}
          formatPrefix={formatPrefix}
          handleFetchSchedule={handleFetchSchedule}
          loading={loading}
          error={error}
        />
        <Tabs defaultValue="Monday" value={selectedDay} onValueChange={setSelectedDay} className="w-full mt-2">
          <div className="overflow-x-auto pb-2 mb-6">
            <TabsList className="grid w-full grid-cols-6 h-auto p-1 rounded-2xl border shadow-lg" style={{ background: 'var(--tabs-bg)', borderColor: 'var(--card-border)' }}>
              {daysOfWeek.map(day => (
                <TabsTrigger
                  key={day}
                  value={day}
                  className="rounded-xl py-3 text-sm font-medium transition-all duration-200"
                  style={{ color: selectedDay === day ? 'var(--tabs-active-text)' : 'var(--tabs-text)', background: selectedDay === day ? 'var(--tabs-active-bg)' : 'transparent' }}
                >
                  {day.slice(0, 3)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {daysOfWeek.map(day => {
            const filtered = (scheduleData[day] || []).filter(item => {
              const key = languageSubjects.some(lang => item.discipline.toLowerCase().includes(lang.toLowerCase()))
                ? `${item.discipline}__${item.lector}`
                : item.discipline;
              return !hiddenSubjects.includes(key);
            });
            return (
              <TabsContent key={day} value={day} className="mt-6">
                <div className="grid gap-6">
                  {filtered.length > 0 ? (
                    filtered.map(item => (
                      <ScheduleCard key={item.time + item.discipline + item.classroom} item={item} languageSubjects={languageSubjects} navigate={navigate} />
                    ))
                  ) : (
                    <EmptyDayCard day={day} />
                  )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
      <div className="fixed bottom-0 left-0 w-full z-20">
        <Navbar />
      </div>
    </div>
  );
}

export default App;