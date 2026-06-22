import type { ItineraryDay } from "@/types/itinerary";
import { ActivityCard } from "./ActivityCard";
import { UtensilsCrossed } from "lucide-react";

interface DaySectionProps {
  day: ItineraryDay;
}

export function DaySection({ day }: DaySectionProps) {
  const hasMeals = day.meals && Object.values(day.meals).some(Boolean);

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      {/* Day header */}
      <div className="bg-stone-800 text-white px-5 py-4 flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-stone-900">
          <div className="text-center">
            <p className="text-xs font-medium leading-none">DÍA</p>
            <p className="text-xl font-bold leading-tight">{day.dayNumber}</p>
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-lg leading-tight">{day.title}</h2>
          {day.theme && <p className="text-xs text-stone-400 capitalize">{day.theme}</p>}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Activities */}
        {day.activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}

        {/* Meals */}
        {hasMeals && (
          <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5 mb-3 uppercase tracking-wide">
              <UtensilsCrossed className="h-3.5 w-3.5" />
              Comidas del día
            </p>
            <div className="grid grid-cols-3 gap-3">
              {day.meals?.breakfast && (
                <div>
                  <p className="text-xs font-medium text-stone-500 mb-0.5">Desayuno</p>
                  <p className="text-sm text-stone-700">{day.meals.breakfast}</p>
                </div>
              )}
              {day.meals?.lunch && (
                <div>
                  <p className="text-xs font-medium text-stone-500 mb-0.5">Comida</p>
                  <p className="text-sm text-stone-700">{day.meals.lunch}</p>
                </div>
              )}
              {day.meals?.dinner && (
                <div>
                  <p className="text-xs font-medium text-stone-500 mb-0.5">Cena</p>
                  <p className="text-sm text-stone-700">{day.meals.dinner}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Day notes */}
        {day.notes && (
          <div className="mt-3 p-4 bg-stone-50 rounded-xl border-l-4 border-amber-400">
            <p className="text-sm text-stone-600 italic">{day.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
