import type { Activity } from "@/types/itinerary";
import { MapPin, Clock, Euro, ExternalLink, Lightbulb } from "lucide-react";

const typeConfig: Record<string, { label: string; color: string; bg: string }> = {
  transport: { label: "Transporte", color: "text-blue-700", bg: "bg-blue-50 border-blue-100" },
  accommodation: { label: "Alojamiento", color: "text-purple-700", bg: "bg-purple-50 border-purple-100" },
  meal: { label: "Gastronomía", color: "text-orange-700", bg: "bg-orange-50 border-orange-100" },
  attraction: { label: "Atracción", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-100" },
  activity: { label: "Actividad", color: "text-amber-700", bg: "bg-amber-50 border-amber-100" },
  shopping: { label: "Compras", color: "text-pink-700", bg: "bg-pink-50 border-pink-100" },
  free_time: { label: "Tiempo libre", color: "text-stone-600", bg: "bg-stone-50 border-stone-200" },
  note: { label: "Nota", color: "text-stone-600", bg: "bg-stone-50 border-stone-200" },
};

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const config = typeConfig[activity.type] || typeConfig.note;

  return (
    <div className={`rounded-xl border p-4 ${config.bg}`}>
      <div className="flex items-start gap-3">
        {activity.time && (
          <div className="flex-shrink-0 text-center pt-0.5">
            <span className={`text-xs font-bold ${config.color} block leading-none`}>{activity.time}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-stone-800 text-sm leading-snug">{activity.title}</h3>
            <span className={`text-xs font-medium ${config.color} flex-shrink-0 px-2 py-0.5 rounded-full bg-white/60`}>
              {config.label}
            </span>
          </div>

          {activity.description && (
            <p className="text-sm text-stone-600 leading-relaxed mb-3">{activity.description}</p>
          )}

          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {activity.duration && (
              <span className="flex items-center gap-1 text-xs text-stone-500">
                <Clock className="h-3 w-3" />
                {activity.duration}
              </span>
            )}
            {activity.cost && (
              <span className="flex items-center gap-1 text-xs text-stone-500">
                <Euro className="h-3 w-3" />
                {activity.cost.included ? "Incluido" : `${activity.cost.amount} ${activity.cost.currency}`}
              </span>
            )}
            {activity.location && (
              <span className="flex items-center gap-1 text-xs text-stone-500">
                <MapPin className="h-3 w-3" />
                {activity.location.name}
                {activity.location.mapsUrl && (
                  <a
                    href={activity.location.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-amber-600 hover:text-amber-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </span>
            )}
          </div>

          {activity.tips && activity.tips.length > 0 && (
            <div className="mt-3 space-y-1">
              {activity.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Lightbulb className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-stone-600">{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
