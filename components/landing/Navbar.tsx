import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-[#F4F3F0] text-[#111111] flex justify-between items-center w-full px-[2rem] md:px-[2.5rem] h-20 border-b border-[#111111] sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-4">
        <div className="h-10 w-10 relative flex-shrink-0">
          <Image
            src="/images/logo_trans.png"
            alt="Astim Logo"
            fill
            sizes="40px"
            className="object-contain grayscale brightness-0"
          />
        </div>
        <span
          className="text-[18px] leading-[28px] font-[900] tracking-tighter uppercase text-[#111111]"
          style={{ fontFamily: "var(--font-hanken)" }}
        >
          ASTIM TİCARET MERKEZİ
        </span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex gap-4 items-center">
        {[
          { label: "ATÖLYELERİMİZ", href: "/atolyeler" },
          { label: "İLETİŞİM", href: "#konum" },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="text-[12px] leading-[16px] font-[700] uppercase tracking-widest border border-[#111111] px-4 py-2 hover:bg-[#111111] hover:text-[#F4F3F0] transition-none"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            {item.label}
          </a>
        ))}
        <Link
          href="/giris"
          className="text-[12px] leading-[16px] font-[700] uppercase tracking-widest bg-[#111111] text-[#F4F3F0] px-4 py-2 hover:bg-[#FF4A00] transition-none flex items-center gap-2"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          ÜYE GİRİŞİ →
        </Link>
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8"
        aria-label="Menü"
      >
        <span className="w-5 h-px bg-[#111111]" />
        <span className="w-5 h-px bg-[#111111]" />
        <span className="w-5 h-px bg-[#111111]" />
      </button>
    </nav>
  );
}
