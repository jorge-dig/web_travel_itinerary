import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { auth } from "@/lib/auth";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <>
      <Navbar session={session} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </>
  );
}
