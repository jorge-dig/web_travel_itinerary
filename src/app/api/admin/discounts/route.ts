import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

async function requireAdmin() {
  const session = await auth();
  return (session?.user as { role?: string })?.role === "ADMIN" ? session : null;
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const codes = await prisma.discountCode.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(codes);
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const { code, type, value, maxUses, expiresAt } = await req.json();

  // Create Stripe coupon
  let stripeCouponId: string | null = null;
  try {
    const coupon = await stripe.coupons.create({
      name: code,
      ...(type === "PERCENTAGE"
        ? { percent_off: value }
        : { amount_off: value, currency: "eur" }),
      ...(maxUses ? { max_redemptions: maxUses } : {}),
      ...(expiresAt ? { redeem_by: Math.floor(new Date(expiresAt).getTime() / 1000) } : {}),
    });
    stripeCouponId = coupon.id;
  } catch {
    // Stripe not configured — store without coupon ID
  }

  const discount = await prisma.discountCode.create({
    data: {
      code: code.toUpperCase(),
      type,
      value,
      maxUses: maxUses || null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      stripeCouponId,
    },
  });

  return NextResponse.json(discount, { status: 201 });
}
