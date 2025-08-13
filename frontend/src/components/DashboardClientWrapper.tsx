"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image"; // Keep this import for Image component
import dynamic from 'next/dynamic';
import { formatISO } from 'date-fns'; // Add formatISO import

// Dynamically import components that might cause memory issues
const ClientCalendarWrapper = dynamic(() => import("@/components/ClientCalendar"), { ssr: false });
const AnalyticsModal = dynamic(() => import("@/components/AnalyticsModal"), { ssr: false });
const DynamicImage = dynamic(() => import("next/image"), { ssr: false }); // Dynamically import Image

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

export default function DashboardClientWrapper() {
  const searchParams = useSearchParams();
  const [clientUserId, setClientUserId] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  
  const [industry, setIndustry] = useState("Artificial Intelligence");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchAllPosts = useCallback(async (currentUserId: string) => {
    if (!currentUserId || !API_BASE_URL) return;
    try {
      const response = await fetch(`${API_BASE_URL}/users/${currentUserId}/posts`);
      if (!response.ok) throw new Error("Failed to fetch posts.");
      setPosts(await response.json());
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    const id = searchParams.get("user_id");
    setClientUserId(id);
  }, [searchParams]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (clientUserId && API_BASE_URL) {
        setLoading(true);
        try {
          const userResponse = await fetch(`${API_BASE_URL}/users/${clientUserId}`);
          if (!userResponse.ok) throw new Error("Failed to fetch user data.");
          setUser(await userResponse.json());
          await fetchAllPosts(clientUserId);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else if (clientUserId === null) {
        setError("User ID not found in URL.");
        setLoading(false);
      }
    };
    if (clientUserId !== undefined) {
      fetchInitialData();
    }
  }, [clientUserId, fetchAllPosts, API_BASE_URL]);

  const handleGeneratePost = async () => {
    if (!clientUserId) return alert("User ID is missing.");
    if (!industry.trim()) return alert("Please enter an industry.");
    if (!API_BASE_URL) return alert("API Base URL is not configured.");

    setIsGenerating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${clientUserId}/generate_post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry }),
      });
      if (!response.ok) throw new Error("Failed to generate post.");
      await fetchAllPosts(clientUserId);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSchedulePost = async (postId: number) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0);

    if (!API_BASE_URL) return alert("API Base URL is not configured.");

    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'scheduled',
          scheduled_at: formatISO(tomorrow),
        }),
      });
      if (!response.ok) throw new Error("Failed to schedule post.");
      await fetchAllPosts(clientUserId!);
    } catch (err: any) {
      alert(`Error scheduling post: ${err.message}`);
    }
  };

  const draftPosts = posts.filter(p => p.status === 'draft');
  const scheduledPosts = posts.filter(p => p.status === 'scheduled');
  
  if (loading) return <main className="flex min-h-screen items-center justify-center bg-gray-100"><p className="text-gray-700">Loading dashboard...</p></main>;
  if (error) return <main className="flex min-h-screen items-center justify-center bg-gray-100"><p className="text-red-500">Error: {error}</p></main>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg py-5 px-8 flex items-center justify-between">
        <div className="flex items-center space-x-5">
          {user?.profile_picture_url && (
            <DynamicImage // Use DynamicImage here
              src={user.profile_picture_url}
              alt="Profile Picture"
              width={56}
              height={56}
              className="rounded-full border-3 border-blue-400"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome, {user?.first_name || 'User'}!</h1>
            <p className="text-md text-gray-300">Your personal AI for LinkedIn branding.</p>
          </div>
        </div>
        {/* Placeholder for other header elements like notifications or settings */}
      </header>

      <main className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: AI Content Generation & Drafts */}
        <section className="lg:col-span-2 space-y-8">
          {/* AI Content Generation Card */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-7">
            <h2 className="text-3xl font-bold text-white mb-5">AI Content Generation</h2>
            <p className="text-gray-300 mb-5">
              Enter your industry to research trends and generate a new post draft.
            </p>
            <div className="mb-5">
              <label htmlFor="industry" className="block text-sm font-medium text-gray-300 mb-2">
                Industry
              </label>
              <input
                type="text"
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-5 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., FinTech, Renewable Energy"
              />
            </div>
            <button
              onClick={handleGeneratePost}
              disabled={isGenerating}
              className="w-full bg-blue-600 text-white font-semibold py-3 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed text-lg"
            >
              {isGenerating ? "Generating Draft..." : "Generate New Draft"}
            </button>
          </div>

          {/* Drafts List Card */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-7">
            <h2 className="text-3xl font-bold text-white mb-5">Drafts</h2>
            <div className="space-y-5">
              {draftPosts.length > 0 ? (
                draftPosts.map(post => (
                  <div key={post.id} className="flex items-center justify-between bg-gray-700 p-5 rounded-lg border border-gray-600">
                    <p className="text-gray-200 text-base flex-grow pr-5 truncate">{post.content}</p>
                    <button
                      onClick={() => handleSchedulePost(post.id)}
                      className="bg-green-600 text-white text-base font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 flex-shrink-0"
                    >
                      Schedule
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-5 text-lg">No drafts available. Generate a new post to get started!</p>
              )}
            </div>
          </div>
        </section>

        {/* Right Column: Content Calendar */}
        <section className="lg:col-span-1">
          <div className="bg-gray-800 rounded-xl shadow-lg p-7 h-full flex flex-col">
            <h2 className="text-3xl font-bold text-white mb-5">Content Calendar</h2>
            <div className="flex-grow">
              {clientUserId ? (
                <ClientCalendarWrapper posts={scheduledPosts} />
              ) : (
                <p className="text-gray-400 text-center py-5 text-lg">Login to view your calendar.</p>
              )}
            </div>
          </div>
        </section>
      </main>
      <AnalyticsModal
        post={selectedPost}
        isOpen={!!selectedPost}
        onOpenChange={(isOpen) => { if (!isOpen) { setSelectedPost(null); }}}
      />
    </div>
  );
}
