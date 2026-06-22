import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { PurchaseButton } from "@/components/product/PurchaseButton";
import { MapPin, Clock, CheckCircle, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import type { ItineraryContent } from "@/types/itinerary";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return {};
  return {
    title: `${product.title} — Wayroute`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = await getTranslations("product");
  const session = await auth();

  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: { itinerary: true },
  });

  if (!product) notFound();

  const itinerary = product.itinerary?.content as ItineraryContent | null;

  // Check if already purchased
  let existingPurchase = null;
  if (session?.user?.id) {
    existingPurchase = await prisma.purchase.findFirst({
      where: {
        userId: (session.user as { id: string }).id,
        productId: product.id,
        status: "COMPLETED",
      },
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Cover image */}
      {product.coverImageUrl && (
        <div className="relative aspect-[16/7] rounded-2xl overflow-hidden mb-8">
          <Image src={product.coverImageUrl} alt={product.title} fill className="object-cover" priority />
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Main content */}
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">Itinerario</Badge>
            {product.itinerary && (
              <>
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {product.itinerary.destination}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {product.itinerary.durationDays} {t("days")}
                </Badge>
              </>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">{product.title}</h1>
          <p className="text-stone-600 leading-relaxed mb-8 text-lg">{product.description}</p>

          {/* Highlights */}
          {itinerary?.highlights && itinerary.highlights.length > 0 && (
            <div className="mb-8">
              <h2 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" />
                {t("highlights")}
              </h2>
              <ul className="space-y-2">
                {itinerary.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-stone-700 text-sm">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Day overview */}
          {itinerary?.days && (
            <div>
              <h2 className="font-semibold text-stone-800 mb-4">{t("includes")}</h2>
              <div className="space-y-2">
                {itinerary.days.map((day) => (
                  <div key={day.dayNumber} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full min-w-[4rem] text-center">
                      Día {day.dayNumber}
                    </span>
                    <span className="text-sm text-stone-700">{day.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Purchase sidebar */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="sticky top-20 bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
            <PurchaseButton
              product={product}
              existingPurchaseId={existingPurchase?.id || null}
              session={session}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
