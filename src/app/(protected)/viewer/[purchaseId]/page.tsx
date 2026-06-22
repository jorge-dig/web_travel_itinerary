import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { ItineraryViewer } from "@/components/itinerary/ItineraryViewer";
import type { ItineraryContent } from "@/types/itinerary";

export default async function ViewerPage({ params }: { params: Promise<{ purchaseId: string }> }) {
  const { purchaseId } = await params;
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: {
      product: { include: { itinerary: true } },
    },
  });

  if (!purchase || purchase.userId !== userId || purchase.status !== "COMPLETED") {
    redirect("/dashboard");
  }

  if (purchase.product.type !== "ITINERARY" || !purchase.product.itinerary) {
    notFound();
  }

  const content = purchase.product.itinerary.content as unknown as ItineraryContent;

  return (
    <div className="min-h-screen bg-stone-50">
      <ItineraryViewer
        title={purchase.product.title}
        destination={purchase.product.itinerary.destination}
        durationDays={purchase.product.itinerary.durationDays}
        content={content}
        updatedAt={purchase.product.itinerary.updatedAt.toISOString()}
      />
    </div>
  );
}
