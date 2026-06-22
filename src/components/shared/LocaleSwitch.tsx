"use client";

import { useTranslations } from "next-intl";
import { setLocaleCookie } from "@/lib/locale-actions";

export function LocaleSwitch() {
  const t = useTranslations("language");

  async function handleSwitch(locale: string) {
    await setLocaleCookie(locale);
    window.location.reload();
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => handleSwitch("es")}
        className="text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors"
      >
        ES
      </button>
      <span className="text-stone-300 text-xs">|</span>
      <button
        onClick={() => handleSwitch("en")}
        className="text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors"
      >
        EN
      </button>
    </div>
  );
}
