import en from './locales/en.json';
import zh from './locales/zh.json';
import { useSelector } from 'react-redux';

const translations = { en, zh };

export function useT() {
  const language = useSelector((state) => state.language.language);
  return (key) => translations[language]?.[key] || translations.en[key] || key;
} 