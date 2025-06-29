// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import file terjemahan Anda
import translationEN from './translations/en/common.json';
import translationID from './translations/id/common.json';

i18n
  // Mendeteksi bahasa browser pengguna
  .use(LanguageDetector)
  // Meneruskan instance i18n ke react-i18next
  .use(initReactI18next)
  // Inisialisasi i18next
  .init({
    debug: true, // Set ke false di produksi
    fallbackLng: 'id', // Bahasa default jika bahasa browser tidak tersedia
    interpolation: {
      escapeValue: false, // React sudah aman dari XSS
    },
    resources: {
      en: {
        common: translationEN // namespace 'common' untuk bahasa inggris
      },
      id: {
        common: translationID // namespace 'common' untuk bahasa indonesia
      }
    }
  });

export default i18n;