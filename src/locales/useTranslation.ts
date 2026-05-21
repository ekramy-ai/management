import { useUIStore } from '../store/uiStore';
import { en, TranslationKey } from './en';
import { ar } from './ar';

export const useTranslation = () => {
  const language = useUIStore((state) => state.language);

  const t = (key: TranslationKey): string => {
    const dictionary = language === 'ar' ? ar : en;
    return dictionary[key] || en[key] || String(key);
  };

  return { t, language, isRtl: language === 'ar' };
};
