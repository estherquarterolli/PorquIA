'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  LineChart,
  MoreHorizontal,
} from 'lucide-react';

const MOBILE_ITEMS = [
  { href: '/dashboard',    label: 'Início',     Icon: LayoutDashboard },
  { href: '/transactions', label: 'Transações', Icon: ArrowLeftRight },
  { href: '/budgets',      label: 'Orçamentos', Icon: Wallet },
  { href: '/investments',  label: 'Investir',   Icon: LineChart },
  { href: '/more',         label: 'Mais',       Icon: MoreHorizontal, match: ['/more', '/subscriptions', '/settings'] },
];

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/80 dark:bg-[#0b0815]/90 backdrop-blur-2xl border-t border-white/60 dark:border-white/10"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex">
        {MOBILE_ITEMS.map(({ href, label, Icon, match }) => {
          const active = match ? match.some((m) => pathname.startsWith(m)) : pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-1 pt-2.5 pb-2 text-[10.5px] font-semibold"
            >
              <span
                className={`flex items-center justify-center w-11 h-7 rounded-full transition-all ${
                  active ? 'brand-gradient text-white shadow-[0_6px_16px_-6px_rgba(168,85,247,0.8)]' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={2.4} />
              </span>
              <span className={active ? 'text-brand-600 dark:text-brand-300' : 'text-slate-400 dark:text-slate-500'}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function FullScreenLoader() {
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full brand-gradient opacity-70 blur-lg animate-pulse" />
        <div className="absolute inset-0 rounded-full border-[3px] border-brand-500/20 border-t-brand-500 animate-spin" />
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();

  const isPublic = pathname === '/login';

  useEffect(() => {
    if (!loading && !user && !isPublic) router.push('/login');
  }, [user, loading, isPublic, router]);

  if (isPublic) return <>{children}</>;
  if (loading || !user) return <FullScreenLoader />;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 z-40">
        <Sidebar />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 px-4 lg:px-8 py-6 pb-28 lg:pb-10">{children}</main>
      </div>

      <MobileNav pathname={pathname} />
    </div>
  );
}
