'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Send, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [telegramId, setTelegramId] = useState('');
  const [linking, setLinking] = useState(false);
  const [linkedChatId, setLinkedChatId] = useState<string | null>(null);

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
    } catch (err) {
      alert('Erro ao vincular');
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
    </div>
  );
}
