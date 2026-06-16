import Image from "next/image";

export default function Hero() {
  return (
    <section className="border-b border-[#111111] grid grid-cols-1 md:grid-cols-2 min-h-[88vh]">
      {/* Left — Text */}
      <div className="border-b md:border-b-0 md:border-r border-[#111111] p-8 md:p-14 flex flex-col justify-between gap-10">
        <div className="flex flex-col gap-6">
          {/* Status label */}
          <div
            className="flex items-center gap-2 text-[#FF4A00] text-[10px] tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            <span className="w-2 h-2 bg-[#FF4A00] inline-block" />
            ASTİM TİCARET MERKEZİ // ÇANAKKALE
          </div>

          {/* Headline */}
          <h1
            className="text-[clamp(52px,8vw,96px)] font-black leading-[0.92] tracking-[-0.04em] uppercase text-[#111111]"
            style={{ fontFamily: "var(--font-hanken)" }}
          >
            USTALIĞIN
            <br />
            <span className="text-[#FF4A00]">YENİ</span>
            <br />
            ODAĞI.
          </h1>

          {/* Subtext */}
          <p
            className="text-base leading-relaxed text-[#444748] max-w-md border-l-2 border-[#DFFF00] pl-4"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Sanat ve ticaretin kesiştiği noktada, 29 dükkan ve 3 bloktan oluşan
            Çanakkale&apos;nin en modern iş merkezi. Ustanın eline, zanaatın
            kalbine hoş geldiniz.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-0">
          <a
            href="#dukkanlar"
            className="px-8 py-4 bg-[#111111] text-[#F4F3F0] text-xs tracking-[0.15em] uppercase hover:bg-[#FF4A00] transition-none inline-flex items-center gap-3"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            DÜKKANLARIMIZ →
          </a>
          <a
            href="#konum"
            className="px-8 py-4 border border-[#111111] text-[#111111] text-xs tracking-[0.15em] uppercase hover:bg-[#111111] hover:text-[#F4F3F0] transition-none inline-flex items-center gap-3"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            NASIL GELİNİR?
          </a>
        </div>
      </div>

      {/* Right — Hero image */}
      <div className="relative overflow-hidden min-h-[50vh] md:min-h-0 bg-[#EFEEEB]">
        <Image
          src="/images/hero/hero-main.jpg"
          alt="ASTİM Ticaret Merkezi hava görüntüsü"
          fill
          className="object-cover"
          priority
        />
        {/* Fallback overlay when no image */}
        <div className="absolute inset-0 flex items-center justify-center bg-[#EFEEEB]">
          <div className="text-center">
            <div
              className="text-6xl font-black tracking-[-0.04em] text-[#c4c7c7] uppercase"
              style={{ fontFamily: "var(--font-hanken)" }}
            >
              FOTOĞRAF
            </div>
            <div
              className="text-xs tracking-[0.2em] text-[#c4c7c7] mt-2 uppercase"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              public/images/hero/hero-main.jpg
            </div>
          </div>
        </div>

        {/* REF badge */}
        <div
          className="absolute bottom-4 right-4 bg-[#111111] text-[#F4F3F0] px-3 py-1 text-[9px] tracking-[0.15em] uppercase z-10"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          REF. NO: ATC_2024_001
        </div>
      </div>
    </section>
  );
}
