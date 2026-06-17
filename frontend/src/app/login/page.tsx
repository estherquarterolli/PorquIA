'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, TrendingUp, Bot, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const HIGHLIGHTS = [
  { Icon: Bot, title: 'IA que entende português', desc: 'Apenas mande uma mensagem no Telegram: “café 5 reais”. Pronto! Registrado.' },
  { Icon: TrendingUp, title: 'Painel inteligente', desc: 'Veja suas receitas, despesas, orçamentos e tendências em um só lugar.' },
  { Icon: ShieldCheck, title: 'Seguro e privado', desc: 'Autentique com Google. Seus dados são seus. Sem rastreamento.' },
];

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signInWithGoogle } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) router.push('/dashboard');
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch {
      setError('Erro ao fazer login. Tente novamente.');
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="w-9 h-9 rounded-full border-[3px] border-brand-500/25 border-t-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Painel lateral (desktop) — branding */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 brand-gradient text-white overflow-hidden">
        <div className="absolute -top-20 -right-16 w-80 h-80 bg-white/15 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-24 -left-10 w-96 h-96 bg-fuchsia-400/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: '3s' }} />

        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur grid place-items-center font-bold text-2xl">P</div>
          <span className="text-xl font-bold">PorquIA</span>
        </div>

        <div className="relative">
          <h2 className="text-4xl font-bold leading-tight tracking-tight">
            Suas finanças,<br />sem complicação.
          </h2>
          <p className="text-white/75 mt-4 max-w-sm">
            Mensagens no Telegram + IA inteligente = orçamento organizado. Simples assim.
          </p>

          <div className="mt-10 space-y-5">
            {HIGHLIGHTS.map(({ Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur grid place-items-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-white/70">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/55">© {new Date().getFullYear()} PorquIA · Finanças com IA</p>
      </div>

      {/* Painel de acesso */}
      <div className="relative flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Logo (mobile) */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="relative w-16 h-16 rounded-3xl brand-gradient grid place-items-center text-white font-bold text-3xl shadow-glow">
              P
              <Sparkles className="absolute -top-1.5 -right-1.5 w-5 h-5 text-fuchsia-300" />
            </div>
          </div>

          <div className="card p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bem-vindo ao PorquIA</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Seu asistente financeiro baseado em IA. Comece agora com um clique.
              </p>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-sm text-rose-600 dark:text-rose-400 text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={signingIn}
              className="w-full py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-brand-300 dark:hover:border-brand-500/40 hover:shadow-[0_8px_24px_-12px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-3 group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {signingIn ? (
                <div className="w-5 h-5 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
              ) : (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-100">
                {signingIn ? 'Entrando…' : 'Continuar com Google'}
              </span>
              {!signingIn && (
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all ml-auto" />
              )}
            </button>

            <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-7 leading-relaxed">
              Ao entrar, você concorda com nossos<br />
              termos de uso e política de privacidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
