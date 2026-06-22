"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";

export function QuestionnaireForm({ purchaseId }: { purchaseId: string }) {
  const t = useTranslations("consulting.questionnaire");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState("");

  const styleOptions = ["Cultural y gastronómico", "Naturaleza y aventura", "Relax y bienestar", "Mezcla de todo"];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;

    const answers = {
      destinations: (form.elements.namedItem("destinations") as HTMLInputElement).value,
      duration: (form.elements.namedItem("duration") as HTMLInputElement).value,
      travelers: (form.elements.namedItem("travelers") as HTMLInputElement).value,
      style,
      budget: (form.elements.namedItem("budget") as HTMLInputElement).value,
      interests: (form.elements.namedItem("interests") as HTMLTextAreaElement).value,
      other: (form.elements.namedItem("other") as HTMLTextAreaElement).value,
    };

    const res = await fetch("/api/consulting/questionnaire", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purchaseId, answers }),
    });

    if (res.ok) {
      router.push(`/consulting/${purchaseId}/schedule`);
    }
    setLoading(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-2">{t("title")}</h1>
      <p className="text-stone-500 mb-8">Cuéntanos todo lo que puedas — cuanto más detalle, mejor será tu itinerario.</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 space-y-6">
        <div className="space-y-1.5">
          <Label htmlFor="destinations">{t("destinations")} *</Label>
          <Input id="destinations" name="destinations" required placeholder="Japón, Tailandia, Islandia..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="duration">{t("duration")} *</Label>
            <Input id="duration" name="duration" required placeholder="10 días" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="travelers">{t("travelers")} *</Label>
            <Input id="travelers" name="travelers" required placeholder="2 adultos" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t("style")} *</Label>
          <div className="flex flex-wrap gap-2">
            {styleOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setStyle(option)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  style === option
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="budget">{t("budget")} *</Label>
          <Input id="budget" name="budget" required placeholder="2.000€ por persona" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="interests">{t("interests")}</Label>
          <Textarea id="interests" name="interests" rows={3} placeholder="Templos, senderismo, gastronomía local, museos..." />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="other">{t("other")}</Label>
          <Textarea id="other" name="other" rows={3} placeholder="Alergias alimentarias, movilidad reducida, preferencias de alojamiento..." />
        </div>

        <Button type="submit" variant="warm" size="lg" className="w-full flex items-center gap-2" disabled={loading || !style}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {t("submit")}
        </Button>
      </form>
    </div>
  );
}
