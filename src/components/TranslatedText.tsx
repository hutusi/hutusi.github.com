'use client';

import { useLanguage } from './LanguageProvider';
import { TranslationKey } from '@/i18n/translations';

interface TranslatedTextProps {
  translationKey: TranslationKey;
}

export default function TranslatedText({ translationKey }: TranslatedTextProps) {
  const { t } = useLanguage();
  return <>{t(translationKey)}</>;
}
