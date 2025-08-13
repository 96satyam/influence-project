"use client";

import React, { useState, useEffect } from "react";

interface DashboardContentProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function DashboardContent({ searchParams }: DashboardContentProps) {
  const userId = searchParams?.user_id as string | undefined;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate a small delay to mimic client-side rendering
    setTimeout(() => {
      if (userId) {
        setLoading(false);
        setError(null);
      } else {
        setError("User ID not found in URL.");
        setLoading(false);
      }
    }, 100);
  }, [userId]);

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-gray-100"><p className="text-gray-700">Loading dashboard...</p></main>;
  if (error) return <main className="flex min-h-screen items-center justify-center bg-gray-100"><p className="text-red-500">Error: {error}</p></main>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 shadow-lg py-5 px-8">
        <h1 className="text-2xl font-bold text-white">Dashboard (Minimal Client Content)</h1>
      </header>
      <main className="p-8">
        <p className="text-gray-300">User ID from URL: {userId || "N/A"}</p>
        <p className="text-gray-300">This is a very basic client-side component to test memory.</p>
      </main>
    </div>
  );
}
