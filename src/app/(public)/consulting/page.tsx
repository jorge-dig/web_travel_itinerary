import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { PurchaseButton } from "@/components/product/PurchaseButton";
import { auth } from "@/lib/auth";
import { CheckCircle, Star, Users, MessageSquare } from "lucide-react";

export default async function ConsultingPage() {
  const t = await getTranslations("consulting");
  const session = await auth();

  const consultingProduct = await prisma.product.findFirst({
    where: { type: "CONSULTING", isActive: true },
    orderBy: { createdAt: "desc" },
  });

  const features = [
    "Análisis completo de tus gustos y estilo de viaje",
    "Itinerario personalizado día a día",
    "Selección de alojamientos según tu presupuesto",
    "Consejos gastronómicos de primera mano",
    "Soporte durante el viaje por WhatsApp",
    "Ajustes ilimitados hasta que sea perfecto",
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-sm px-4 py-1.5 rounded-full mb-5">
          <Users className="h-4 w-4" />
          Servicio personalizado
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-5">{t("title")}</h1>
        <p className="text-xl text-stone-500 max-w-2xl mx-auto">{t("description")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Features */}
        <div>
          <h2 className="text-xl font-semibold text-stone-800 mb-6">¿Qué incluye?</h2>
          <ul className="space-y-4">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-stone-700">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 p-5 bg-stone-50 rounded-2xl border border-stone-100">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="h-4 w-4 text-amber-600" />
              <p className="font-medium text-stone-800">¿Cómo funciona?</p>
            </div>
            <ol className="space-y-2 text-sm text-stone-600">
              <li className="flex gap-2"><span className="font-bold text-amber-600">1.</span> Completas el pago</li>
              <li className="flex gap-2"><span className="font-bold text-amber-600">2.</span> Rellenas un cuestionario sobre tu viaje ideal</li>
              <li className="flex gap-2"><span className="font-bold text-amber-600">3.</span> Eliges una fecha y hora para nuestra llamada</li>
              <li className="flex gap-2"><span className="font-bold text-amber-600">4.</span> Recibes tu itinerario personalizado en 48h</li>
            </ol>
          </div>
        </div>

        {/* Purchase card */}
        <div>
          {consultingProduct ? (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
              <h3 className="font-semibold text-stone-800 text-lg mb-1">{consultingProduct.title}</h3>
              <p className="text-stone-500 text-sm mb-6">{consultingProduct.description}</p>
              <PurchaseButton
                product={consultingProduct}
                existingPurchaseId={null}
                session={session}
              />
            </div>
          ) : (
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-8 text-center">
              <Star className="h-8 w-8 text-amber-400 mx-auto mb-3" />
              <p className="text-stone-600">Próximamente disponible. ¡Vuelve pronto!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
