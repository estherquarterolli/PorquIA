'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Search, Bell, Sun, Moon, LogOut, AlertTriangle, ArrowDownRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useBudgets, useTransactions } from '@/lib/hooks';
import { Avatar } from './Avatar';
import { NAV_LINKS } from './Sidebar';

const TITLES: Record<string, string> = Object.fromEntries(
  NAV_LINKS.map((l) => [l.href, l.label]),
);

export function Topbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { budgets, fetchBudgets } = useBudgets();
  const { transactions, fetchTransactions } = useTransactions();
  const [mounted, setMounted] = useState(false);
  const [menu, setMenu] = useState(false);
  const [notifMenu, setNotifMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchBudgets();
    fetchTransactions();
  }, []);

  const title =
    TITLES[pathname] ??
    (pathname.startsWith('/subscriptions') ? 'Assinaturas'
      : pathname.startsWith('/more') ? 'Mais' : 'PorquIA');

  const budgetsAtRisk = budgets.filter(b => {
    const spent = transactions
      .filter(t => t.category === b.category && t.type === 'despesa')
      .reduce((sum, t) => sum + t.amount, 0);
    return spent / b.monthly_limit > 0.7;
  });

  const hasNotifications = budgetsAtRisk.length > 0 || transactions.length > 0;

  return (
    <header className="sticky top-0 z-30 px-4 lg:px-8 py-3.5 backdrop-blur-xl bg-white/55 dark:bg-[#0b0815]/55 border-b border-white/50 dark:border-white/5">
      <div className="flex items-center gap-3">
        {/* Marca mobile */}
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center text-white font-bold">P</div>
        </div>

        {/* Título da página (desktop) */}
        <h2 className="hidden lg:block text-lg font-bold text-slate-900 dark:text-white">{title}</h2>

        <div className="flex-1" />

        {/* Busca */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            placeholder="Buscar…"
            className="w-44 lg:w-64 pl-10 pr-4 py-2.5 rounded-full text-sm bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-transparent transition-all"
          />
        </div>

        {/* Tema (mobile/tablet — no desktop fica na sidebar também) */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="lg:hidden w-10 h-10 rounded-full grid place-items-center bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 text-slate-500 dark:text-slate-300 hover:text-brand-600 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}

        {/* Notificações */}
        <div className="relative">
          <button
            onClick={() => setNotifMenu((v) => !v)}
            className="relative w-10 h-10 rounded-full grid place-items-center bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 text-slate-500 dark:text-slate-300 hover:text-brand-600 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {hasNotifications && (
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-fuchsia-500 ring-2 ring-white dark:ring-[#0b0815]" />
            )}
          </button>

          {notifMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifMenu(false)} />
              <div className="absolute right-0 mt-2 w-80 card !rounded-2xl overflow-hidden z-20 animate-fade-in-up max-h-96 overflow-y-auto">
                <div className="px-4 py-3 border-b border-slate-200/60 dark:border-white/10 sticky top-0 bg-white dark:bg-white/5 backdrop-blur">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notificações</h3>
                </div>

                {budgetsAtRisk.length === 0 && transactions.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Nada novo por enquanto. Continue assim! 🎉</p>
                  </div>
                ) : (
                  <>
                    {budgetsAtRisk.length > 0 && (
                      <>
                        <div className="px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide border-b border-slate-100 dark:border-white/5">
                          Orçamentos em alerta
                        </div>
                        {budgetsAtRisk.map((b) => {
                          const spent = transactions
                            .filter(t => t.category === b.category && t.type === 'despesa')
                            .reduce((sum, t) => sum + t.amount, 0);
                          const percent = Math.round((spent / b.monthly_limit) * 100);
                          return (
                            <div key={b.id} className="px-4 py-3 border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                              <div className="flex items-start gap-3">
                                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{b.category}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{percent}% do orçamento</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}

                    {transactions.length > 0 && (
                      <>
                        <div className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide border-b border-slate-100 dark:border-white/5">
                          Últimas transações
                        </div>
                        {transactions.slice(0, 3).map((t) => (
                          <div key={t.id} className="px-4 py-3 border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/10 grid place-items-center">
                                <ArrowDownRight className={`w-4 h-4 ${t.type === 'receita' ? 'text-emerald-500 rotate-180' : 'text-rose-500'}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{t.description}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{t.category}</p>
                              </div>
                              <span className={`text-sm font-bold shrink-0 ${t.type === 'receita' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}`}>
                                {t.type === 'receita' ? '+' : '−'}R$ {t.amount.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Avatar + menu */}
        <div className="relative">
          <button
            onClick={() => setMenu((v) => !v)}
            className="ring-2 ring-brand-300/50 hover:ring-brand-400 transition-all rounded-full overflow-hidden"
          >
            <Avatar src={user?.photoURL} name={user?.displayName || user?.email || ''} size="md" />
          </button>

          {menu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
              <div className="absolute right-0 mt-2 w-56 card !rounded-2xl overflow-hidden z-20 animate-fade-in-up">
                <div className="px-4 py-3.5 border-b border-slate-200/60 dark:border-white/10">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {user?.displayName || 'Usuário'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email}</p>
                </div>
                <button
                  onClick={() => { setMenu(false); logout(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sair da conta
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
