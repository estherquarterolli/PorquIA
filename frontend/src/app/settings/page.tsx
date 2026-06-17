'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/lib/auth-context';
import { Avatar } from '@/components/Avatar';
import { api } from '@/lib/api';
import { Send, LogOut, Sun, Moon, Check } from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [telegramId, setTelegramId] = useState('');
  const [linking, setLinking] = useState(false);
  const [linkedChatId, setLinkedChatId] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    api.getUserProfile().then(p => { if (p.telegram_chat_id) setLinkedChatId(p.telegram_chat_id); }).catch(() => {});
  }, []);

  async function handleLink(e: React.FormEvent) {
    e.preventDefault();
    setLinking(true);
    try {
      await api.linkTelegram(telegramId.trim());
      setLinkedChatId(telegramId.trim());
      setTelegramId('');
    } catch {
      alert('Erro ao vincular');
    } finally {
      setLinking(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">Configurações</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gerencie sua conta e integrações.</p>
      </div>

      {/* Perfil */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-900 dark:text-white mb-5">Perfil</h3>
        {user && (
          <div className="flex items-center gap-4">
            <Avatar src={user.photoURL} name={user.displayName || user.email || ''} size="lg" />
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{user.displayName || 'Usuário'}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
              <span className="inline-block mt-2 text-[11px] font-bold bg-brand-500/12 text-brand-600 dark:text-brand-300 px-2.5 py-1 rounded-full">Conta Google</span>
            </div>
          </div>
        )}
      </div>

      {/* Aparência */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Aparência</h3>
        {mounted && (
          <div className="grid grid-cols-2 gap-3">
            {([['light', 'Claro', Sun], ['dark', 'Escuro', Moon]] as const).map(([val, label, Icon]) => {
              const active = theme === val;
              return (
                <button
                  key={val}
                  onClick={() => setTheme(val)}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-2xl border transition-all ${
                    active
                      ? 'border-brand-400 bg-brand-50/70 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300'
                      : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-brand-300'
                  }`}
                >
                  <span className="flex items-center gap-2.5 font-semibold text-sm"><Icon className="w-4 h-4" /> {label}</span>
                  {active && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Telegram */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 dark:text-white">Telegram</h3>
          {linkedChatId && <span className="text-[11px] font-bold bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full">Conectado</span>}
        </div>

        {linkedChatId ? (
          <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl p-4 text-sm text-emerald-700 dark:text-emerald-400 font-medium border border-emerald-200/60 dark:border-emerald-500/20">
            Chat ID: <code className="font-mono text-xs ml-1">{linkedChatId}</code>
          </div>
        ) : (
          <form onSubmit={handleLink} className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Envie <code className="bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-xs">/start</code> para <strong>@PorquIABot</strong> no Telegram e cole seu Chat ID abaixo.
            </p>
            <div className="flex gap-2">
              <input type="text" value={telegramId} onChange={(e) => setTelegramId(e.target.value)} placeholder="Cole seu Chat ID…" className="field flex-1" disabled={linking} />
              <button type="submit" disabled={linking || !telegramId.trim()} className="btn-primary shrink-0">
                <Send className="w-4 h-4" /> {linking ? '…' : 'Conectar'}
              </button>
            </div>
          </form>
        )}
      </div>

      <button onClick={logout} className="w-full px-6 py-3.5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2">
        <LogOut className="w-5 h-5" /> Sair da conta
      </button>
    </div>
  );
}
