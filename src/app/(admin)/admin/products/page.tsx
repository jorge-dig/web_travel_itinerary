import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, MapPin, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { itinerary: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Productos</h1>
        <Link href="/admin/products/new">
          <Button variant="warm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Nuevo producto
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm divide-y divide-stone-50">
        {products.map((product) => (
          <div key={product.id} className="px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={product.type === "ITINERARY" ? "secondary" : "warning"}>
                  {product.type === "ITINERARY" ? "Itinerario" : "Consultoría"}
                </Badge>
                <Badge variant={product.isActive ? "success" : "outline"}>
                  {product.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </div>
              <p className="font-medium text-stone-800 truncate">{product.title}</p>
              {product.itinerary && (
                <div className="flex items-center gap-3 mt-0.5 text-xs text-stone-400">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{product.itinerary.destination}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{product.itinerary.durationDays}d</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <span className="font-semibold text-stone-800">{formatPrice(product.price, "EUR")}</span>
              <Link href={`/admin/products/${product.id}`}>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Pencil className="h-3 w-3" /> Editar
                </Button>
              </Link>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="px-5 py-12 text-center text-stone-400">
            <p>No hay productos. Crea el primero.</p>
          </div>
        )}
      </div>
    </div>
  );
}
