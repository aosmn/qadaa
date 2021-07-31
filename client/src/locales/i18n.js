import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import auth_en from './en/auth.json';
import auth_ar from './ar/auth.json';
import home_en from './en/home.json';
import home_ar from './ar/home.json';
import tutorial_en from './en/tutorial.json';
import tutorial_ar from './ar/tutorial.json';
import landing_en from './en/landing.json';
import landing_ar from './ar/landing.json';

// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    },
    resources: {
      en: {
        auth: auth_en,
        home: home_en,
        tutorial: tutorial_en,
                landing: landing_en
      },
      ar: {
        auth: auth_ar,
        home: home_ar,
        tutorial: tutorial_ar,
                landing: landing_ar
      }
    }
  });

i18n.changeLanguage();

export default i18n;
