'use client';

import DashboardLayout from '@/layouts/dashboard-layout';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="mb-4 text-2xl font-bold">Admin Dashboard</h1>
        <p>Welcome to the admin dashboard!</p>
      </div>
    </DashboardLayout>
  );
}
