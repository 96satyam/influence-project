"use client";

import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import './calendar-custom.css'; // Custom CSS for styling
import AnalyticsModal from "./AnalyticsModal";

interface Post {
    id: number;
    content: string;
    status: string;
    scheduled_at: string | null;
    mock_likes?: number;
    mock_comments?: number;
    mock_shares?: number;
}

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function ContentCalendar({ posts }: { posts: Post[] }) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const events = posts
    .filter(post => post.status === 'scheduled' && post.scheduled_at)
    .map(post => ({
      title: post.content.substring(0, 30) + "...",
      start: new Date(post.scheduled_at!),
      end: new Date(post.scheduled_at!),
      allDay: true,
      resource: post,
    }));

  console.log("Calendar events:", events); // Debugging: Check events array

  return (
    <>
      <div className="h-[500px] rounded-lg bg-gray-700 p-4 border border-gray-600 shadow-inner text-gray-100">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={(event) => {
            console.log("Selected post:", event.resource); // Debugging: Check selected post
            setSelectedPost(event.resource);
          }}
          defaultView="month"
          views={['month', 'week', 'day', 'agenda']}
          step={60}
          showMultiDayTimes
        />
      </div>
      
      <AnalyticsModal
        post={selectedPost}
        isOpen={!!selectedPost}
        onOpenChange={(isOpen) => { if (!isOpen) { setSelectedPost(null); }}}
      />
    </>
  );
}
