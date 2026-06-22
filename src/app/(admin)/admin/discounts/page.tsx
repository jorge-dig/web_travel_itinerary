"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Tag, Loader2 } from "lucide-react";

interface DiscountCode {
  id: string;
  code: string;
  type: string;
  value: number;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
}

export default function AdminDiscountsPage() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("/api/admin/discounts").then(r => r.json()).then(data => {
      setCodes(data);
      setLoading(false);
    });
  }, []);

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = e.currentTarget;
    const body = {
      code: (form.elements.namedItem("code") as HTMLInputElement).value,
      type: (form.elements.namedItem("type") as HTMLSelectElement).value,
      value: parseInt((form.elements.namedItem("value") as HTMLInputElement).value),
      maxUses: parseInt((form.elements.namedItem("maxUses") as HTMLInputElement).value) || null,
      expiresAt: (form.elements.namedItem("expiresAt") as HTMLInputElement).value || null,
    };
    const res = await fetch("/api/admin/discounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const newCode = await res.json();
      setCodes((prev) => [newCode, ...prev]);
      setShowForm(false);
      form.reset();
    }
    setSaving(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Códigos de descuento</h1>
        <Button variant="warm" onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nuevo código
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 mb-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Código</Label>
            <Input name="code" placeholder="VERANO25" required className="uppercase" />
          </div>
          <div className="space-y-1.5">
            <Label>Tipo</Label>
            <select name="type" className="flex h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300">
              <option value="PERCENTAGE">Porcentaje (%)</option>
              <option value="FIXED">Fijo (€ céntimos)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Valor</Label>
            <Input name="value" type="number" placeholder="20" required />
          </div>
          <div className="space-y-1.5">
            <Label>Usos máximos</Label>
            <Input name="maxUses" type="number" placeholder="Sin límite" />
          </div>
          <div className="space-y-1.5">
            <Label>Caduca</Label>
            <Input name="expiresAt" type="date" />
          </div>
          <div className="flex items-end">
            <Button type="submit" variant="warm" disabled={saving} className="w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Crear código"}
            </Button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm divide-y divide-stone-50">
        {loading ? (
          <div className="p-8 text-center text-stone-400"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></div>
        ) : codes.map((code) => (
          <div key={code.id} className="px-5 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Tag className="h-4 w-4 text-amber-500" />
              <div>
                <p className="font-mono font-bold text-stone-800">{code.code}</p>
                <p className="text-xs text-stone-400">
                  {code.type === "PERCENTAGE" ? `${code.value}%` : `${(code.value/100).toFixed(2)}€`}
                  {" · "}{code.usedCount}{code.maxUses ? `/${code.maxUses}` : ""} usos
                  {code.expiresAt && ` · Caduca ${new Date(code.expiresAt).toLocaleDateString("es-ES")}`}
                </p>
              </div>
            </div>
            <Badge variant={code.isActive ? "success" : "outline"}>
              {code.isActive ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
