"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/lib/currency-context";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    title: string;
    price: number;
    coverImageUrl?: string | null;
    itinerary?: { destination: string; durationDays: number } | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { currency, rate } = useCurrency();

  return (
    <Link href={`/itineraries/${product.slug}`} className="group block">
      <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-stone-100 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
        <div className="aspect-[4/3] relative bg-stone-100 overflow-hidden">
          {product.coverImageUrl ? (
            <Image
              src={product.coverImageUrl}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="h-12 w-12 text-stone-300" />
            </div>
          )}
        </div>
        <div className="p-4">
          {product.itinerary && (
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-1 text-xs text-stone-500">
                <MapPin className="h-3 w-3" />
                {product.itinerary.destination}
              </div>
              <div className="flex items-center gap-1 text-xs text-stone-500">
                <Clock className="h-3 w-3" />
                {product.itinerary.durationDays} días
              </div>
            </div>
          )}
          <h3 className="font-semibold text-stone-800 mb-3 group-hover:text-amber-700 transition-colors line-clamp-2">
            {product.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-stone-900">
              {formatPrice(Math.round(product.price * rate), currency)}
            </span>
            <Badge variant="secondary" className="text-xs">Itinerario</Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}
