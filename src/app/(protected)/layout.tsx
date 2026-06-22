import { Navbar } from "@/components/shared/Navbar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <>
      <Navbar session={session} />
      <main className="flex-1 pt-16 max-w-6xl mx-auto w-full px-4 py-8">{children}</main>
    </>
  );
}
