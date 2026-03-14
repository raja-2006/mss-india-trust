import { createContext, useContext, useEffect, useState } from "react";
import type { Lang } from "../translations";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function getInitialLang(): Lang {
  const stored = localStorage.getItem("mss_lang");
  if (stored === "hi" || stored === "en") return stored;
  const nav = navigator.language || "";
  if (nav.startsWith("hi")) return "hi";
  return "en";
}

export function useLangState() {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  useEffect(() => {
    localStorage.setItem("mss_lang", lang);
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);

  return { lang, setLang };
}
