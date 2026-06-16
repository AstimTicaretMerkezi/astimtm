export default function Footer() {
  return (
    <footer className="bg-[#111111] text-[#F4F3F0] grid grid-cols-1 md:grid-cols-2 w-full p-[1rem] md:p-[2.5rem] gap-[32px] border-t border-[#F4F3F0]">
      {/* Left — Brand */}
      <div className="flex flex-col justify-between gap-[32px]">
        <div>
          <h4
            className="text-[48px] leading-[48px] font-[800] tracking-[-0.02em] text-[#FF4A00] mb-[16px] uppercase"
            style={{ fontFamily: "var(--font-hanken)" }}
          >
            ASTİM TİCARET
          </h4>
          <p
            className="text-[14px] leading-[20px] font-[400] tracking-[0.02em] opacity-80 max-w-sm uppercase"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            TÜRKİYE&apos;NİN YENİ ENDÜSTRİYEL ODAĞI. USTALIĞA YATIRIM,
            GELECEĞE İMZA.
          </p>
        </div>
        <p
          className="text-[14px] leading-[20px] font-[400] tracking-[0.02em] opacity-50"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          ©2024 ASTIM TİCARET MERKEZİ. TÜM HAKLARI SAKLIDIR.
        </p>
      </div>

      {/* Right — Links */}
      <div className="grid grid-cols-2 gap-[32px]">
        {/* Social */}
        <div className="flex flex-col gap-2">
          <span
            className="text-[14px] leading-[20px] font-[400] tracking-[0.02em] text-[#FF4A00] mb-2 uppercase"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            BİZİ TAKİP EDİN
          </span>
          {[
            { label: "INSTAGRAM", href: "#" },
            { label: "LINKEDIN", href: "#" },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="text-[#F4F3F0] opacity-80 hover:text-[#FF4A00] hover:opacity-100 transition-none flex items-center gap-2 text-[14px] leading-[20px] font-[400] tracking-[0.02em]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              <span className="text-sm">↗</span> {s.label}
            </a>
          ))}
        </div>

        {/* Corporate */}
        <div className="flex flex-col gap-2">
          <span
            className="text-[14px] leading-[20px] font-[400] tracking-[0.02em] text-[#FF4A00] mb-2 uppercase"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            KURUMSAL
          </span>
          {[
            { label: "GİZLİLİK POLİTİKASI", href: "/gizlilik" },
            { label: "SITE MAP", href: "/site-haritasi" },
            { label: "YÖNETİM GİRİŞİ", href: "/giris" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[#F4F3F0] opacity-80 hover:text-[#FF4A00] hover:opacity-100 transition-none text-[14px] leading-[20px] font-[400] tracking-[0.02em]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
