"use client";

import ContentCalendar from "./ContentCalendar";
import React from "react";

interface Post {
  id: number;
  content: string;
  status: string;
  scheduled_at: string | null;
  mock_likes?: number;
  mock_comments?: number;
  mock_shares?: number;
}

export default function ClientCalendarWrapper({ posts }: { posts: Post[] }) {
  return <ContentCalendar posts={posts} />;
}
