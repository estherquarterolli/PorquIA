'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Home,
  TrendingUp,
  Wallet,
  PieChart,
  MoreHorizontal,
  Settings,
  LogOut,
} from 'lucide-react';

const LINKS = [
  { href: '/dashboard',     Icon: Home,    label: 'Dashboard'    },
  { href: '/transactions',  Icon: TrendingUp, label: 'Transações'   },
  { href: '/budgets',       Icon: Wallet,  label: 'Orçamentos'   },
  { href: '/investments',   Icon: PieChart, label: 'Investimentos'},
  { href: '/subscriptions', Icon: TrendingUp, label: 'Assinaturas'  },
  { href: '/settings',      Icon: Settings, label: 'Configurações'},
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="h-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col">
      {/* Header */}
      <div className="px-8 py-8 border-b border-slate-200/50 dark:border-slate-700/50">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-lg font-bold text-white">
            P
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-base leading-tight">PorquIA</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Finanças</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-5 py-8 space-y-2 overflow-y-auto">
        {LINKS.map(({ href, Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={2} />
              <span>{label}</span>
              {active && <div className="ml-auto w-2 h-2 rounded-full bg-blue-600" />}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      {user && (
        <div className="px-5 py-6 border-t border-slate-200/50 dark:border-slate-700/50 space-y-4">
          <div className="flex items-center gap-3">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Avatar"
                className="w-10 h-10 rounded-lg object-cover ring-2 ring-blue-400/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {(user.displayName || user.email || '?')[0].toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {user.displayName || 'Usuário'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 py-2 px-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      )}
    </aside>
  );
}
