'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Upload, FileText } from 'lucide-react';

export default function BanksPage() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMsg(null);
    try {
      const content = await file.text();
      const r = await api.importStatement(content, file.name);
      setMsg(`${r.imported} de ${r.found} transações importadas (${r.skipped} já existiam).`);
    } catch (err) {
      setMsg(`Erro: ${(err as Error).message}`);
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  }

  return (
    <div className="py-2">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-slate-200/50 dark:border-slate-700/50 pb-5">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-1">Importar Extrato</h1>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            Suba o extrato do seu banco e importe as transações automaticamente
          </p>
        </div>

        {/* Import de extrato OFX/CSV */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Arquivo OFX ou CSV</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Exporte o extrato no app do seu banco e suba aqui — sem senha, 100% seguro.
              </p>
            </div>
          </div>
          <label className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold cursor-pointer transition-colors disabled:opacity-50">
            <Upload className="w-4 h-4" />
            {busy ? 'Processando...' : 'Escolher arquivo .ofx ou .csv'}
            <input type="file" accept=".ofx,.csv,text/csv" onChange={handleFile} disabled={busy} className="hidden" />
          </label>
        </div>

        {msg && (
          <div className="rounded-xl px-4 py-3 bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
            {msg}
          </div>
        )}

        {/* Como exportar */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-slate-400" />
            <p className="font-bold text-slate-900 dark:text-white">Como exportar do seu banco</p>
          </div>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-5">
            <li><strong>Nubank:</strong> Conta → Histórico → exportar extrato em OFX/CSV.</li>
            <li><strong>Itaú / Bradesco / Santander:</strong> Extrato → exportar/baixar em OFX.</li>
            <li><strong>Inter / C6:</strong> Extrato → compartilhar/baixar em CSV ou OFX.</li>
            <li>Formatos aceitos: <strong>.ofx</strong> e <strong>.csv</strong> (data, descrição e valor).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
