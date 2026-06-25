'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export interface TutorialStep {
  icon: string;
  title: string;
  description: string;
}

interface TutorialModalProps {
  pageKey: string;
  pageTitle: string;
  steps: TutorialStep[];
  isOpen: boolean;
  onClose: () => void;
}

export function TutorialModal({ pageKey, pageTitle, steps, isOpen, onClose }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) setCurrentStep(0);
  }, [isOpen]);

  if (!isOpen || steps.length === 0) return null;

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  const handleClose = () => {
    localStorage.setItem(`porquia_tutorial_${pageKey}`, '1');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500" />

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 pt-5 px-6">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`rounded-full transition-all duration-300 ${
                i === currentStep
                  ? 'w-6 h-2 bg-pink-500'
                  : i < currentStep
                  ? 'w-2 h-2 bg-pink-300 dark:bg-pink-700'
                  : 'w-2 h-2 bg-slate-200 dark:bg-zinc-700'
              }`}
            />
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Fechar tutorial"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="px-6 pt-4 pb-2">
          <p className="text-xs font-bold text-pink-500 uppercase tracking-wider mb-4">
            Tutorial — {pageTitle}
          </p>

          <div className="flex flex-col items-center text-center gap-3 min-h-[150px]">
            <span className="text-5xl leading-none">{step.icon}</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{step.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {step.description}
            </p>
          </div>

          <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-3">
            {currentStep + 1} de {steps.length}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 px-6 pb-6 pt-3">
          <button
            onClick={() => setCurrentStep((s) => s - 1)}
            disabled={currentStep === 0}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {isLast ? (
            <button
              onClick={handleClose}
              className="flex-1 h-10 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <Check className="w-4 h-4" />
              Entendido!
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep((s) => s + 1)}
              className="flex-1 h-10 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
