import Link from "next/link";
import { MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-stone-100 bg-stone-50 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 font-semibold text-stone-800 mb-3">
              <MapPin className="h-4 w-4 text-amber-600" />
              <span>Wayroute</span>
            </div>
            <p className="text-sm text-stone-500 max-w-xs">
              Itinerarios de viaje diseñados con cariño para que vivas cada destino con profundidad.
            </p>
          </div>
          <div className="flex gap-12">
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Productos</p>
              <div className="space-y-2">
                <Link href="/itineraries" className="block text-sm text-stone-600 hover:text-stone-900">Itinerarios</Link>
                <Link href="/consulting" className="block text-sm text-stone-600 hover:text-stone-900">Consultoría</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Cuenta</p>
              <div className="space-y-2">
                <Link href="/login" className="block text-sm text-stone-600 hover:text-stone-900">Iniciar sesión</Link>
                <Link href="/register" className="block text-sm text-stone-600 hover:text-stone-900">Registrarse</Link>
                <Link href="/dashboard" className="block text-sm text-stone-600 hover:text-stone-900">Mis compras</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-stone-200 mt-8 pt-6 text-xs text-stone-400 text-center">
          © {new Date().getFullYear()} Wayroute. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
