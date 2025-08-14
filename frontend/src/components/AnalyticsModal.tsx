// in frontend/src/components/AnalyticsModal.tsx
"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Post {
  id: number;
  content: string;
  mock_likes?: number;
  mock_comments?: number;
  mock_shares?: number;
}

interface AnalyticsModalProps {
  post: Post | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function AnalyticsModal({ post, isOpen, onOpenChange }: AnalyticsModalProps) {
  if (!post) return null;

  const engagementData = [
    { name: 'Likes', value: post.mock_likes || 0 },
    { name: 'Comments', value: post.mock_comments || 0 },
    { name: 'Shares', value: post.mock_shares || 0 },
  ];

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
          <Dialog.Title className="text-lg font-bold text-gray-900">Post Details & Analytics</Dialog.Title>
          <div className="mt-4 rounded-md border bg-gray-50 p-3">
            <p className="whitespace-pre-wrap text-sm text-gray-700">{post.content}</p>
          </div>
          <div className="mt-6">
            <h3 className="text-md font-semibold text-gray-800">Mock Engagement</h3>
            <div className="mt-2 h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <Dialog.Close asChild>
            <button className="mt-6 w-full rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200">
              Close
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
