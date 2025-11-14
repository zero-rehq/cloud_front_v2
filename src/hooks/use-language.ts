import { useTranslation } from 'react-i18next';
import type { SupportedLanguage } from '@/i18n';

export function useLanguage() {
  const { i18n } = useTranslation();

  const setLanguage = (lng: SupportedLanguage) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const currentLanguage = i18n.language as SupportedLanguage;

  return {
    currentLanguage,
    setLanguage,
  };
}
