export type SupportedLanguage = "ar" | "en" | "tr" | "fr";

export const defaultLanguage: SupportedLanguage = "ar";

export const supportedLanguages: SupportedLanguage[] = ["ar", "en", "tr", "fr"];

export const languageNames: Record<SupportedLanguage, string> = {
  ar: "العربية",
  en: "English",
  tr: "Türkçe",
  fr: "Français",
};

export const rtlLanguages: SupportedLanguage[] = ["ar"];

export function isRTL(lang: SupportedLanguage): boolean {
  return rtlLanguages.includes(lang);
}

export function getLanguageFromHeader(acceptLanguage?: string | null): SupportedLanguage {
  if (!acceptLanguage) return defaultLanguage;

  const languages = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].trim().toLowerCase());

  for (const lang of languages) {
    if (lang.startsWith("ar")) return "ar";
    if (lang.startsWith("tr")) return "tr";
    if (lang.startsWith("fr")) return "fr";
    if (lang.startsWith("en")) return "en";
  }

  return defaultLanguage;
}

