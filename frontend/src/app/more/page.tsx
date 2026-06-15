'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { RotateCcw, Settings, LogOut } from 'lucide-react';

const ITEMS = [
  { href: '/subscriptions', icon: RotateCcw, label: 'Assinaturas', desc: 'Pagamentos recorrentes' },
  { href: '/settings', icon: Settings, label: 'Configurações', desc: 'Perfil e Telegram' },
];

export default function MorePage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen px-6 lg:px-10 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200/50 dark:border-slate-700/50 pb-8">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white">Mais</h1>
        </div>

        {/* User Card */}
        {user && (
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-600/20">
            <div className="flex items-center gap-4">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-14 h-14 rounded-xl object-cover ring-2 ring-white/30" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center font-bold text-xl">
                  {(user.displayName || '?')[0].toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-base leading-tight">{user.displayName || 'Usuário'}</p>
                <p className="text-blue-100 text-sm truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Menu */}
        <div className="space-y-3">
          {ITEMS.map(({ href, icon: Icon, label, desc }) => (
            <Link key={href} href={href}>
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 shadow-sm dark:shadow-lg dark:shadow-black/20 border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100/60 dark:hover:bg-slate-700/60 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
                  </div>
                  <span className="text-slate-300 dark:text-slate-600">›</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full px-6 py-4 bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 font-bold rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-all flex items-center justify-center gap-2 text-base"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>

        <p className="text-center text-xs text-slate-400 dark:text-slate-600 font-semibold">PorquIA v1.0.0 • Finanças com IA</p>
      </div>
    </div>
  );
}
