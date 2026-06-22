"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Loader2, Trash2 } from "lucide-react";

interface Slot {
  id: string;
  startAt: string;
  endAt: string;
  isAvailable: boolean;
  booking?: {
    purchase: {
      user: { email: string; name: string | null };
    };
  } | null;
}

export default function AdminBookingsPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("/api/admin/slots").then(r => r.json()).then(data => {
      setSlots(data);
      setLoading(false);
    });
  }, []);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = e.currentTarget;
    const startAt = (form.elements.namedItem("startAt") as HTMLInputElement).value;
    const endAt = (form.elements.namedItem("endAt") as HTMLInputElement).value;

    const res = await fetch("/api/admin/slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startAt, endAt }),
    });
    if (res.ok) {
      const newSlot = await res.json();
      setSlots((prev) => [newSlot, ...prev]);
      setShowForm(false);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este slot?")) return;
    await fetch(`/api/admin/slots/${id}`, { method: "DELETE" });
    setSlots((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Slots de consultoría</h1>
        <Button variant="warm" onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nuevo slot
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 mb-6 grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Inicio</Label>
            <Input name="startAt" type="datetime-local" required />
          </div>
          <div className="space-y-1.5">
            <Label>Fin</Label>
            <Input name="endAt" type="datetime-local" required />
          </div>
          <div className="col-span-2">
            <Button type="submit" variant="warm" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Crear slot"}
            </Button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm divide-y divide-stone-50">
        {loading ? (
          <div className="p-8 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-stone-400" /></div>
        ) : slots.map((slot) => (
          <div key={slot.id} className="px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-amber-500" />
              <div>
                <p className="text-sm font-medium text-stone-800">
                  {new Date(slot.startAt).toLocaleString("es-ES", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                </p>
                {slot.booking && (
                  <p className="text-xs text-stone-400">
                    Reservado: {slot.booking.purchase.user.name || slot.booking.purchase.user.email}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={slot.isAvailable ? "success" : slot.booking ? "warning" : "outline"}>
                {slot.isAvailable ? "Disponible" : slot.booking ? "Reservado" : "No disponible"}
              </Badge>
              {slot.isAvailable && (
                <Button variant="ghost" size="icon" onClick={() => handleDelete(slot.id)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
