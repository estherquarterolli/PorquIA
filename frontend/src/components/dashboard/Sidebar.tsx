'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  TrendingUp,
  Repeat,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { UserAvatar } from '@/components/UserAvatar';

const LINKS = [
  { href: '/dashboard', Icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/transactions', Icon: ArrowLeftRight, label: 'Transações' },
  { href: '/budgets', Icon: Wallet, label: 'Orçamentos' },
  { href: '/investments', Icon: TrendingUp, label: 'Investimentos' },
  { href: '/subscriptions', Icon: Repeat, label: 'Assinaturas' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed bottom-0 lg:left-0 lg:top-0 w-full lg:w-20 lg:h-screen bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-t lg:border-t-0 lg:border-r border-gray-100 dark:border-zinc-800 shadow-sm z-50 flex lg:flex-col items-center py-4 lg:py-8 justify-around lg:justify-start px-4 lg:px-0">
      {/* Logo */}
      <div className="hidden lg:flex w-11 h-11 rounded-2xl overflow-hidden mb-12 shadow-lg shadow-pink-500/30 shrink-0">
        <Image src="/logo-porquia.png" alt="PorquIA" width={44} height={44} className="object-cover" />
      </div>

      {/* Nav Links */}
      <nav className="flex lg:flex-col lg:gap-4 flex-1 lg:flex-none justify-around lg:justify-start w-full lg:w-auto px-2 lg:px-0">
        {LINKS.map(({ href, Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`group relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                active
                  ? 'bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-600/40'
                  : 'text-slate-400 dark:text-slate-500 hover:bg-violet-50 dark:hover:bg-zinc-800 hover:text-violet-600 dark:hover:text-violet-400'
              }`}
            >
              <Icon strokeWidth={2} className="w-6 h-6" />
              {/* Tooltip (desktop) */}
              <span className="hidden lg:block absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-zinc-900 dark:bg-zinc-800 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: settings, logout, avatar (desktop) */}
      <div className="hidden lg:flex flex-col items-center gap-3 mt-auto">
        <Link
          href="/dashboard/settings"
          title="Configurações"
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            pathname === '/dashboard/settings'
              ? 'bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-600/40'
              : 'text-slate-400 dark:text-slate-500 hover:bg-violet-50 dark:hover:bg-zinc-800 hover:text-violet-600 dark:hover:text-violet-400'
          }`}
        >
          <Settings strokeWidth={2} className="w-6 h-6" />
        </Link>
        <button
          onClick={logout}
          title="Sair"
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 dark:hover:text-red-400 transition-all duration-300"
        >
          <LogOut strokeWidth={2} className="w-6 h-6" />
        </button>
        <div className="mt-1 p-0.5 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 shadow-md">
          <span className="block rounded-full ring-2 ring-white dark:ring-zinc-900">
            <UserAvatar user={user} size={36} />
          </span>
        </div>
      </div>
    </aside>
  );
}
