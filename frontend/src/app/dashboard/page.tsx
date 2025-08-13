import dynamic from 'next/dynamic';

const DashboardClientWrapper = dynamic(() => import("@/components/DashboardClientWrapper"), { ssr: false });

export default function DashboardPage() {
  return <DashboardClientWrapper />;
}
