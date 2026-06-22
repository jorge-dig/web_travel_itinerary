import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, ArrowRight, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const purchases = await prisma.purchase.findMany({
    where: { userId, status: "COMPLETED" },
    include: {
      product: { include: { itinerary: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-2">{t("title")}</h1>
      <p className="text-stone-500 mb-8">Bienvenido, {session?.user?.name || session?.user?.email}</p>

      {purchases.length === 0 ? (
        <div className="text-center py-24 text-stone-400">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg mb-4">{t("empty")}</p>
          <Link href="/itineraries">
            <Button variant="warm">Explorar itinerarios</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Badge variant={purchase.product.type === "ITINERARY" ? "secondary" : "warning"} className="mb-2">
                    {purchase.product.type === "ITINERARY" ? "Itinerario" : "Consultoría"}
                  </Badge>
                  <h3 className="font-semibold text-stone-800">{purchase.product.title}</h3>
                </div>
              </div>

              {purchase.product.itinerary && (
                <div className="flex items-center gap-3 text-xs text-stone-500 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {purchase.product.itinerary.destination}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {purchase.product.itinerary.durationDays} días
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400">
                  {t("purchased")} {new Date(purchase.createdAt).toLocaleDateString("es-ES")}
                </span>
                {purchase.product.type === "ITINERARY" ? (
                  <Link href={`/viewer/${purchase.id}`}>
                    <Button size="sm" variant="warm" className="flex items-center gap-1">
                      {t("viewItinerary")} <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/consulting/${purchase.id}/questionnaire`}>
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      {t("viewConsulting")} <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
