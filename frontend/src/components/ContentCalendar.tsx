"use client";

import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar-custom.css'; // Custom CSS for styling

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const events = [
  {
    title: 'Scheduled Post 1',
    start: new Date(2025, 7, 15, 10, 0), // August 15, 2025, 10:00 AM
    end: new Date(2025, 7, 15, 11, 0),   // August 15, 2025, 11:00 AM
  },
  {
    title: 'Campaign Launch',
    start: new Date(2025, 7, 20, 14, 0), // August 20, 2025, 2:00 PM
    end: new Date(2025, 7, 20, 15, 0),   // August 20, 2025, 3:00 PM
  },
];

export default function ContentCalendar() {
  const [myEvents, setMyEvents] = useState(events);

  const handleSelectEvent = (event: any) => {
    alert(`Selected event: ${event.title}`);
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const title = window.prompt('New Event name');
    if (title) {
      setMyEvents([...myEvents, { start, end, title }]);
    }
  };

  return (
    <div className="h-[600px]">
      <Calendar
        localizer={localizer}
        events={myEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
      />
    </div>
  );
}
