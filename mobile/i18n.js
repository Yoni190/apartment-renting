import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import * as SecureStore from 'expo-secure-store';
import { I18nManager } from 'react-native';

import en from './translations/en.json';
import am from './translations/am.json';

const LANGUAGE_KEY = 'appLanguage';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (cb) => {
    try {
      // 1. Check saved language
      const savedLang = await SecureStore.getItemAsync(LANGUAGE_KEY);
      if (savedLang) {
        cb(savedLang);
        return;
      }

      // 2. Detect device language
      let deviceLang = 'en';
      const locales = RNLocalize.getLocales();
      if (Array.isArray(locales) && locales.length > 0) {
        const firstLang = locales[0].languageCode;
        if (firstLang === 'am') deviceLang = 'am';
      }

      // 3. Call the callback
      cb(deviceLang);

      // 4. Cache for next time
      await SecureStore.setItemAsync(LANGUAGE_KEY, deviceLang);
    } catch (e) {
      cb('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (lang) => {
    await SecureStore.setItemAsync(LANGUAGE_KEY, lang);
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: { en: { translation: en }, am: { translation: am } },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

export default i18n;
