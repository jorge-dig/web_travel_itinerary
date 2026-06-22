import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ItineraryContent } from "@/types/itinerary";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { productId, content }: { productId: string; content: ItineraryContent } = await req.json();

  if (!content.destination || !content.durationDays || !Array.isArray(content.days)) {
    return NextResponse.json({ error: "JSON inválido: faltan campos obligatorios" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonContent = content as unknown as any;
  const itinerary = await prisma.itinerary.upsert({
    where: { productId },
    update: {
      destination: content.destination,
      durationDays: content.durationDays,
      content: jsonContent,
    },
    create: {
      productId,
      destination: content.destination,
      durationDays: content.durationDays,
      content: jsonContent,
    },
  });

  return NextResponse.json(itinerary);
}
