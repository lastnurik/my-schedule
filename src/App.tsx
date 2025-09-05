import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User } from 'lucide-react';

type ScheduleItem = {
  time: string;
  discipline: string;
  classroom: string;
  type: 'lecture' | 'practice';
  lector: string;
};

type ScheduleData = {
  [key: string]: ScheduleItem[];
};

function App() {
  const scheduleData: ScheduleData = {
    'Monday': [
      { time: '11:00-11:50', discipline: 'Operating Systems', classroom: 'online', type: 'practice', lector: 'Kulbayeva Laura' },
      { time: '14:00-14:50', discipline: 'Analytic methods in Computer Science', classroom: 'C1 1.334L', type: 'lecture', lector: 'Min Soo Hah' },
      { time: '15:00-15:50', discipline: 'Analytic methods in Computer Science', classroom: 'C1 1.334L', type: 'lecture', lector: 'Min Soo Hah' },
      { time: '16:00-16:50', discipline: 'WEB Technologies 1 (Front End)', classroom: 'C1 1.358K', type: 'practice', lector: 'Aruzhan Ali' },
      { time: '17:00-17:50', discipline: 'WEB Technologies 1 (Front End)', classroom: 'C1 1.358K', type: 'practice', lector: 'Aruzhan Ali' },
    ],
    'Tuesday': [
      { time: '08:00-08:50', discipline: 'WEB Technologies 1 (Front End)', classroom: 'online', type: 'lecture', lector: 'https://learn.astanait.edu.kz/' },
      { time: '09:00-09:50', discipline: 'WEB Technologies 1 (Front End)', classroom: 'online', type: 'lecture', lector: 'https://learn.astanait.edu.kz/' },
    ],
    'Wednesday': [
      { time: '20:00-20:50', discipline: 'Operating Systems', classroom: 'online', type: 'lecture', lector: 'https://learn.astanait.edu.kz/' },
      { time: '21:00-21:50', discipline: 'Operating Systems', classroom: 'online', type: 'lecture', lector: 'https://learn.astanait.edu.kz/' },
    ],
    'Thursday': [
      { time: '15:00-15:50', discipline: 'Analytic methods in Computer Science', classroom: 'C1 1.355P', type: 'practice', lector: 'Asabai Al-Tarazi' },
      { time: '16:00-16:50', discipline: 'Analytic methods in Computer Science', classroom: 'C1 1.355P', type: 'practice', lector: 'Asabai Al-Tarazi' },
      { time: '17:00-17:50', discipline: 'Introduction to Finance', classroom: 'C1 3.318', type: 'practice', lector: 'Aigaiym Jaras' },
      { time: '18:00-18:50', discipline: 'Introduction to Finance', classroom: 'C1 3.318', type: 'practice', lector: 'Aigaiym Jaras' },
    ],
    'Friday': [
      { time: '10:00-10:50', discipline: 'Operating Systems', classroom: 'online', type: 'practice', lector: 'Kulbayeva Laura' },
      { time: '11:00-11:50', discipline: 'Operating Systems', classroom: 'online', type: 'practice', lector: 'Kulbayeva Laura' },
      { time: '15:00-15:50', discipline: 'Introduction to Finance', classroom: 'C1 3.318', type: 'practice', lector: 'Aigaiym Jaras' },
      { time: '16:00-16:50', discipline: 'Analytic methods in Computer Science', classroom: 'C1 1.355P', type: 'practice', lector: 'Asabai Al-Tarazi' },
      { time: '17:00-17:50', discipline: 'WEB Technologies 1 (Front End)', classroom: 'C1 1.358K', type: 'practice', lector: 'Aruzhan Ali' },
      { time: '20:00-20:50', discipline: 'Introduction to Finance', classroom: 'online', type: 'lecture', lector: 'https://learn.astanait.edu.kz/' },
      { time: '21:00-21:50', discipline: 'Introduction to Finance', classroom: 'online', type: 'lecture', lector: 'https://learn.astanait.edu.kz/' },
    ],
  };

  const daysOfWeek = Object.keys(scheduleData);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
            <Calendar className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Weekly Schedule
          </h1>
          <p className="text-slate-600 max-w-md mx-auto">Trimester-1</p>
          <p className="text-slate-600 max-w-md mx-auto">made by nurik for nurik</p>
        </div>

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
                {scheduleData[day]?.length > 0 ? (
                  scheduleData[day].map((item, index) => (
                    <Card 
                      key={index} 
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

        <footer className="text-center mt-16 pt-8 border-t border-slate-200/50">
          <p className="text-slate-500 flex items-center justify-center gap-1">
            Vibecoded
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;