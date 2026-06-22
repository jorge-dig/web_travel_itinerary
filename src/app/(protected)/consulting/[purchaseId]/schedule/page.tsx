import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BookingCalendar } from "@/components/consulting/BookingCalendar";

export default async function SchedulePage({ params }: { params: Promise<{ purchaseId: string }> }) {
  const { purchaseId } = await params;
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: { booking: { include: { slot: true } } },
  });

  if (!purchase || purchase.userId !== userId || purchase.status !== "COMPLETED") {
    redirect("/dashboard");
  }

  const availableSlots = await prisma.consultingSlot.findMany({
    where: { isAvailable: true, startAt: { gte: new Date() } },
    orderBy: { startAt: "asc" },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <BookingCalendar
        purchaseId={purchaseId}
        existingBooking={purchase.booking ? {
          slotId: purchase.booking.slotId,
          startAt: purchase.booking.slot.startAt.toISOString(),
        } : null}
        slots={availableSlots.map((s) => ({
          id: s.id,
          startAt: s.startAt.toISOString(),
          endAt: s.endAt.toISOString(),
        }))}
      />
    </div>
  );
}
