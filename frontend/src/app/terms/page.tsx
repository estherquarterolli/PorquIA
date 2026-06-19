'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-slate-800 dark:text-slate-200">
      <div className="max-w-3xl mx-auto px-5 py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-pink-600 dark:text-slate-400 dark:hover:text-pink-400 mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Termos de Serviço</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Última atualização: 18 de junho de 2026</p>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Aceitação dos termos</h2>
            <p>
              Ao usar o PorquIA (&quot;serviço&quot;), você concorda com estes Termos de Serviço. O PorquIA é um
              rastreador financeiro pessoal que ajuda você a registrar e organizar suas finanças por meio
              de um bot do Telegram e de um painel web. Se você não concorda com estes termos, não utilize o serviço.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. Uso do serviço</h2>
            <p>
              O PorquIA é fornecido para uso pessoal e não comercial. Você é responsável por manter a
              confidencialidade da sua conta e por todas as atividades realizadas nela. Você concorda em
              fornecer informações verdadeiras e em não usar o serviço para fins ilícitos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. Dados financeiros e privacidade</h2>
            <p>
              Os dados que você registra (transações, orçamentos, gastos fixos) são armazenados de forma
              segura e usados apenas para fornecer as funcionalidades do serviço. Ao importar extratos
              (OFX/CSV) ou conectar contas, os dados são processados exclusivamente para exibir suas
              informações financeiras. Não vendemos seus dados a terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">4. Conexões bancárias</h2>
            <p>
              Conexões com bancos e a importação de extratos são oferecidas como conveniência. O PorquIA
              não se responsabiliza por indisponibilidades, mudanças nas políticas dos bancos ou
              divergências nos dados importados. Nunca compartilhe credenciais que você não confie em
              fornecer; recomendamos o uso de importação de arquivos (OFX/CSV) sempre que possível.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">5. Isenção de aconselhamento financeiro</h2>
            <p>
              O PorquIA é uma ferramenta de organização. As informações, gráficos e projeções exibidos
              não constituem aconselhamento financeiro, contábil ou de investimento. Decisões financeiras
              são de sua inteira responsabilidade.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">6. Limitação de responsabilidade</h2>
            <p>
              O serviço é fornecido &quot;como está&quot;, sem garantias. Na máxima extensão permitida por lei, o
              PorquIA não se responsabiliza por perdas ou danos decorrentes do uso ou da impossibilidade
              de uso do serviço.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">7. Alterações</h2>
            <p>
              Podemos atualizar estes termos periodicamente. Mudanças significativas serão comunicadas no
              serviço. O uso contínuo após as alterações implica concordância com os novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">8. Contato</h2>
            <p>
              Dúvidas sobre estes termos? Fale com a gente pelo bot{' '}
              <strong>@porquia_bot</strong> no Telegram.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
