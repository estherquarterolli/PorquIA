'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Avatar } from '@/components/Avatar';
import { RotateCcw, Settings, LineChart, Wallet, LogOut, ChevronRight } from 'lucide-react';

const ITEMS = [
  { href: '/investments',   icon: LineChart, label: 'Investimentos', desc: 'Aportes e evolução', color: '#10b981' },
  { href: '/budgets',       icon: Wallet,    label: 'Orçamentos',    desc: 'Limites por categoria', color: '#a855f7' },
  { href: '/subscriptions', icon: RotateCcw, label: 'Assinaturas',   desc: 'Pagamentos recorrentes', color: '#f43f5e' },
  { href: '/settings',      icon: Settings,  label: 'Configurações', desc: 'Perfil e Telegram', color: '#3b82f6' },
];

export default function MorePage() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">Mais</h1>

      {user && (
        <div className="relative overflow-hidden rounded-3xl p-6 brand-gradient text-white shadow-[0_18px_45px_-18px_rgba(168,85,247,0.7)]">
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/20 rounded-full blur-2xl" />
          <div className="relative flex items-center gap-4">
            <Avatar src={user.photoURL} name={user.displayName || ''} size="lg" className="!ring-2 !ring-white/30" />
            <div className="min-w-0">
              <p className="font-bold">{user.displayName || 'Usuário'}</p>
              <p className="text-white/75 text-sm truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {ITEMS.map(({ href, icon: Icon, label, desc, color }) => (
          <Link key={href} href={href} className="card card-hover p-4 flex items-center gap-4">
            <span className="w-11 h-11 rounded-xl grid place-items-center shrink-0" style={{ backgroundColor: `${color}1f`, color }}>
              <Icon className="w-5 h-5" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 dark:text-white text-sm">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600" />
          </Link>
        ))}
      </div>

      <button onClick={logout} className="w-full px-6 py-3.5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2">
        <LogOut className="w-5 h-5" /> Sair
      </button>

      <p className="text-center text-xs text-slate-400 dark:text-slate-600 font-medium">PorquIA v1.0.0 · Finanças com IA</p>
    </div>
  );
}
