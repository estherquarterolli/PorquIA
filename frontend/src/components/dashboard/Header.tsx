'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Bell, LogOut, Settings, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { UserAvatar } from '@/components/UserAvatar';

export function Header() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const firstName = user?.displayName?.split(' ')[0] || 'aí';

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between py-6 px-4 lg:px-10 gap-4">
      {/* Greeting */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 dark:from-violet-400 dark:via-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">
            Olá, {firstName}
          </h1>
          <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
          Aqui está o resumo das suas finanças
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Search */}
        <div className="relative flex-1 sm:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full sm:w-44 lg:w-60 pl-10 pr-4 py-2.5 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-full text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-sm transition-all"
          />
        </div>

        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Alternar tema"
            className="w-11 h-11 rounded-full bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-white/50 dark:border-white/10 flex items-center justify-center text-amber-500 dark:text-amber-300 hover:scale-105 shadow-sm transition-all shrink-0"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}

        {/* Notifications */}
        <button className="relative w-11 h-11 rounded-full bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-white/50 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 shadow-sm transition-colors shrink-0">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full ring-2 ring-white dark:ring-zinc-900"></span>
        </button>

        {/* Avatar + menu */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="block rounded-full p-0.5 bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-400 hover:scale-105 transition-transform shadow-lg shadow-violet-500/20"
          >
            <span className="block rounded-full ring-2 ring-white dark:ring-zinc-900">
              <UserAvatar user={user} size={40} />
            </span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden z-50 animate-fade-in-up">
              {/* User info */}
              <div className="p-4 flex items-center gap-3 bg-gradient-to-br from-violet-50 to-cyan-50 dark:from-violet-950/40 dark:to-cyan-950/30">
                <UserAvatar user={user} size={44} />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {user?.displayName || 'Usuário'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="p-2">
                <Link
                  href="/dashboard/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Settings className="w-4 h-4" /> Configurações
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
