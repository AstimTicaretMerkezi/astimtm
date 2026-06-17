import { getAtolyeler } from "@/lib/github";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AtolyePublicGrid from "@/components/atolyeler/AtolyePublicGrid";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Atölyeler — ASTİM Ticaret Merkezi",
};

export default async function AtolyelerPage() {
  const { atolyeler } = await getAtolyeler();

  return (
    <>
      <Navbar />
      <main className="grid grid-cols-1 md:grid-cols-12 w-full">
        <AtolyePublicGrid blocks={atolyeler.blocks} />
      </main>
      <Footer />
    </>
  );
}
