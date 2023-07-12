import React, { useState } from 'react';

const Calendar = ({ students }) => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedNum, setSelectedNum] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [calendarData, setCalendarData] = useState([]);

  const handleStudentChange = (event) => {
    setSelectedStudent(event.target.value);
  };

  const handleNumChange = (event) => {
    setSelectedNum(event.target.value);
  };

  const handleDateClick = (date) => {
    const currentDate = new Date();
    const clickedDate = new Date(date);
    clickedDate.setDate(clickedDate.getDate() + 1); // Increment the clicked date by 1 day
    setSelectedDate(clickedDate.toISOString().split('T')[0]);
  };
  

  const handleSaveLesson = () => {
    fetch('/lesson', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: selectedStudent, // Update to use selectedStudent
        num: selectedNum,
        date: selectedDate,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          // Lesson saved successfully, update the calendar data
          setCalendarData((prevData) => [
            ...prevData,
            {
              name: selectedStudent,
              num: selectedNum,
              date: selectedDate,
            },
          ]);
          setSelectedNum('');
          setSelectedDate('');
        } else {
          console.log('Failed to save lesson');
        }
      })
      .catch((error) => {
        console.log('Error saving lesson:', error);
      });
  };

  // Generate the calendar for the current month
  const generateCalendar = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const calendar = [];

    let dayCounter = 1;

    for (let week = 0; week < 6; week++) {
      const weekData = [];

      if (dayCounter > daysInMonth) {
        break;
      }

      for (let day = 0; day < 7; day++) {
        if ((week === 0 && day < startingDay) || dayCounter > daysInMonth) {
          weekData.push(null);
        } else {
          const currentDate = new Date(currentYear, currentMonth, dayCounter);
          weekData.push({
            date: currentDate.toISOString().split('T')[0],
            day: dayCounter,
          });
          dayCounter++;
        }
      }

      calendar.push(weekData);
    }

    return calendar;
  };

  const calendar = generateCalendar();

  return (
    <div>
      <h2>Calendar</h2>
      <div>
            <h3>Select Student</h3>
            <select value={selectedStudent} onChange={handleStudentChange}>
                <option value="">-- Select Student --</option>
                {students.map((student, index) => (
                    <option key={index} value={student}>
                    {student}
                    </option>
                ))}
            </select>
            </div>
      <div>
        <h3>Lesson Details</h3>
        <div>
          <label htmlFor="num">Num:</label>
          <input
            type="number"
            id="num"
            value={selectedNum}
            onChange={handleNumChange}
          />
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="text"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <button onClick={handleSaveLesson}>Save Lesson</button>
      </div>
      <div>
        <h3>Calendar</h3>
        <table>
          <thead>
            <tr>
              <th>Sun</th>
              <th>Mon</th>
              <th>Tue</th>
              <th>Wed</th>
              <th>Thu</th>
              <th>Fri</th>
              <th>Sat</th>
            </tr>
          </thead>
          <tbody>
                {calendar.map((week, index) => (
                    <tr key={index}>
                    {week.map((day) => (
                        <td
                        key={day ? day.date : 'null'}
                        onClick={() => handleDateClick(day ? day.date : '')}
                        style={{
                            border: '1px solid black', // Add a border
                            padding: '8px', // Adjust the padding for consistent spacing
                        }}
                        >
                        {day ? day.day : ''}
                        </td>
                    ))}
                    </tr>
                ))}
                </tbody>
        </table>
      </div>
    </div>
  );
};

export default Calendar;
