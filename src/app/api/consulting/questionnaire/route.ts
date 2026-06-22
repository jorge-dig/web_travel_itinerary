import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const { purchaseId, answers } = await req.json();

  const purchase = await prisma.purchase.findUnique({ where: { id: purchaseId } });
  if (!purchase || purchase.userId !== userId || purchase.status !== "COMPLETED") {
    return NextResponse.json({ error: "Compra no válida" }, { status: 403 });
  }

  const questionnaire = await prisma.consultingQuestionnaire.create({
    data: { purchaseId, userId, answers },
  });

  return NextResponse.json(questionnaire, { status: 201 });
}
