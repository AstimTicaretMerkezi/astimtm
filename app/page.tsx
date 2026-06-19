import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import StatsPanel from "@/components/landing/StatsPanel";
import Gallery from "@/components/landing/Gallery";
import Ticker from "@/components/landing/Ticker";
import HowToGet from "@/components/landing/HowToGet";
import Footer from "@/components/landing/Footer";
import { getAtolyeler } from "@/lib/github";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { atolyeler } = await getAtolyeler();

  // Count firms per category across all blocks
  const counts: Record<string, number> = {};
  for (const block of Object.values(atolyeler.blocks) as any[]) {
    for (const shop of block.shops as any[]) {
      for (const firm of (shop.firms ?? []) as any[]) {
        const cat: string = firm.category ?? "Diğer";
        counts[cat] = (counts[cat] ?? 0) + 1;
      }
    }
  }

  const categories = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([label, count]) => ({ label: label.toUpperCase(), count }));

  return (
    <>
      <Navbar />
      <main className="grid grid-cols-1 md:grid-cols-12 w-full">
        <Hero />
        <StatsPanel categories={categories} />
        <Gallery />
        <Ticker />
        <HowToGet />
      </main>
      <Footer />
    </>
  );
}
