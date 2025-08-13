"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id");

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 shadow-lg py-5 px-8">
        <h1 className="text-2xl font-bold text-white">Dashboard Test Page</h1>
      </header>
      <main className="p-8">
        <p className="text-gray-300">User ID: {userId || "N/A"}</p>
        <p className="text-gray-300">This is a minimal test page to diagnose memory issues.</p>
      </main>
    </div>
  );
}
