'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Sidebar } from './Sidebar';
import {
  Home,
  TrendingUp,
  Wallet,
  PieChart,
  MoreHorizontal,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard',    label: 'Início',      Icon: Home  },
  { href: '/transactions', label: 'Transações',  Icon: TrendingUp    },
  { href: '/budgets',      label: 'Orçamentos',  Icon: Wallet },
  { href: '/investments',  label: 'Investir',    Icon: PieChart  },
  { href: '/more',         label: 'Mais',        Icon: MoreHorizontal, match: ['/more', '/subscriptions', '/settings'] },
];

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl border-t border-slate-200/50 dark:border-slate-700/50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex">
        {NAV_ITEMS.map(({ href, label, Icon, match }) => {
          const active = match ? match.includes(pathname) : pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center pt-3 pb-2 gap-1.5 text-[11px] font-medium transition-all ${
                active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={2.5} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();

  const isPublicRoute = pathname === '/login';

  useEffect(() => {
    if (!loading && !user && !isPublicRoute) {
      router.push('/login');
    }
  }, [user, loading, isPublicRoute, router]);

  if (isPublicRoute) return <>{children}</>;

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
        <div className="text-center">
          <div className="relative w-14 h-14 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 opacity-75 blur-lg animate-pulse" />
            <div className="absolute inset-0 rounded-full border-3 border-blue-600/20 border-t-blue-600 animate-spin" />
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 letter-spacing-wider">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 min-h-screen">
      <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 z-40">
        <Sidebar />
      </div>

      <main className="flex-1 lg:pl-72 pb-20 lg:pb-0 min-h-screen">
        {children}
      </main>

      <MobileNav pathname={pathname} />
    </div>
  );
}
