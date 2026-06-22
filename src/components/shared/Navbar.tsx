"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Menu, X, Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CurrencySwitch } from "./CurrencySwitch";
import { LocaleSwitch } from "./LocaleSwitch";
import { signOut } from "next-auth/react";

interface NavbarProps {
  session: { user?: { name?: string | null; role?: string } } | null;
}

export function Navbar({ session }: NavbarProps) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b border-stone-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-stone-800">
          <MapPin className="h-5 w-5 text-amber-600" />
          <span className="text-lg tracking-tight">Wayroute</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/itineraries" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
            {t("itineraries")}
          </Link>
          <Link href="/consulting" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
            {t("consulting")}
          </Link>
          <LocaleSwitch />
          <CurrencySwitch />
          {session ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">{t("dashboard")}</Button>
              </Link>
              {session.user?.role === "ADMIN" && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">{t("admin")}</Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                {t("logout")}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">{t("login")}</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">{t("register")}</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-stone-100 bg-white px-4 pb-4 space-y-1">
          <Link href="/itineraries" className="block py-2.5 text-sm text-stone-700" onClick={() => setOpen(false)}>
            {t("itineraries")}
          </Link>
          <Link href="/consulting" className="block py-2.5 text-sm text-stone-700" onClick={() => setOpen(false)}>
            {t("consulting")}
          </Link>
          <div className="flex items-center gap-3 py-2">
            <LocaleSwitch />
            <CurrencySwitch />
          </div>
          {session ? (
            <>
              <Link href="/dashboard" className="block py-2.5 text-sm text-stone-700" onClick={() => setOpen(false)}>
                {t("dashboard")}
              </Link>
              {session.user?.role === "ADMIN" && (
                <Link href="/admin" className="block py-2.5 text-sm text-stone-700" onClick={() => setOpen(false)}>
                  {t("admin")}
                </Link>
              )}
              <button
                className="block py-2.5 text-sm text-stone-700 w-full text-left"
                onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">{t("login")}</Button>
              </Link>
              <Link href="/register" onClick={() => setOpen(false)}>
                <Button size="sm" className="w-full">{t("register")}</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
