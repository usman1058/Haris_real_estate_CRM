'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Users, Layers3, LayoutDashboard, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import clsx from 'clsx';

const menuItems = [
  { name: 'Dashboard', href: '/Dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Dealers', href: '/dealers', icon: <Users size={20} /> },
  { name: 'Inventory', href: '/inventory', icon: <Layers3 size={20} /> },
  { name: 'Demand', href: '/demand', icon: <Building2 size={20} /> },
];

export default function Sidemenu() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 h-screen w-64 bg-white border-r shadow-sm hidden md:flex flex-col">
      <div className="px-6 py-4 font-bold text-lg border-b">
        Haris CRM
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={clsx(
              'flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              pathname.startsWith(item.href)
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
