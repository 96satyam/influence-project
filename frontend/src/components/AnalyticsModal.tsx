"use client";

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react'; // Assuming lucide-react is available for icons
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const data = [
  { name: 'Jan', posts: 40, engagement: 2400 },
  { name: 'Feb', posts: 30, engagement: 1398 },
  { name: 'Mar', posts: 20, engagement: 9800 },
  { name: 'Apr', posts: 27, engagement: 3908 },
  { name: 'May', posts: 18, engagement: 4800 },
  { name: 'Jun', posts: 23, engagement: 3800 },
  { name: 'Jul', posts: 34, engagement: 4300 },
];

export default function AnalyticsModal({ isOpen, onClose }: AnalyticsModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
          <Dialog.Title className="mb-4 text-2xl font-bold">Analytics Overview</Dialog.Title>
          <div className="mb-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="posts" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="engagement" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <Dialog.Description className="mb-4 text-gray-600">
            This is a sample analytics dashboard showing post frequency and engagement over time.
          </Dialog.Description>
          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 inline-flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Close"
            >
              {/* <X className="h-4 w-4" /> */} {/* Re-enable if lucide-react is installed */}
              X
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
