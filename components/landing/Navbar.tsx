import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#F4F3F0] border-b border-[#111111]">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 border border-[#111111] flex items-center justify-center overflow-hidden">
            <Image
              src="/images/logo.jpeg"
              alt="ASTİM Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span
            className="text-[#111111] text-xs tracking-[0.15em] uppercase"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            ASTİM TİCARET MERKEZİ
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-0">
          {[
            { label: "DÜKKANLAR", href: "#dukkanlar" },
            { label: "GALERİ", href: "#galeri" },
            { label: "NASIL GELİNİR?", href: "#konum" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-[10px] tracking-[0.15em] uppercase border-l border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F4F3F0] transition-none"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="/giris"
            className="ml-4 px-4 py-2 text-[10px] tracking-[0.15em] uppercase bg-[#111111] text-[#F4F3F0] hover:bg-[#FF4A00] transition-none"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            GİRİŞ →
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden w-8 h-8 border border-[#111111] flex flex-col justify-center items-center gap-[5px]"
          aria-label="Menü"
        >
          <span className="w-4 h-px bg-[#111111]" />
          <span className="w-4 h-px bg-[#111111]" />
          <span className="w-4 h-px bg-[#111111]" />
        </button>
      </div>
    </header>
  );
}
