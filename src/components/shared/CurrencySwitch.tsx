"use client";

import { useRouter } from "next/navigation";
import { useCurrency } from "@/lib/currency-context";
import { useTranslations } from "next-intl";

export function CurrencySwitch() {
  const t = useTranslations("currency");
  const { currency, setCurrency } = useCurrency();

  return (
    <button
      onClick={() => setCurrency(currency === "EUR" ? "USD" : "EUR")}
      className="text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors px-2 py-1 rounded-full border border-stone-200 hover:border-stone-400"
    >
      {currency === "EUR" ? t("eur") : t("usd")}
    </button>
  );
}
