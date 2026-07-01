'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useProfile } from '@/lib/profile-context';
import { UserAvatar } from '@/components/UserAvatar';
import {
  LayoutDashboard,
  ArrowDownLeft,
  ArrowUpRight,
  Tag,
  Wallet,
  CalendarCheck,
  Repeat,
  CalendarClock,
  TrendingUp,
  Landmark,
  Settings,
  LogOut,
  Sun,
  Moon,
  Send,
  Zap,
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    label: 'FINANÇAS',
    links: [
      { href: '/dashboard',    Icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/transactions', Icon: ArrowUpRight,    label: 'Despesas' },
      { href: '/income',       Icon: ArrowDownLeft,   label: 'Receitas' },
    ],
  },
  {
    label: 'CONTROLE',
    links: [
      { href: '/budgets',      Icon: Wallet,          label: 'Orçamentos' },
      { href: '/categories',   Icon: Tag,             label: 'Categorias' },
      { href: '/recurring',    Icon: CalendarCheck,   label: 'Gastos Fixos' },
      { href: '/subscriptions',Icon: Repeat,          label: 'Assinaturas' },
    ],
  },
  {
    label: 'ANÁLISE',
    links: [
      { href: '/upcoming',     Icon: CalendarClock,   label: 'Próximos Meses' },
      { href: '/investments',  Icon: TrendingUp,      label: 'Investimentos' },
      { href: '/banks',        Icon: Landmark,        label: 'Importar Extrato' },
    ],
  },
  {
    label: 'CONTA',
    links: [
      { href: '/settings',     Icon: Settings,        label: 'Configurações' },
      { href: '/planos',       Icon: Zap,             label: 'Planos' },
    ],
  },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { telegramConnected } = useProfile();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = theme === 'dark';

  return (
    <aside className="h-full w-full bg-white dark:bg-zinc-950 border-r border-slate-100 dark:border-zinc-900 flex flex-col">
      {/* Logo */}
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="flex items-center gap-3 px-6 py-6"
      >
        <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-lg shadow-pink-500/30 shrink-0">
          <Image src="/logo-porquia.png" alt="PorquIA" width={44} height={44} className="object-cover" />
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-white text-base leading-tight">PorquIA</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Finanças com IA</p>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-4 overflow-y-auto space-y-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-3 mb-1.5 text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-600">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.links.map(({ href, Icon, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-lg shadow-pink-600/30'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-pink-50 dark:hover:bg-zinc-900 hover:text-pink-600 dark:hover:text-pink-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={2} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Telegram promo */}
      {!telegramConnected && (
        <div className="px-4 pb-4">
          <div className="rounded-2xl p-4 bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white shadow-lg shadow-pink-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Send className="w-4 h-4" />
              <p className="text-sm font-bold">Registre gastos pelo Telegram</p>
            </div>
            <p className="text-xs text-white/80 leading-snug">
              &quot;gastei 50 no mercado&quot; e a IA cuida do resto.
            </p>
          </div>
        </div>
      )}

      {/* Theme toggle */}
      {mounted && (
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="flex items-center gap-3 px-7 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {isDark ? 'Modo claro' : 'Modo escuro'}
        </button>
      )}

      {/* User */}
      {user && (
        <div className="flex items-center gap-3 px-5 py-4 border-t border-slate-100 dark:border-zinc-900">
          <UserAvatar user={user} size={36} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {user.displayName?.split(' ')[0] || 'Usuário'}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user.email}</p>
          </div>
          <button
            onClick={logout}
            title="Sair"
            className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      )}
    </aside>
  );
}
