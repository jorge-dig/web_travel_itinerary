import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { productId, discountCode, currency = "EUR" } = await req.json();

  const product = await prisma.product.findUnique({ where: { id: productId, isActive: true } });
  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  const existing = await prisma.purchase.findFirst({
    where: { userId, productId, status: "COMPLETED" },
  });
  if (existing) {
    return NextResponse.json({ error: "Ya tienes este producto" }, { status: 409 });
  }

  let priceInCents = product.price;
  if (currency === "USD") {
    const rateRecord = await prisma.exchangeRate.findUnique({
      where: { fromCurrency_toCurrency: { fromCurrency: "EUR", toCurrency: "USD" } },
    });
    priceInCents = Math.round(priceInCents * (rateRecord?.rate ?? 1.08));
  }

  let discounts: { coupon: string }[] = [];
  if (discountCode) {
    const discountCodeRecord = await prisma.discountCode.findUnique({
      where: { code: discountCode.toUpperCase() },
    });
    if (discountCodeRecord?.isActive && discountCodeRecord.stripeCouponId) {
      discounts = [{ coupon: discountCodeRecord.stripeCouponId }];
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: currency.toLowerCase(),
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: { name: product.title },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      discounts: discounts.length > 0 ? discounts : undefined,
      metadata: {
        userId,
        productId: product.id,
        discountCode: discountCode || "",
      },
      success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/itineraries/${product.slug}`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al crear la sesión de pago";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
