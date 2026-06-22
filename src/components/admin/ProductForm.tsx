"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { JsonUploader } from "./JsonUploader";
import { Loader2, Save, Trash2 } from "lucide-react";
import type { ItineraryContent } from "@/types/itinerary";

interface ProductFormProps {
  product?: {
    id: string;
    title: string;
    titleEn?: string | null;
    description: string;
    descriptionEn?: string | null;
    type: string;
    price: number;
    coverImageUrl?: string | null;
    isActive: boolean;
    itinerary?: {
      id: string;
      destination: string;
      durationDays: number;
      content: ItineraryContent;
    } | null;
  };
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [type, setType] = useState(product?.type || "ITINERARY");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const form = e.currentTarget;

    const body = {
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      titleEn: (form.elements.namedItem("titleEn") as HTMLInputElement).value,
      description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
      descriptionEn: (form.elements.namedItem("descriptionEn") as HTMLTextAreaElement).value,
      type,
      price: parseFloat((form.elements.namedItem("price") as HTMLInputElement).value),
      coverImageUrl: (form.elements.namedItem("coverImageUrl") as HTMLInputElement).value,
      isActive: (form.elements.namedItem("isActive") as HTMLInputElement).checked,
    };

    const res = isEdit
      ? await fetch(`/api/admin/products/${product!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      : await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Error al guardar");
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return;
    setDeleting(true);
    await fetch(`/api/admin/products/${product!.id}`, { method: "DELETE" });
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 space-y-5">
        {/* Type */}
        <div>
          <Label className="mb-2 block">Tipo de producto</Label>
          <div className="flex gap-3">
            {["ITINERARY", "CONSULTING"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  type === t
                    ? "bg-stone-800 text-white border-stone-800"
                    : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                }`}
              >
                {t === "ITINERARY" ? "Itinerario" : "Consultoría"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Título (ES) *</Label>
            <Input id="title" name="title" required defaultValue={product?.title} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="titleEn">Título (EN)</Label>
            <Input id="titleEn" name="titleEn" defaultValue={product?.titleEn || ""} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="description">Descripción (ES) *</Label>
            <Textarea id="description" name="description" rows={4} required defaultValue={product?.description} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="descriptionEn">Descripción (EN)</Label>
            <Textarea id="descriptionEn" name="descriptionEn" rows={4} defaultValue={product?.descriptionEn || ""} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="price">Precio (€) *</Label>
            <Input id="price" name="price" type="number" step="0.01" min="0" required defaultValue={product?.price || ""} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="coverImageUrl">URL imagen portada</Label>
            <Input id="coverImageUrl" name="coverImageUrl" type="url" defaultValue={product?.coverImageUrl || ""} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            defaultChecked={product?.isActive ?? true}
            className="h-4 w-4 rounded border-stone-300 text-amber-600"
          />
          <Label htmlFor="isActive">Producto activo (visible en la web)</Label>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex items-center justify-between pt-2">
          <Button type="submit" variant="warm" disabled={saving} className="flex items-center gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar
          </Button>
          {isEdit && (
            <Button type="button" variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
              <Trash2 className="h-4 w-4 mr-1" />
              Eliminar
            </Button>
          )}
        </div>
      </form>

      {/* JSON uploader for itinerary products */}
      {type === "ITINERARY" && isEdit && (
        <JsonUploader productId={product!.id} currentContent={product?.itinerary?.content || null} />
      )}
      {type === "ITINERARY" && !isEdit && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800">
          Guarda el producto primero para poder importar o editar el contenido del itinerario.
        </div>
      )}
    </div>
  );
}
