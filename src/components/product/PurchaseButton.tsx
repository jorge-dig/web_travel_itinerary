"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrency } from "@/lib/currency-context";
import { formatPrice } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Tag, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

interface PurchaseButtonProps {
  product: {
    id: string;
    title: string;
    price: number;
    type: string;
  };
  existingPurchaseId: string | null;
  session: { user?: { id?: string } } | null;
}

export function PurchaseButton({ product, existingPurchaseId, session }: PurchaseButtonProps) {
  const t = useTranslations("product");
  const { currency, rate } = useCurrency();
  const router = useRouter();

  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountInfo, setDiscountInfo] = useState<{ type: string; value: number } | null>(null);
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");

  const basePrice = product.price;
  const displayPrice = Math.round(basePrice * rate);

  async function applyDiscount() {
    if (!discountCode.trim()) return;
    setApplyingDiscount(true);
    setError("");
    try {
      const res = await fetch("/api/discounts/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: discountCode }),
      });
      const data = await res.json();
      if (res.ok) {
        setDiscountApplied(true);
        setDiscountInfo(data);
      } else {
        setError(data.error || "Código no válido");
      }
    } finally {
      setApplyingDiscount(false);
    }
  }

  async function handlePurchase() {
    if (!session) {
      router.push(`/login?next=/itineraries/${product.id}`);
      return;
    }
    setCheckingOut(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          discountCode: discountApplied ? discountCode : undefined,
          currency,
        }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Error al procesar el pago");
      }
    } finally {
      setCheckingOut(false);
    }
  }

  if (existingPurchaseId) {
    return (
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-emerald-600">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Ya tienes este itinerario</span>
        </div>
        <Link href={`/viewer/${existingPurchaseId}`}>
          <Button className="w-full" variant="warm">
            Ver itinerario
          </Button>
        </Link>
      </div>
    );
  }

  let finalPrice = displayPrice;
  if (discountApplied && discountInfo) {
    if (discountInfo.type === "PERCENTAGE") {
      finalPrice = Math.round(displayPrice * (1 - discountInfo.value / 100));
    } else {
      finalPrice = Math.max(0, displayPrice - Math.round(discountInfo.value * rate));
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        {discountApplied && finalPrice !== displayPrice ? (
          <div>
            <span className="text-lg line-through text-stone-400 mr-2">
              {formatPrice(displayPrice, currency)}
            </span>
            <span className="text-3xl font-bold text-stone-800">
              {formatPrice(finalPrice, currency)}
            </span>
          </div>
        ) : (
          <span className="text-3xl font-bold text-stone-800">
            {formatPrice(displayPrice, currency)}
          </span>
        )}
      </div>

      <Button
        className="w-full"
        size="lg"
        variant="warm"
        onClick={handlePurchase}
        disabled={checkingOut}
      >
        {checkingOut ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Procesando...</>
        ) : (
          t(product.type === "CONSULTING" ? "buyConsulting" : "buy")
        )}
      </Button>

      {/* Discount code */}
      <div className="pt-2 border-t border-stone-100">
        <p className="text-xs text-stone-500 mb-2 flex items-center gap-1">
          <Tag className="h-3 w-3" />
          {t("discount")}
        </p>
        <div className="flex gap-2">
          <Input
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
            placeholder="CÓDIGO"
            className="text-sm uppercase"
            disabled={discountApplied}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={applyDiscount}
            disabled={applyingDiscount || discountApplied}
            className="flex-shrink-0"
          >
            {applyingDiscount ? <Loader2 className="h-3 w-3 animate-spin" /> : t("apply")}
          </Button>
        </div>
        {discountApplied && (
          <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Descuento aplicado
          </p>
        )}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>

      <p className="text-xs text-stone-400 text-center">Pago seguro con Stripe</p>
    </div>
  );
}
