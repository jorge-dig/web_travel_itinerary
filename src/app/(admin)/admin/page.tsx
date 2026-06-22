import { prisma } from "@/lib/prisma";
import { Users, Package, ShoppingBag, Tag } from "lucide-react";

export default async function AdminDashboard() {
  const [userCount, productCount, purchaseCount, discountCount] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.purchase.count({ where: { status: "COMPLETED" } }),
    prisma.discountCode.count({ where: { isActive: true } }),
  ]);

  const recentPurchases = await prisma.purchase.findMany({
    where: { status: "COMPLETED" },
    include: { user: true, product: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const stats = [
    { label: "Usuarios", value: userCount, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Productos", value: productCount, icon: Package, color: "text-amber-600 bg-amber-50" },
    { label: "Ventas completadas", value: purchaseCount, icon: ShoppingBag, color: "text-emerald-600 bg-emerald-50" },
    { label: "Descuentos activos", value: discountCount, icon: Tag, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Panel de administración</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
            <div className={`inline-flex p-2 rounded-xl ${color} mb-3`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-stone-800">{value}</p>
            <p className="text-sm text-stone-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm">
        <div className="p-5 border-b border-stone-100">
          <h2 className="font-semibold text-stone-800">Últimas ventas</h2>
        </div>
        <div className="divide-y divide-stone-50">
          {recentPurchases.map((p) => (
            <div key={p.id} className="px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-800">{p.product.title}</p>
                <p className="text-xs text-stone-400">{p.user.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-stone-800">{(p.amountPaid / 100).toFixed(2)} €</p>
                <p className="text-xs text-stone-400">{new Date(p.createdAt).toLocaleDateString("es-ES")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
