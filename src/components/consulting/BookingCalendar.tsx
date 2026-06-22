"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Loader2, Clock } from "lucide-react";

interface Slot {
  id: string;
  startAt: string;
  endAt: string;
}

interface BookingCalendarProps {
  purchaseId: string;
  slots: Slot[];
  existingBooking: { slotId: string; startAt: string } | null;
}

export function BookingCalendar({ purchaseId, slots, existingBooking }: BookingCalendarProps) {
  const t = useTranslations("consulting.schedule");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booking, setBooking] = useState(existingBooking);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  async function confirmBooking() {
    if (!selectedSlot) return;
    setLoading(true);
    const res = await fetch("/api/consulting/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purchaseId, slotId: selectedSlot }),
    });
    if (res.ok) {
      const data = await res.json();
      setBooking({ slotId: selectedSlot, startAt: data.slot.startAt });
      setConfirmed(true);
    }
    setLoading(false);
  }

  if (booking || confirmed) {
    const date = new Date(booking?.startAt || "");
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-6">
          <CheckCircle className="h-8 w-8 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mb-2">{t("confirmed")}</h2>
        <p className="text-stone-600 mb-4">Tu llamada está programada para:</p>
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-3 rounded-full text-lg font-semibold">
          <Calendar className="h-5 w-5" />
          {date.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          {" · "}
          {date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-2">{t("title")}</h1>
      <p className="text-stone-500 mb-8">{t("subtitle")}</p>

      {slots.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No hay slots disponibles en este momento. Contacta con nosotros directamente.</p>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {slots.map((slot) => {
            const start = new Date(slot.startAt);
            const end = new Date(slot.endAt);
            const isSelected = selectedSlot === slot.id;

            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedSlot(slot.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? "bg-amber-50 border-amber-400 shadow-sm"
                    : "bg-white border-stone-200 hover:border-stone-400"
                }`}
              >
                <p className="font-semibold text-stone-800 capitalize">
                  {start.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
                </p>
                <p className="text-sm text-stone-500 flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3" />
                  {start.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })} —{" "}
                  {end.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {selectedSlot && (
        <Button
          variant="warm"
          size="lg"
          className="w-full flex items-center gap-2"
          onClick={confirmBooking}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
          {t("confirm")}
        </Button>
      )}
    </div>
  );
}
