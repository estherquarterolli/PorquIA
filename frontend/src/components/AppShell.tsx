'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Sidebar } from './Sidebar';
import { UserAvatar } from './UserAvatar';
import { Menu, X, Search, Bell } from 'lucide-react';

const PUBLIC_ROUTES = ['/login', '/'];

const TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transações',
  '/budgets': 'Orçamentos',
  '/investments': 'Investimentos',
  '/subscriptions': 'Assinaturas',
  '/settings': 'Configurações',
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const title = TITLES[pathname] ?? 'PorquIA';

  useEffect(() => {
    if (!loading && !user && !isPublic) {
      router.replace('/login');
    }
  }, [user, loading, isPublic, router]);

  // Fecha o drawer ao trocar de rota
  useEffect(() => setDrawerOpen(false), [pathname]);

  if (isPublic) return <>{children}</>;

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500 animate-pulse shadow-lg shadow-pink-500/40" />
          <p className="text-sm font-medium text-slate-400 dark:text-slate-500">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Sidebar desktop */}
      <div className="hidden lg:flex lg:w-64 lg:fixed lg:inset-y-0 z-40">
        <Sidebar />
      </div>

      {/* Drawer mobile */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 max-w-[85%] shadow-2xl animate-slide-in">
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute top-4 right-4 z-10 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      {/* Conteúdo */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 lg:px-8 h-16 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-zinc-900">
          {/* Hamburger (mobile) */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden w-10 h-10 -ml-1 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-900"
          >
            <Menu className="w-5 h-5" />
          </button>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>

          <div className="flex-1" />

          {/* Search (desktop) */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-40 lg:w-56 pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-full text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            />
          </div>

          <button className="relative w-10 h-10 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-full ring-2 ring-gray-50 dark:ring-zinc-950" />
          </button>

          <div className="p-0.5 rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500 shrink-0">
            <span className="block rounded-full ring-2 ring-gray-50 dark:ring-zinc-950">
              <UserAvatar user={user} size={34} />
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
