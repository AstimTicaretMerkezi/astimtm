import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-[#F4F3F0] text-[#111111] flex justify-between items-center w-full px-[1rem] md:px-[2.5rem] h-20 border-b border-[#111111] sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-4">
        <div className="h-10 w-10 relative flex-shrink-0">
          <Image
            src="/images/logo.jpeg"
            alt="Astim Logo"
            fill
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
