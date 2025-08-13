"use client";

import { useState } from 'react';
import ContentCalendar from '../../components/ContentCalendar';
import AnalyticsModal from '../../components/AnalyticsModal';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerateContent = () => {
    alert('Generate Content button clicked!');
    // In a real application, this would trigger content generation logic
  };

  const handleOpenAnalytics = () => {
    setIsModalOpen(true);
  };

  const handleCloseAnalytics = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleGenerateContent}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Generate Content
          </button>
          <button
            onClick={handleOpenAnalytics}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            View Analytics
          </button>
          {/* Profile Image Icon - Placeholder */}
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold">
            P
          </div>
        </div>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Content Calendar</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ContentCalendar />
        </div>
      </section>

      <AnalyticsModal isOpen={isModalOpen} onClose={handleCloseAnalytics} />
    </div>
  );
}
