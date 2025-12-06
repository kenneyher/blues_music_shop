'use client';

import { Link } from '@inertiajs/react';
import { LayoutDashboard } from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
  ];

  return (
    <>
      <aside className="fixed z-40 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 md:relative">
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                href={item.href}
                className="flex items-center space-x-2 gap-3 px-4 py-2 rounded-sm transition-colors duration-200 hover:bg-sidebar-hover"
                key={item.href}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
