import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const { purchaseId, slotId } = await req.json();

  const purchase = await prisma.purchase.findUnique({ where: { id: purchaseId } });
  if (!purchase || purchase.userId !== userId || purchase.status !== "COMPLETED") {
    return NextResponse.json({ error: "Compra no válida" }, { status: 403 });
  }

  const slot = await prisma.consultingSlot.findUnique({ where: { id: slotId } });
  if (!slot || !slot.isAvailable) {
    return NextResponse.json({ error: "Slot no disponible" }, { status: 409 });
  }

  const [booking] = await prisma.$transaction([
    prisma.consultingBooking.create({
      data: { purchaseId, slotId },
      include: { slot: true },
    }),
    prisma.consultingSlot.update({
      where: { id: slotId },
      data: { isAvailable: false },
    }),
  ]);

  return NextResponse.json(booking, { status: 201 });
}
