"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

export default function DashboardClientWrapper() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id");

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 shadow-lg py-5 px-8">
        <h1 className="text-2xl font-bold text-white">Dashboard (Minimal)</h1>
      </header>
      <main className="p-8">
        <p className="text-gray-300">User ID: {userId || "N/A"}</p>
        <p className="text-gray-300">This is a very minimal dashboard to test memory issues.</p>
      </main>
    </div>
  );
}
