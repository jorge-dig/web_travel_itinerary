import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  return (session?.user as { role?: string })?.role === "ADMIN";
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const slots = await prisma.consultingSlot.findMany({
    include: {
      booking: {
        include: {
          purchase: { include: { user: { select: { email: true, name: true } } } },
        },
      },
    },
    orderBy: { startAt: "asc" },
  });

  return NextResponse.json(slots);
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const { startAt, endAt } = await req.json();

  const slot = await prisma.consultingSlot.create({
    data: { startAt: new Date(startAt), endAt: new Date(endAt) },
  });

  return NextResponse.json(slot, { status: 201 });
}
