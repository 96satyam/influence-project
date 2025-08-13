import React, { Suspense } from "react";
import dynamic from 'next/dynamic';

// Dynamically import the client-side dashboard wrapper
const DashboardClientWrapper = dynamic(() => import("@/components/DashboardClientWrapper"), { ssr: false });

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardClientWrapper />
    </Suspense>
  );
}
