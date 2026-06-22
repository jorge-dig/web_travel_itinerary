import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await auth();
  if (!session) return false;
  return (session.user as { role?: string }).role === "ADMIN";
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const { id } = await params;
  const body = await req.json();

  const product = await prisma.product.update({
    where: { id },
    data: {
      title: body.title,
      titleEn: body.titleEn || null,
      description: body.description,
      descriptionEn: body.descriptionEn || null,
      slug: slugify(body.title),
      price: Math.round(body.price * 100),
      coverImageUrl: body.coverImageUrl || null,
      isActive: body.isActive,
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const { id } = await params;

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
