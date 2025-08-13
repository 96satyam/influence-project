"use client";

import React from "react";
import DashboardPage from "@/app/dashboard/page"; // Import the original DashboardPage

interface Post {
  id: number;
  content: string;
  status: string;
  scheduled_at: string | null;
  mock_likes?: number;
  mock_comments?: number;
  mock_shares?: number;
}

type User = {
  id: string;
  first_name: string;
  last_name: string;
  profile_picture_url?: string;
};

// This component will simply render the DashboardPage, ensuring it's client-side
export default function DashboardClientWrapper() {
  return <DashboardPage />;
}
