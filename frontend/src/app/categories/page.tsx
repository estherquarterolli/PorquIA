'use client';

import { useState, useEffect } from 'react';
import { DEFAULT_CATEGORIES, getCustomCategories, saveCustomCategories } from '@/lib/categories';
import { Tag, Plus, Pencil, Trash2, X, Check, Lock } from 'lucide-react';

export default function CategoriesPage() {
  const [custom, setCustom] = useState<string[]>([]);
  const [newName, setNewName] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setCustom(getCustomCategories());
  }, []);

  function flash(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim().toLowerCase();
    if (!name) return;
    if (DEFAULT_CATEGORIES.includes(name) || custom.includes(name)) {
      setError('Essa categoria já existe.');
      return;
    }
    setError(null);
    const updated = [...custom, name];
    setCustom(updated);
    saveCustomCategories(updated);
    setNewName('');
    flash(`Categoria "${name}" criada.`);
  }

  function startEdit(index: number) {
    setEditingIndex(index);
    setEditingValue(custom[index]);
    setError(null);
  }

  function saveEdit(index: number) {
    const name = editingValue.trim().toLowerCase();
    if (!name) { setError('Nome não pode ser vazio.'); return; }
    if (DEFAULT_CATEGORIES.includes(name) || custom.some((c, i) => c === name && i !== index)) {
      setError('Essa categoria já existe.');
      return;
    }
    setError(null);
    const updated = [...custom];
    updated[index] = name;
    setCustom(updated);
    saveCustomCategories(updated);
    setEditingIndex(null);
    flash(`Categoria atualizada para "${name}".`);
  }

  function confirmDelete(index: number) {
    const updated = custom.filter((_, i) => i !== index);
    setCustom(updated);
    saveCustomCategories(updated);
    setDeletingIndex(null);
    flash('Categoria removida.');
  }

  const totalCount = DEFAULT_CATEGORIES.length + custom.length;

  return (
    <div className="py-2">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-slate-200/50 dark:border-zinc-800 pb-5">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-1">Categorias</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{totalCount} categorias disponíveis para classificar suas transações</p>
        </div>

        {/* Add form */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-5 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4 text-fuchsia-500" />
            Nova categoria
          </h2>
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => { setNewName(e.target.value); setError(null); }}
              placeholder="Ex: pet shop, viagem, academia..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/40 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm"
            />
            <button
              type="submit"
              disabled={!newName.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              Criar
            </button>
          </form>
          {error && <p className="text-xs text-rose-500 mt-2">{error}</p>}
          {success && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mt-2">
              <Check className="w-3.5 h-3.5" />
              {success}
            </div>
          )}
        </div>

        {/* Custom categories */}
        {custom.length > 0 && (
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/60 dark:bg-slate-900/30">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Personalizadas ({custom.length})
              </p>
            </div>
            <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
              {custom.map((cat, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5 group">
                  <div className="w-8 h-8 rounded-lg bg-fuchsia-100 dark:bg-fuchsia-900/30 flex items-center justify-center shrink-0">
                    <Tag className="w-4 h-4 text-fuchsia-500" />
                  </div>

                  {editingIndex === i ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        autoFocus
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(i); if (e.key === 'Escape') setEditingIndex(null); }}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-fuchsia-300 dark:border-fuchsia-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm"
                      />
                      <button onClick={() => saveEdit(i)} className="p-1.5 text-emerald-500 hover:text-emerald-600 transition-colors">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingIndex(null)} className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200 capitalize">{cat}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(i)} className="p-1.5 text-slate-400 hover:text-fuchsia-500 transition-colors" title="Renomear">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeletingIndex(i)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors" title="Excluir">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Default categories */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/60 dark:bg-slate-900/30 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Padrão ({DEFAULT_CATEGORIES.length})
            </p>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Lock className="w-3 h-3" />
              Não editáveis
            </div>
          </div>
          <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
            {DEFAULT_CATEGORIES.map((cat) => (
              <div key={cat} className="flex items-center gap-3 px-5 py-3.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center shrink-0">
                  <Tag className="w-4 h-4 text-slate-400" />
                </div>
                <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">{cat}</span>
                <Lock className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete confirm modal */}
      {deletingIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setDeletingIndex(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                <Trash2 className="w-7 h-7 text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Excluir categoria?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                A categoria <span className="font-semibold text-slate-700 dark:text-slate-200 capitalize">"{custom[deletingIndex]}"</span> será removida.
              </p>
              <p className="text-xs text-slate-400">Transações com essa categoria não serão afetadas.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeletingIndex(null)} className="flex-1 py-3 rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 transition-all">Cancelar</button>
              <button onClick={() => confirmDelete(deletingIndex)} className="flex-1 py-3 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 transition-all">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
