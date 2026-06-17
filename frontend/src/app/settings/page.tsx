'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useProfile } from '@/lib/profile-context';
import { api } from '@/lib/api';
import { Send, LogOut, CheckCircle2, XCircle } from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { refresh: refreshProfile } = useProfile();
  const [telegramId, setTelegramId] = useState('');
  const [linking, setLinking] = useState(false);
  const [linkedChatId, setLinkedChatId] = useState<string | null>(null);
  const [modal, setModal] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    api.getUserProfile().then(p => { if (p.telegram_chat_id) setLinkedChatId(p.telegram_chat_id); }).catch(() => {});
  }, []);

  async function handleLink(e: React.FormEvent) {
    e.preventDefault();
    setLinking(true);
    try {
      const id = telegramId.trim();
      await api.linkTelegram(id);
      setLinkedChatId(id);
      setTelegramId('');
      await refreshProfile();
      setModal({ type: 'success', message: 'Telegram conectado com sucesso! Agora é só mandar seus gastos pelo bot. 🎉' });
    } catch (err) {
      setModal({ type: 'error', message: err instanceof Error ? err.message : 'Não foi possível vincular o Telegram.' });
    } finally {
      setLinking(false);
    }
  }

  return (
    <div className="min-h-screen px-6 lg:px-10 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200/50 dark:border-slate-700/50 pb-8">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-2">Configurações</h1>
          <p className="text-slate-600 dark:text-slate-400 text-base">Gerencie sua conta e integrações</p>
        </div>

        {/* Perfil */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 shadow-sm dark:shadow-lg dark:shadow-black/20 border border-slate-200/50 dark:border-slate-700/50">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Perfil</h3>
          {user && (
            <div className="flex items-center gap-5">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-16 h-16 rounded-xl object-cover ring-2 ring-blue-400/20" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {(user.displayName || '?')[0].toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-base">{user.displayName || 'Usuário'}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                <span className="inline-block mt-2 text-xs font-bold bg-blue-100/70 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full">Google</span>
              </div>
            </div>
          )}
        </div>

        {/* Telegram */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 shadow-sm dark:shadow-lg dark:shadow-black/20 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Telegram</h3>
            {linkedChatId && <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full">Conectado</span>}
          </div>

          {linkedChatId ? (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 text-sm text-emerald-700 dark:text-emerald-400 font-medium border border-emerald-200/50 dark:border-emerald-900/50">
              Chat ID: <code className="font-mono text-xs ml-1">{linkedChatId}</code>
            </div>
          ) : (
            <form onSubmit={handleLink} className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Envie <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-xs">/start</code> para <strong>@PorquIABot</strong> no Telegram
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={telegramId}
                  onChange={(e) => setTelegramId(e.target.value)}
                  placeholder="Cole seu Chat ID..."
                  className="flex-1 px-4 py-3 border border-slate-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-700/30 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm backdrop-blur-sm"
                  disabled={linking}
                />
                <button
                  type="submit"
                  disabled={linking || !telegramId.trim()}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white disabled:text-slate-400 rounded-xl font-bold transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {linking ? '...' : 'Conectar'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full px-6 py-4 bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 font-bold rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-all flex items-center justify-center gap-2 text-base"
        >
          <LogOut className="w-5 h-5" />
          Sair da Conta
        </button>
      </div>

      {/* Popup de sucesso / erro */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up"
          onClick={() => setModal(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-900 p-8 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5 ${
                modal.type === 'success'
                  ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500'
                  : 'bg-rose-100 dark:bg-rose-950/40 text-rose-500'
              }`}
            >
              {modal.type === 'success' ? (
                <CheckCircle2 className="w-9 h-9" />
              ) : (
                <XCircle className="w-9 h-9" />
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {modal.type === 'success' ? 'Tudo certo!' : 'Ops...'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{modal.message}</p>
            <button
              onClick={() => setModal(null)}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all active:scale-[0.98] ${
                modal.type === 'success'
                  ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 shadow-lg shadow-pink-600/30'
                  : 'bg-gradient-to-r from-rose-500 to-red-500 shadow-lg shadow-red-500/30'
              }`}
            >
              {modal.type === 'success' ? 'Continuar' : 'Entendi'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
