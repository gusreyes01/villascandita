"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { es as dateFnsEs } from "date-fns/locale";
import { enUS as dateFnsEn } from "date-fns/locale";
import { Locale } from "date-fns";
import { Lang, Translations, translations } from "@/i18n/translations";

interface LanguageContextValue {
  lang: Lang;
  t: Translations;
  dateLocale: Locale;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "es",
  t: translations.es,
  dateLocale: dateFnsEs,
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");

  useEffect(() => {
    const stored = localStorage.getItem("vc-lang") as Lang | null;
    if (stored === "en" || stored === "es") {
      setLang(stored);
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next: Lang = prev === "es" ? "en" : "es";
      localStorage.setItem("vc-lang", next);
      return next;
    });
  }, []);

  const value: LanguageContextValue = {
    lang,
    t: translations[lang],
    dateLocale: lang === "es" ? dateFnsEs : dateFnsEn,
    toggleLang,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
