import { useState } from 'react';
import './App.css';

function App() {
  const scheduleData = {
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
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);

  const renderSchedule = () => {
    return scheduleData[selectedDay].map((item, index) => (
      <li key={index} className="schedule-item">
        <div className="schedule-time">
          <i className="fas fa-clock"></i> {item.time}
        </div>
        <div className="schedule-details">
          <span className="discipline">{item.discipline}</span>
          <span className={`type ${item.type}`}>{item.type}</span>
          <div className="location">
            <i className="fas fa-map-marker-alt"></i> {item.classroom}
          </div>
          <div className="lector">
            <i className="fas fa-user-tie"></i> {item.lector}
          </div>
        </div>
      </li>
    ));
  };

  return (
    <div className="schedule-container">
      <h1 className="schedule-title">Weekly Schedule</h1>
      <div className="day-tabs">
        {daysOfWeek.map(day => (
          <button
            key={day}
            className={`day-tab-button ${selectedDay === day ? 'active' : ''}`}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </button>
        ))}
      </div>
      <ul className="schedule-list">
        {renderSchedule()}
      </ul>
      <div className="footer">
        <p>Built with ❤️ and React</p>
      </div>
    </div>
  );
}

export default App;