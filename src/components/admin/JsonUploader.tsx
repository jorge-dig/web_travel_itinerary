"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, CheckCircle, AlertCircle, FileJson } from "lucide-react";
import type { ItineraryContent } from "@/types/itinerary";

const EXAMPLE_JSON: ItineraryContent = {
  destination: "Kyoto, Japón",
  durationDays: 3,
  summary: "Tres días entre templos, bamb√∫ y gastronomía japonesa.",
  highlights: ["Bosque de bambú de Arashiyama", "Fushimi Inari al amanecer", "Ceremonia del té en Gion"],
  days: [
    {
      dayNumber: 1,
      title: "Llegada y primeras impresiones",
      activities: [
        {
          id: "act_001",
          time: "14:00",
          type: "transport",
          title: "Shinkansen Tokio → Kioto",
          description: "Toma el tren Nozomi desde Tokio. El trayecto dura aproximadamente 2h 15min.",
          duration: "2h 15min",
          cost: { amount: 13500, currency: "JPY", included: false },
          location: {
            name: "Estación de Kioto",
            address: "Higashishiokoji, Shimogyo, Kyoto",
            coordinates: { lat: 34.9858, lng: 135.7588 },
            mapsUrl: "https://maps.google.com/?q=Kyoto+Station"
          },
          tips: ["Reserva el asiento en el lado derecho para ver el Fuji"],
          imageUrl: null
        }
      ],
      meals: {
        breakfast: null,
        lunch: "Ramen en Ichiran, cerca de la estación",
        dinner: "Cena kaiseki incluida en el ryokan"
      },
      notes: "Reserva la noche libre para pasear por Gion al atardecer."
    }
  ],
  practicalInfo: {
    currency: "JPY",
    language: "Japonés",
    timezone: "Asia/Tokyo",
    transportation: "Tarjeta IC (Suica/ICOCA) para el transporte local",
    budgetPerDay: { budget: 8000, mid: 20000, luxury: 50000, currency: "JPY" },
    packingTips: ["Zapatos fáciles de quitar para los templos", "Pañuelo de tela"]
  },
  meta: { version: "1.0", lastUpdated: new Date().toISOString().split("T")[0] }
};

interface JsonUploaderProps {
  productId: string;
  currentContent: ItineraryContent | null;
}

export function JsonUploader({ productId, currentContent }: JsonUploaderProps) {
  const [json, setJson] = useState(
    currentContent ? JSON.stringify(currentContent, null, 2) : ""
  );
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [showExample, setShowExample] = useState(false);

  async function handleImport() {
    setSaving(true);
    setStatus("idle");
    try {
      const content = JSON.parse(json);
      const res = await fetch("/api/admin/itinerary-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, content }),
      });
      if (res.ok) {
        setStatus("success");
        setMessage("Itinerario importado correctamente");
      } else {
        const data = await res.json();
        setStatus("error");
        setMessage(data.error || "Error al importar");
      }
    } catch {
      setStatus("error");
      setMessage("JSON inválido — revisa la sintaxis");
    }
    setSaving(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-stone-800 flex items-center gap-2">
          <FileJson className="h-4 w-4 text-amber-600" />
          Contenido del itinerario (JSON)
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setShowExample(!showExample);
            if (!json) setJson(JSON.stringify(EXAMPLE_JSON, null, 2));
          }}
        >
          {showExample ? "Ocultar ejemplo" : "Ver ejemplo JSON"}
        </Button>
      </div>

      {showExample && (
        <div className="mb-4 p-3 bg-stone-50 rounded-xl border border-stone-200">
          <p className="text-xs text-stone-500 mb-2 font-medium">Estructura del JSON:</p>
          <p className="text-xs text-stone-600">
            El JSON debe tener: <code className="bg-stone-100 px-1 rounded">destination</code>,{" "}
            <code className="bg-stone-100 px-1 rounded">durationDays</code>,{" "}
            <code className="bg-stone-100 px-1 rounded">days[]</code> (obligatorios).
            Opcionales: <code className="bg-stone-100 px-1 rounded">summary</code>,{" "}
            <code className="bg-stone-100 px-1 rounded">highlights</code>,{" "}
            <code className="bg-stone-100 px-1 rounded">practicalInfo</code>.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => setJson(JSON.stringify(EXAMPLE_JSON, null, 2))}
          >
            Cargar ejemplo
          </Button>
        </div>
      )}

      <Textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        rows={20}
        className="font-mono text-xs"
        placeholder='{"destination": "...", "durationDays": 7, "days": [...]}'
      />

      {status === "success" && (
        <div className="flex items-center gap-2 text-emerald-600 text-sm mt-3">
          <CheckCircle className="h-4 w-4" /> {message}
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 text-red-500 text-sm mt-3">
          <AlertCircle className="h-4 w-4" /> {message}
        </div>
      )}

      <Button
        variant="warm"
        className="mt-4 flex items-center gap-2"
        onClick={handleImport}
        disabled={saving || !json.trim()}
      >
        <Upload className="h-4 w-4" />
        {saving ? "Importando..." : "Importar JSON"}
      </Button>
    </div>
  );
}
