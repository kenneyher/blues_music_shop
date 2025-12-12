'use client';

import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Disc2Icon, TicketCheck, LogOut } from 'lucide-react';
import { PageProps } from '@/types'; 

export default function Sidebar() {
  // CORRECT DESTRUCTURING:
  // 1. 'url' comes directly from usePage()
  // 2. 'props' contains your 'auth' user data
  const { url, props } = usePage<PageProps>();
  const { auth } = props;
  const user = auth.user;

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
    {
      label: 'Orders',
      href: '/admin/orders',
      icon: TicketCheck,
    },
  ];

  return (
    <aside className="fixed z-40 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 md:relative bg-white text-gray-800">
      
      {/* 1. Header / Logo */}
      <div className="h-16 flex items-center px-6 border-b font-bold text-xl tracking-tight">
        Blue's Music
      </div>

      {/* 2. Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          // Check if the current URL starts with this link's href
          const isActive = url.startsWith(item.href);

          return (
            <Link
              href={item.href}
              key={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 font-medium
                ${isActive 
                  ? 'bg-accent text-white shadow-md' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 3. User Footer */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 mb-4">
            {/* Simple Avatar Circle */}
            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-secondary-foreground font-bold">
                {user.first_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                    {user.first_name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                    {user.email}
                </p>
            </div>
        </div>

        <Link
            href={'/logout'}
            method="post"
            as="button"
            className="flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
        </Link>
      </div>
    </aside>
  );
}