import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Webhook signature invalid" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, productId, discountCode } = session.metadata || {};

    if (!userId || !productId) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    // Upsert purchase
    await prisma.purchase.upsert({
      where: { stripeSessionId: session.id },
      update: { status: "COMPLETED", stripePaymentId: session.payment_intent as string },
      create: {
        userId,
        productId,
        stripeSessionId: session.id,
        stripePaymentId: session.payment_intent as string,
        amountPaid: session.amount_total ?? 0,
        discountCode: discountCode || null,
        status: "COMPLETED",
      },
    });

    // Increment discount usage
    if (discountCode) {
      await prisma.discountCode.updateMany({
        where: { code: discountCode },
        data: { usedCount: { increment: 1 } },
      });
    }
  }

  return NextResponse.json({ received: true });
}
