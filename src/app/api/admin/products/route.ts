import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await auth();
  if (!session) return null;
  const user = session.user as { role?: string };
  return user.role === "ADMIN" ? session : null;
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();
  const { title, titleEn, description, descriptionEn, type, price, coverImageUrl, isActive, itinerary } = body;

  const slug = slugify(title);

  const product = await prisma.product.create({
    data: {
      title,
      titleEn: titleEn || null,
      description,
      descriptionEn: descriptionEn || null,
      slug,
      type,
      price: Math.round(price * 100),
      coverImageUrl: coverImageUrl || null,
      isActive: isActive ?? true,
      ...(type === "ITINERARY" && itinerary
        ? {
            itinerary: {
              create: {
                destination: itinerary.destination,
                durationDays: itinerary.durationDays,
                content: itinerary,
              },
            },
          }
        : {}),
    },
    include: { itinerary: true },
  });

  return NextResponse.json(product, { status: 201 });
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const products = await prisma.product.findMany({
    include: { itinerary: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
