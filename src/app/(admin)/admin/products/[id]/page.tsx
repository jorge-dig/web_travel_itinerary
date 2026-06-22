import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import type { ItineraryContent } from "@/types/itinerary";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { itinerary: true },
  });

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Editar producto</h1>
      <ProductForm
        product={{
          ...product,
          price: product.price / 100,
          itinerary: product.itinerary
            ? { ...product.itinerary, content: product.itinerary.content as unknown as ItineraryContent }
            : null,
        }}
      />
    </div>
  );
}
