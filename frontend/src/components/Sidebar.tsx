'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  LineChart,
  RotateCcw,
  Settings,
  LogOut,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import { Avatar } from './Avatar';

export const NAV_LINKS = [
  { href: '/dashboard',     Icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/transactions',  Icon: ArrowLeftRight,  label: 'Transações' },
  { href: '/budgets',       Icon: Wallet,          label: 'Orçamentos' },
  { href: '/investments',   Icon: LineChart,       label: 'Investimentos' },
  { href: '/subscriptions', Icon: RotateCcw,       label: 'Assinaturas' },
  { href: '/settings',      Icon: Settings,        label: 'Configurações' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <aside className="h-full flex flex-col bg-white/55 dark:bg-[#140f24]/70 backdrop-blur-2xl border-r border-white/60 dark:border-white/5">
      {/* Marca */}
      <div className="px-6 pt-7 pb-6">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-2xl brand-gradient flex items-center justify-center text-white font-bold text-xl shadow-[0_8px_24px_-6px_rgba(168,85,247,0.7)] transition-transform group-hover:scale-105">
            P
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-fuchsia-300" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <p className="font-bold text-[15px] text-slate-900 dark:text-white">PorquIA</p>
            <p className="text-[11px] font-medium text-brand-500 dark:text-brand-300">Finanças com IA</p>
          </div>
        </Link>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Menu</p>
        {NAV_LINKS.map(({ href, Icon, label }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                active
                  ? 'text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:text-brand-700 dark:hover:text-white hover:bg-brand-50/70 dark:hover:bg-white/5'
              }`}
            >
              {active && (
                <span className="absolute inset-0 rounded-xl brand-gradient shadow-[0_8px_22px_-8px_rgba(168,85,247,0.8)]" />
              )}
              <Icon className="relative w-[18px] h-[18px] shrink-0" strokeWidth={active ? 2.4 : 2} />
              <span className="relative">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Card promo IA */}
      <div className="px-4 pb-4">
        <div className="relative overflow-hidden rounded-2xl p-4 brand-gradient text-white shadow-[0_12px_30px_-12px_rgba(168,85,247,0.7)]">
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/20 rounded-full blur-2xl" />
          <p className="relative text-xs font-semibold leading-snug">
            Registre gastos pelo Telegram
          </p>
          <p className="relative text-[11px] text-white/75 mt-1 leading-snug">
            “gastei 50 no mercado” e a IA cuida do resto.
          </p>
        </div>
      </div>

      {/* Rodapé: tema + usuário */}
      <div className="px-4 pb-5 pt-3 border-t border-white/50 dark:border-white/5 space-y-3">
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-brand-50/70 dark:hover:bg-white/5 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          </button>
        )}

        {user && (
          <div className="flex items-center gap-3 px-1.5">
            <Avatar src={user.photoURL} name={user.displayName || user.email || ''} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {user.displayName || 'Usuário'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
            </div>
            <button
              onClick={logout}
              title="Sair"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-[18px] h-[18px]" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
