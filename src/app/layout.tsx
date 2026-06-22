import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { SessionProvider } from "next-auth/react";
import { CurrencyProvider } from "@/lib/currency-context";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Wayroute — Itinerarios de viaje",
  description: "Itinerarios de viaje detallados y consultoría personalizada para vivir cada destino con profundidad.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  const session = await auth();

  let usdRate = 1.08;
  try {
    const rate = await prisma.exchangeRate.findUnique({
      where: { fromCurrency_toCurrency: { fromCurrency: "EUR", toCurrency: "USD" } },
    });
    if (rate) usdRate = rate.rate;
  } catch {}

  return (
    <html lang={locale} className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900">
        <SessionProvider session={session}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <CurrencyProvider usdRate={usdRate}>
              {children}
            </CurrencyProvider>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
