import i18n from "i18next";
import { cloneDeep } from "lodash";
import { initReactI18next } from "react-i18next";
import de from "./locales/de.json";
import en from "./locales/en.json";

export const FALLBACK_LANGUAGE = "en";
const LANGUAGE_STORAGE_KEY = "app_language";

export interface Language {
  locale: string;
  name: string;
  icon: JSX.Element;
}

const getBrowserLanguage = () => {
  // @ts-ignore
  const userLang = navigator.language || navigator.userLanguage;

  return userLang ? userLang.split("-")[0] : FALLBACK_LANGUAGE;
};

const browserLanguage = getBrowserLanguage();

export const defaultTranslationModules = [
  { locale: "de", texts: de },
  { locale: "en", texts: en }
];
export const defaultLanguages = defaultTranslationModules.map((m) => m.locale);

const getStoredLanguage = () => {
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return storedLanguage && defaultLanguages.includes(storedLanguage)
    ? storedLanguage
    : undefined;
};

const getInitialLanguage = () => {
  const storedLanguage = getStoredLanguage();
  if (storedLanguage) {
    return storedLanguage;
  }

  return defaultLanguages.includes(browserLanguage)
    ? browserLanguage
    : FALLBACK_LANGUAGE;
};

const resources = cloneDeep(
  Object.fromEntries(
    defaultTranslationModules.map((m) => [m.locale, { app: m.texts }])
  )
);

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)

  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    ns: ["common", "app"],
    defaultNS: "app",
    lng: getInitialLanguage(),
    fallbackLng: FALLBACK_LANGUAGE,
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  });

i18n.on("languageChanged", (language) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }
});

export default i18n;
