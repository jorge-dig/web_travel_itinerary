import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { UserRoleToggle } from "@/components/admin/UserRoleToggle";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true, email: true, name: true, role: true, createdAt: true,
      _count: { select: { purchases: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Usuarios ({users.length})</h1>
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm divide-y divide-stone-50">
        {users.map((user) => (
          <div key={user.id} className="px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-stone-800 truncate">{user.name || user.email}</p>
              <p className="text-sm text-stone-400 truncate">{user.email}</p>
              <p className="text-xs text-stone-400 mt-0.5">{user._count.purchases} compras · Registrado {new Date(user.createdAt).toLocaleDateString("es-ES")}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                {user.role}
              </Badge>
              <UserRoleToggle userId={user.id} currentRole={user.role} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
