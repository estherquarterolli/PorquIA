'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Sidebar } from './Sidebar';
import { UserAvatar } from './UserAvatar';
import { NotificationsBell } from './NotificationsBell';
import { BetaNotice } from './BetaNotice';
import { TutorialModal, TutorialStep } from './TutorialModal';
import {
  Menu, X, Search,
  LayoutDashboard, BarChart2, Sparkles,
  PenLine, Zap, Pencil, Download,
  Target, TrendingUp, Bell,
  RefreshCw, CalendarDays,
  Building2, Upload, CheckCircle,
  BarChart3,
  ScanSearch, Lightbulb,
  CalendarRange,
  Smartphone, Settings,
} from 'lucide-react';

const TUTORIALS: Record<string, { title: string; steps: TutorialStep[] }> = {
  '/dashboard': {
    title: 'Dashboard',
    steps: [
      {
        icon: LayoutDashboard,
        title: 'Visão Geral das Finanças',
        description: 'Aqui você vê um resumo completo: saldo total, entradas e saídas do mês atual, tudo atualizado em tempo real.',
      },
      {
        icon: BarChart2,
        title: 'Gráficos Interativos',
        description: 'Os gráficos mostram o histórico dos seus gastos por categoria e a evolução ao longo do tempo.',
      },
      {
        icon: Sparkles,
        title: 'Insights com IA',
        description: 'Nossa IA analisa seus dados e gera insights personalizados sobre seus hábitos financeiros automaticamente.',
      },
    ],
  },
  '/transactions': {
    title: 'Transações',
    steps: [
      {
        icon: PenLine,
        title: 'Adicionar com Linguagem Natural',
        description: 'Clique em "Nova Transação" e descreva em linguagem natural. Exemplo: "gastei 50 reais no mercado no cartão".',
      },
      {
        icon: Zap,
        title: 'Parser Inteligente',
        description: 'Nossa IA interpreta automaticamente o valor, categoria e forma de pagamento — sem precisar preencher campos.',
      },
      {
        icon: Pencil,
        title: 'Editar e Excluir',
        description: 'Clique nos ícones de lápis ou lixeira na linha da transação para editar descrição, categoria ou remover.',
      },
      {
        icon: Download,
        title: 'Exportar para Excel',
        description: 'Use o botão de exportação para baixar suas transações em CSV, compatível com Excel e Google Sheets.',
      },
    ],
  },
  '/budgets': {
    title: 'Orçamentos',
    steps: [
      {
        icon: Target,
        title: 'Crie Limites por Categoria',
        description: 'Defina um teto de gastos mensais por categoria. Exemplo: Alimentação → R$ 500, Lazer → R$ 200.',
      },
      {
        icon: TrendingUp,
        title: 'Acompanhe em Tempo Real',
        description: 'A barra de progresso mostra quanto você já gastou. Ela muda de cor conforme se aproxima do limite.',
      },
      {
        icon: Bell,
        title: 'Alertas Automáticos',
        description: 'Ao atingir 80% do orçamento de uma categoria, você recebe um aviso automático pelo Telegram.',
      },
    ],
  },
  '/recurring': {
    title: 'Gastos Fixos',
    steps: [
      {
        icon: RefreshCw,
        title: 'Cadastre Gastos Recorrentes',
        description: 'Registre despesas fixas mensais como aluguel, academia e streaming. Elas são lançadas automaticamente todo mês.',
      },
      {
        icon: CalendarDays,
        title: 'Projeção Automática',
        description: 'Com os gastos fixos cadastrados, você vê quanto já está comprometido antes mesmo de chegar o mês.',
      },
    ],
  },
  '/banks': {
    title: 'Importar Extrato',
    steps: [
      {
        icon: Building2,
        title: 'Exporte do Seu Banco',
        description: 'Acesse o app ou internet banking e exporte o extrato no formato OFX ou CSV.',
      },
      {
        icon: Upload,
        title: 'Faça o Upload',
        description: 'Arraste o arquivo para a área indicada ou clique para selecionar. O sistema processa tudo automaticamente.',
      },
      {
        icon: CheckCircle,
        title: 'Confirme as Transações',
        description: 'Revise as transações importadas antes de salvar. Você pode editar categorias e descrições.',
      },
    ],
  },
  '/investments': {
    title: 'Investimentos',
    steps: [
      {
        icon: TrendingUp,
        title: 'Registre seus Ativos',
        description: 'Adicione seus investimentos (ações, fundos, cripto, renda fixa) para acompanhar tudo em um só lugar.',
      },
      {
        icon: BarChart3,
        title: 'Acompanhe a Rentabilidade',
        description: 'Visualize o retorno total e mensal de cada ativo e a evolução do seu patrimônio ao longo do tempo.',
      },
    ],
  },
  '/subscriptions': {
    title: 'Assinaturas',
    steps: [
      {
        icon: ScanSearch,
        title: 'Detecção Automática',
        description: 'O PorquIA detecta automaticamente cobranças recorrentes nas suas transações (Netflix, Spotify, etc.).',
      },
      {
        icon: Lightbulb,
        title: 'Identifique o que Cancelar',
        description: 'Veja o total mensal em assinaturas e identifique serviços que você já não usa tanto.',
      },
    ],
  },
  '/upcoming': {
    title: 'Próximos Meses',
    steps: [
      {
        icon: CalendarRange,
        title: 'Projeção Financeira',
        description: 'Veja uma estimativa dos gastos para os próximos meses com base nos gastos fixos cadastrados e histórico.',
      },
    ],
  },
  '/settings': {
    title: 'Configurações',
    steps: [
      {
        icon: Smartphone,
        title: 'Vincule seu Telegram',
        description: 'Copie seu ID único e envie para o bot no Telegram. Assim você lança transações por mensagem, sem abrir o app!',
      },
      {
        icon: Settings,
        title: 'Gerencie sua Conta',
        description: 'Aqui você encontra configurações de perfil, plano de assinatura e opções avançadas como reset de dados.',
      },
    ],
  },
};

// Rotas sem autenticação (renderizadas sem o chrome do app)
const PUBLIC_ROUTES = ['/login', '/', '/terms'];
// Rotas que exigem login mas NÃO o chrome do app nem assinatura ativa
const AUTH_NO_CHROME_ROUTES = ['/paywall', '/checkout/success'];

const TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transações',
  '/budgets': 'Orçamentos',
  '/recurring': 'Gastos Fixos',
  '/upcoming': 'Próximos Meses',
  '/investments': 'Investimentos',
  '/banks': 'Importar Extrato',
  '/subscriptions': 'Assinaturas',
  '/settings': 'Configurações',
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const currentTutorial = TUTORIALS[pathname];

  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const isAuthNoChrome = AUTH_NO_CHROME_ROUTES.includes(pathname);
  const needsPlan = !isPublic && !isAuthNoChrome; // somente as rotas do app
  const title = TITLES[pathname] ?? 'PorquIA';

  // Gate de assinatura: estados para as rotas do app
  const [planChecked, setPlanChecked] = useState(false);
  const [planActive, setPlanActive] = useState(false);

  useEffect(() => {
    if (!loading && !user && !isPublic) {
      router.replace('/login');
    }
  }, [user, loading, isPublic, router]);

  // Verifica assinatura ativa nas rotas do app; sem plano → paywall
  useEffect(() => {
    if (loading || !user || !needsPlan) return;
    let cancelled = false;
    api
      .getBillingStatus()
      .then((s) => {
        if (cancelled) return;
        setPlanChecked(true);
        setPlanActive(s.active);
        if (!s.active) router.replace('/paywall');
      })
      .catch(() => {
        if (cancelled) return;
        setPlanChecked(true);
        router.replace('/paywall');
      });
    return () => { cancelled = true; };
  }, [user, loading, needsPlan, pathname, router]);

  // Fecha o drawer ao trocar de rota; reseta tutorial ao navegar
  useEffect(() => {
    setDrawerOpen(false);
    setTutorialOpen(false);
  }, [pathname]);

  // Auto-abre tutorial na primeira visita à página
  useEffect(() => {
    if (!currentTutorial || !planActive) return;
    const seen = localStorage.getItem(`porquia_tutorial_${pathname}`);
    if (seen) return;
    const t = setTimeout(() => setTutorialOpen(true), 700);
    return () => clearTimeout(t);
  }, [pathname, planActive, currentTutorial]);

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

  // Rotas autenticadas sem chrome (paywall, checkout): renderiza direto
  if (isAuthNoChrome) return <>{children}</>;

  // Rotas do app: aguarda confirmação de assinatura ativa
  if (!planChecked || !planActive) {
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

          {currentTutorial && (
            <button
              onClick={() => setTutorialOpen(true)}
              title="Ver tutorial desta página"
              className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 hover:bg-pink-100 hover:text-pink-600 dark:hover:bg-pink-900/30 dark:hover:text-pink-400 transition-colors text-xs font-bold shrink-0"
            >
              ?
            </button>
          )}

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

          <NotificationsBell />

          <div className="p-0.5 rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500 shrink-0">
            <span className="block rounded-full ring-2 ring-gray-50 dark:ring-zinc-950">
              <UserAvatar user={user} size={34} />
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-6">{children}</main>
      </div>

      <BetaNotice />

      {currentTutorial && (
        <TutorialModal
          pageKey={pathname}
          pageTitle={currentTutorial.title}
          steps={currentTutorial.steps}
          isOpen={tutorialOpen}
          onClose={() => setTutorialOpen(false)}
        />
      )}
    </div>
  );
}
