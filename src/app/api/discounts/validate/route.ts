import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "Código requerido" }, { status: 400 });

  const discount = await prisma.discountCode.findUnique({ where: { code: code.toUpperCase() } });

  if (!discount || !discount.isActive) {
    return NextResponse.json({ error: "Código no válido o inactivo" }, { status: 404 });
  }

  if (discount.expiresAt && discount.expiresAt < new Date()) {
    return NextResponse.json({ error: "Código caducado" }, { status: 400 });
  }

  if (discount.maxUses !== null && discount.usedCount >= discount.maxUses) {
    return NextResponse.json({ error: "Código agotado" }, { status: 400 });
  }

  return NextResponse.json({
    code: discount.code,
    type: discount.type,
    value: discount.value,
    stripeCouponId: discount.stripeCouponId,
  });
}
