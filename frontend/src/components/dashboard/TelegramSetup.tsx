'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { X, MessageCircle, ArrowRight, Zap } from 'lucide-react';

export function TelegramSetup() {
  const [isLinked, setIsLinked] = useState<boolean | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    api.getUserProfile()
      .then((p) => setIsLinked(!!p.telegram_chat_id))
      .catch(() => setIsLinked(false));
  }, []);

  if (isLinked === null || isLinked || dismissed) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-3xl p-7 lg:p-8 bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500 text-white shadow-[0_30px_60px_-20px_rgba(236,72,153,0.8)] animate-fade-in-up border-2 border-pink-300/60">
      {/* Brilhos animados no fundo */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/30 rounded-full blur-3xl pointer-events-none animate-blob" />
      <div className="absolute -bottom-12 -left-20 w-72 h-72 bg-rose-200/30 rounded-full blur-3xl pointer-events-none animate-blob" style={{ animationDelay: '2s' }} />

      <div className="relative">
        {/* Ícone + título com destaque */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-white/40 rounded-2xl blur-lg" />
            <div className="relative w-14 h-14 rounded-2xl bg-white/95 backdrop-blur grid place-items-center">
              <MessageCircle className="w-7 h-7 text-fuchsia-600" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black tracking-tight leading-tight">
              Conecte ao Telegram!
            </h3>
            <p className="text-sm text-white/90 font-semibold">Registre gastos por mensagens em 30 segundos</p>
          </div>
          <Zap className="w-8 h-8 ml-auto animate-pulse" strokeWidth={2.5} />
        </div>

        {/* Seção de instruções com fundo destaque */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 mb-5 border border-white/20">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold text-sm shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="font-bold text-base">Abra o Telegram</p>
                <p className="text-sm text-white/85">Procure por <code className="bg-white/20 px-2.5 py-1 rounded font-mono font-bold">@PorquIABot</code></p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold text-sm shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="font-bold text-base">Mande /start</p>
                <p className="text-sm text-white/85">O bot vai responder com seu <strong>Chat ID</strong></p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold text-sm shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="font-bold text-base">Cole o Chat ID aqui</p>
                <p className="text-sm text-white/85">Clique em "Conectar agora" abaixo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Exemplo de uso */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-5 border border-white/20">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/75 mb-2">Exemplos de uso:</p>
          <div className="space-y-1.5 text-sm">
            <p className="text-white/90">"gastei 50 no mercado"</p>
            <p className="text-white/90">"recebi 2000 de freela"</p>
            <p className="text-white/90">"almoço 30 reais"</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex-1">
            <p className="text-xs text-white/75 font-medium">Fácil · Rápido · Inteligente</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setDismissed(true)}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all border border-white/20"
              title="Fechar"
            >
              Depois
            </button>
            <Link
              href="/settings"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3 bg-white text-fuchsia-600 font-black text-sm rounded-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 transition-all"
            >
              <Zap className="w-5 h-5" strokeWidth={3} />
              Conectar Agora
              <ArrowRight className="w-5 h-5" strokeWidth={3} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
