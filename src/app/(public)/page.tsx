import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowRight, Star, Users, Globe } from "lucide-react";

export default async function HomePage() {
  const t = await getTranslations("home");
  const pt = await getTranslations("product");

  const products = await prisma.product.findMany({
    where: { isActive: true, type: "ITINERARY" },
    include: { itinerary: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 text-white">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm text-amber-200 mb-6">
            <Globe className="h-4 w-4" />
            <span>Itinerarios para viajeros con curiosidad</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            {t("hero.title")}
          </h1>
          <p className="text-lg md:text-xl text-stone-300 max-w-2xl mx-auto mb-10">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="#itinerarios">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold">
                {t("hero.cta")}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/consulting">
              <Button size="lg" variant="outline" className="border-white/30 text-white bg-white/10 hover:bg-white/20">
                {t("hero.ctaConsulting")}
              </Button>
            </Link>
          </div>
        </div>
        {/* Stats */}
        <div className="relative border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-amber-300">{products.length}+</p>
              <p className="text-xs text-stone-400 mt-0.5">Destinos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-300">100%</p>
              <p className="text-xs text-stone-400 mt-0.5">Probados in situ</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-300">★ 4.9</p>
              <p className="text-xs text-stone-400 mt-0.5">Valoración</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section id="itinerarios" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">{t("featured")}</h2>
        <p className="text-stone-500 mb-10">Cada itinerario, una experiencia diferente.</p>

        {products.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <Globe className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Los itinerarios están en camino. ¡Vuelve pronto!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Consulting CTA */}
      <section className="bg-amber-50 border-y border-amber-100">
        <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full mb-4">
              <Users className="h-3 w-3" />
              Servicio personalizado
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-3">
              {t("consulting.title")}
            </h2>
            <p className="text-stone-600 mb-6">{t("consulting.description")}</p>
            <Link href="/consulting">
              <Button variant="warm" size="lg">
                {t("consulting.cta")}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="hidden md:block flex-1 max-w-xs">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100 space-y-3">
              {["Destino a medida", "Ritmo adaptado a ti", "Consejos de experto", "Soporte durante el viaje"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Star className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <span className="text-sm text-stone-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
