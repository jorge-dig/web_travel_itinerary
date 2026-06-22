"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import type { ItineraryContent } from "@/types/itinerary";
import { DaySection } from "./DaySection";
import { PracticalInfoPanel } from "./PracticalInfoPanel";
import { MapPin, Clock, RefreshCw } from "lucide-react";

interface ItineraryViewerProps {
  title: string;
  destination: string;
  durationDays: number;
  content: ItineraryContent;
  updatedAt: string;
}

export function ItineraryViewer({ title, destination, durationDays, content, updatedAt }: ItineraryViewerProps) {
  const t = useTranslations("viewer");

  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    const preventKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ["c", "u", "s", "p", "a", "C", "U", "S", "P", "A"].includes(e.key)) {
        e.preventDefault();
      }
    };

    document.addEventListener("copy", prevent);
    document.addEventListener("cut", prevent);
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("dragstart", prevent);
    document.addEventListener("keydown", preventKeys);

    return () => {
      document.removeEventListener("copy", prevent);
      document.removeEventListener("cut", prevent);
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("dragstart", prevent);
      document.removeEventListener("keydown", preventKeys);
    };
  }, []);

  return (
    <div
      className="select-none"
      style={{ WebkitUserSelect: "none", userSelect: "none" }}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 text-white print:hidden">
        <div className="max-w-3xl mx-auto px-4 py-10 md:py-16">
          <div className="flex items-center gap-2 text-amber-300 text-sm mb-3">
            <MapPin className="h-4 w-4" />
            <span>{destination}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">{title}</h1>
          {content.summary && (
            <p className="text-stone-300 text-base md:text-lg leading-relaxed max-w-2xl">{content.summary}</p>
          )}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 text-sm text-stone-400">
              <Clock className="h-4 w-4" />
              {durationDays} días
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-400">
              <RefreshCw className="h-4 w-4" />
              Actualizado {new Date(updatedAt).toLocaleDateString("es-ES")}
            </div>
          </div>

          {/* Highlights */}
          {content.highlights && content.highlights.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {content.highlights.map((h, i) => (
                <span key={i} className="bg-white/10 text-white text-xs px-3 py-1 rounded-full">
                  {h}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Days */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {content.days.map((day) => (
          <DaySection key={day.dayNumber} day={day} />
        ))}

        {/* Practical info */}
        {content.practicalInfo && (
          <PracticalInfoPanel info={content.practicalInfo} />
        )}
      </div>

      {/* Print blocker */}
      <style>{`
        @media print { body { display: none !important; } }
      `}</style>
    </div>
  );
}
