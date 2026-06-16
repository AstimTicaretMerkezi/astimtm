import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import StatsPanel from "@/components/landing/StatsPanel";
import Gallery from "@/components/landing/Gallery";
import Ticker from "@/components/landing/Ticker";
import ShopGrid from "@/components/landing/ShopGrid";
import HowToGet from "@/components/landing/HowToGet";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="grid grid-cols-1 md:grid-cols-12 w-full">
        <Hero />
        <StatsPanel />
        <Gallery />
        <Ticker />
        <ShopGrid />
        <HowToGet />
      </main>
      <Footer />
    </>
  );
}
