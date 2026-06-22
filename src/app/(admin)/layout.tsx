import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, Users, Tag, Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Productos", icon: Package },
  { href: "/admin/users", label: "Usuarios", icon: Users },
  { href: "/admin/discounts", label: "Descuentos", icon: Tag },
  { href: "/admin/bookings", label: "Reservas", icon: Calendar },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  const user = session.user as { role?: string };
  if (user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-stone-100 fixed inset-y-0">
        <div className="h-16 flex items-center px-5 border-b border-stone-100">
          <Link href="/" className="flex items-center gap-2 font-semibold text-stone-800">
            <MapPin className="h-4 w-4 text-amber-600" />
            <span>Wayroute</span>
          </Link>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {adminNav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-stone-100 text-xs text-stone-400">
          Admin: {session.user?.name || session.user?.email}
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 h-14 bg-white border-b border-stone-100 flex items-center px-4 gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-stone-800">
          <MapPin className="h-4 w-4 text-amber-600" />
          <span>Admin</span>
        </Link>
        <div className="flex gap-2 overflow-x-auto ml-4">
          {adminNav.map(({ href, label }) => (
            <Link key={href} href={href} className="text-xs text-stone-600 whitespace-nowrap px-2 py-1 rounded-full border border-stone-200">
              {label}
            </Link>
          ))}
        </div>
      </div>

      <main className="flex-1 md:ml-56 pt-16 md:pt-0 p-6">{children}</main>
    </div>
  );
}
