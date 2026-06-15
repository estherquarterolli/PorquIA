'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Home,
  Layers,
  Wallet,
  PieChart,
  Calendar,
  Settings,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';

const LINKS = [
  { href: '/dashboard', Icon: Home, label: 'Home' },
  { href: '/dashboard/layers', Icon: Layers, label: 'Layers' },
  { href: '/dashboard/wallet', Icon: Wallet, label: 'Wallet' },
  { href: '/dashboard/stats', Icon: PieChart, label: 'Stats' },
  { href: '/dashboard/calendar', Icon: Calendar, label: 'Calendar' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="fixed bottom-0 lg:left-0 lg:top-0 w-full lg:w-20 lg:h-screen bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t lg:border-t-0 lg:border-r border-gray-100 dark:border-slate-800 shadow-sm z-50 flex lg:flex-col items-center py-4 lg:py-8 justify-around lg:justify-start px-4 lg:px-0">
      
      {/* Logo Area (Hidden on Mobile) */}
      <div className="hidden lg:flex w-10 h-10 rounded-xl bg-blue-600 items-center justify-center text-white font-bold text-xl mb-12 shadow-lg shadow-blue-600/30">
        P
      </div>

      {/* Nav Links */}
      <nav className="flex lg:flex-col lg:gap-6 flex-1 lg:flex-none justify-around lg:justify-start w-full lg:w-auto px-2 lg:px-0">
        {LINKS.map(({ href, Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                active
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <Icon strokeWidth={2} className="w-6 h-6" />
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions (Hidden on Mobile, but visible Settings) */}
      <div className="hidden lg:flex flex-col gap-4 mt-auto">
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle Theme"
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
          >
            {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        )}
        <Link
          href="/dashboard/settings"
          title="Settings"
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            pathname === '/dashboard/settings'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
        >
          <Settings strokeWidth={2} className="w-6 h-6" />
        </Link>
        <button
          onClick={logout}
          title="Logout"
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-all duration-300"
        >
          <LogOut strokeWidth={2} className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Theme Toggle */}
      {mounted && (
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="lg:hidden w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 ml-2"
        >
          {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      )}
    </aside>
  );
}
