"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function UserRoleToggle({ userId, currentRole }: { userId: string; currentRole: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: newRole }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggle} disabled={loading} className="text-xs">
      {currentRole === "ADMIN" ? "→ USER" : "→ ADMIN"}
    </Button>
  );
}
