import type { PracticalInfo } from "@/types/itinerary";
import { Globe, DollarSign, Backpack, Phone } from "lucide-react";

export function PracticalInfoPanel({ info }: { info: PracticalInfo }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
      <h2 className="font-semibold text-stone-800 mb-5 flex items-center gap-2">
        <Globe className="h-4 w-4 text-amber-600" />
        Información práctica
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {info.currency && (
          <div>
            <p className="text-xs text-stone-400 mb-1">Moneda local</p>
            <p className="text-sm font-medium text-stone-800">{info.currency}</p>
          </div>
        )}
        {info.language && (
          <div>
            <p className="text-xs text-stone-400 mb-1">Idioma</p>
            <p className="text-sm font-medium text-stone-800">{info.language}</p>
          </div>
        )}
        {info.timezone && (
          <div>
            <p className="text-xs text-stone-400 mb-1">Zona horaria</p>
            <p className="text-sm font-medium text-stone-800">{info.timezone}</p>
          </div>
        )}
        {info.transportation && (
          <div className="col-span-2 md:col-span-1">
            <p className="text-xs text-stone-400 mb-1">Transporte</p>
            <p className="text-sm font-medium text-stone-800">{info.transportation}</p>
          </div>
        )}
      </div>

      {/* Budget */}
      {info.budgetPerDay && (
        <div className="mb-5 p-4 bg-stone-50 rounded-xl">
          <p className="text-xs font-semibold text-stone-500 flex items-center gap-1 mb-3 uppercase tracking-wide">
            <DollarSign className="h-3 w-3" />
            Presupuesto diario estimado
          </p>
          <div className="grid grid-cols-3 gap-3">
            {info.budgetPerDay.budget && (
              <div className="text-center p-2 bg-emerald-50 rounded-lg">
                <p className="text-xs text-emerald-600 mb-1">Económico</p>
                <p className="font-bold text-stone-800 text-sm">{info.budgetPerDay.budget} {info.budgetPerDay.currency}</p>
              </div>
            )}
            {info.budgetPerDay.mid && (
              <div className="text-center p-2 bg-amber-50 rounded-lg">
                <p className="text-xs text-amber-600 mb-1">Medio</p>
                <p className="font-bold text-stone-800 text-sm">{info.budgetPerDay.mid} {info.budgetPerDay.currency}</p>
              </div>
            )}
            {info.budgetPerDay.luxury && (
              <div className="text-center p-2 bg-purple-50 rounded-lg">
                <p className="text-xs text-purple-600 mb-1">Premium</p>
                <p className="font-bold text-stone-800 text-sm">{info.budgetPerDay.luxury} {info.budgetPerDay.currency}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Packing tips */}
      {info.packingTips && info.packingTips.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-stone-500 flex items-center gap-1 mb-2 uppercase tracking-wide">
            <Backpack className="h-3 w-3" />
            Qué llevar
          </p>
          <ul className="space-y-1">
            {info.packingTips.map((tip, i) => (
              <li key={i} className="text-sm text-stone-600 flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Emergency contacts */}
      {info.emergencyContacts && Object.keys(info.emergencyContacts).length > 0 && (
        <div>
          <p className="text-xs font-semibold text-stone-500 flex items-center gap-1 mb-2 uppercase tracking-wide">
            <Phone className="h-3 w-3" />
            Contactos de emergencia
          </p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(info.emergencyContacts).map(([key, value]) => (
              <div key={key} className="text-xs">
                <span className="text-stone-500 capitalize">{key}: </span>
                <span className="font-medium text-stone-800">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
