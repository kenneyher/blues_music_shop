'use client';

import { Link, usePage } from '@inertiajs/react'; // 1. Import usePage
import { LayoutDashboard, Disc2Icon } from 'lucide-react';

export default function Sidebar() {
  // 2. Get the current URL
  const { url } = usePage(); 

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Inventory',
      href: '/admin/inventory',
      icon: Disc2Icon,
    },
  ];

  return (
    <aside className="fixed z-40 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 md:relative">
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            
            // 3. Check if active (does the URL start with this link?)
            const isActive = url.startsWith(item.href);

            return (
              <Link
                href={item.href}
                key={item.href}
                className={`flex items-center space-x-2 gap-3 px-4 py-2 rounded-sm transition-colors duration-200 
                  ${isActive 
                    ? 'bg-primary text-primary-foreground' // Active Style (e.g., Black bg, White text)
                    : 'text-gray-600 hover:bg-gray-100'    // Inactive Style
                  }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
    </aside>
  );
}