'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check, LucideIcon } from 'lucide-react';

export interface TutorialStep {
  icon: LucideIcon;
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
  const StepIcon = step.icon;
  const isLast = currentStep === steps.length - 1;

  const handleClose = () => {
    localStorage.setItem(`porquia_tutorial_${pageKey}`, '1');
    onClose();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] w-80 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <p className="text-xs font-bold text-pink-500 uppercase tracking-wider">
          Tutorial — {pageTitle}
        </p>
        <button
          onClick={handleClose}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Fechar tutorial"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 pb-3 px-4">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={`rounded-full transition-all duration-300 ${
              i === currentStep
                ? 'w-5 h-1.5 bg-pink-500'
                : i < currentStep
                ? 'w-1.5 h-1.5 bg-pink-300 dark:bg-pink-700'
                : 'w-1.5 h-1.5 bg-slate-200 dark:bg-zinc-700'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="px-4 pb-3 flex gap-3 items-start">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center shrink-0">
          <StepIcon className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{step.title}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 px-4 pb-4 pt-1">
        <button
          onClick={() => setCurrentStep((s) => s - 1)}
          disabled={currentStep === 0}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <span className="flex items-center text-xs text-slate-400 dark:text-slate-600 px-1">
          {currentStep + 1}/{steps.length}
        </span>

        {isLast ? (
          <button
            onClick={handleClose}
            className="flex-1 h-8 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 text-white font-semibold text-xs hover:opacity-90 transition-opacity"
          >
            <Check className="w-3.5 h-3.5" />
            Entendido!
          </button>
        ) : (
          <button
            onClick={() => setCurrentStep((s) => s + 1)}
            className="flex-1 h-8 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 text-white font-semibold text-xs hover:opacity-90 transition-opacity"
          >
            Próximo
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
