import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { QuestionnaireForm } from "@/components/consulting/QuestionnaireForm";

export default async function QuestionnairePage({ params }: { params: Promise<{ purchaseId: string }> }) {
  const { purchaseId } = await params;
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: { questionnaire: true },
  });

  if (!purchase || purchase.userId !== userId || purchase.status !== "COMPLETED") {
    redirect("/dashboard");
  }

  if (purchase.questionnaire) {
    redirect(`/consulting/${purchaseId}/schedule`);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <QuestionnaireForm purchaseId={purchaseId} />
    </div>
  );
}
