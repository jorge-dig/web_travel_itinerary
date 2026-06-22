import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { ProductCard } from "@/components/product/ProductCard";
import { Globe } from "lucide-react";

export default async function ItinerariesPage() {
  const t = await getTranslations("home");

  const products = await prisma.product.findMany({
    where: { isActive: true, type: "ITINERARY" },
    include: { itinerary: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-3">{t("featured")}</h1>
        <p className="text-stone-500">Destinos cuidadosamente documentados para viajeros con criterio.</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 text-stone-400">
          <Globe className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg">Los itinerarios están en camino.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
