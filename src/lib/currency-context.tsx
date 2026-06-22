"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Currency = "EUR" | "USD";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rate: number;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "EUR",
  setCurrency: () => {},
  rate: 1,
});

export function CurrencyProvider({
  children,
  defaultCurrency = "EUR",
  usdRate = 1.08,
}: {
  children: ReactNode;
  defaultCurrency?: Currency;
  usdRate?: number;
}) {
  const [currency, setCurrencyState] = useState<Currency>(defaultCurrency);

  useEffect(() => {
    const saved = localStorage.getItem("currency") as Currency | null;
    if (saved === "EUR" || saved === "USD") setCurrencyState(saved);
  }, []);

  function setCurrency(c: Currency) {
    setCurrencyState(c);
    localStorage.setItem("currency", c);
  }

  const rate = currency === "USD" ? usdRate : 1;

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rate }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
