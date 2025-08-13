import React, { Suspense } from "react";
import dynamic from 'next/dynamic';

// Dynamically import the client-side dashboard content component
// Removed ssr: false from here, as this is a Server Component
const DashboardContent = dynamic(() => import("@/components/DashboardContent"));

// This is a Server Component, it receives searchParams as props
export default function DashboardPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      {/* Pass searchParams directly to the client component */}
      <DashboardContent searchParams={searchParams} />
    </Suspense>
  );
}
