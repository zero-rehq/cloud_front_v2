import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import es from './locales/es.json';
import ca from './locales/ca.json';
import fr from './locales/fr.json';
import it from './locales/it.json';
import de from './locales/de.json';
import zh from './locales/zh.json';
import tw from './locales/tw.json';

export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', flag: '🇬🇧' },
  es: { name: 'Español', flag: '🇪🇸' },
  ca: { name: 'Català', flag: '🇪🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  zh: { name: '中文', flag: '🇨🇳' },
  tw: { name: '台灣語', flag: '🇹🇼' },
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

const savedLanguage = localStorage.getItem('language') as SupportedLanguage;
const defaultLanguage: SupportedLanguage = savedLanguage || 'es';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    ca: { translation: ca },
    fr: { translation: fr },
    it: { translation: it },
    de: { translation: de },
    zh: { translation: zh },
    tw: { translation: tw },
  },
  lng: defaultLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
