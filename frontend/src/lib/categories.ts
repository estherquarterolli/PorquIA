const STORAGE_KEY = 'porquia_custom_categories';

export const DEFAULT_CATEGORIES = [
  'alimentação', 'transporte', 'moradia', 'saúde', 'lazer',
  'educação', 'vestuário', 'serviços', 'investimento', 'outros',
];

export const INCOME_CATEGORIES = [
  'salário', 'freelance', 'aluguel recebido', 'investimento', 'presente', 'outros',
];

export function getCustomCategories(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveCustomCategories(cats: string[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
}

export function getAllCategories(): string[] {
  return [...DEFAULT_CATEGORIES, ...getCustomCategories()];
}
