export default function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-[#111111]">
      {/* Main footer content */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-b border-[#2f312f]">
        {/* Brand */}
        <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-[#2f312f]">
          <div
            className="text-[#FF4A00] text-[clamp(32px,5vw,52px)] font-black tracking-[-0.03em] uppercase leading-none mb-4"
            style={{ fontFamily: "var(--font-hanken)" }}
          >
            ASTİM
            <br />
            TİCARET
          </div>
          <p
            className="text-[#747878] text-[10px] tracking-[0.1em] uppercase leading-relaxed max-w-[220px]"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            TÜRKİYE&apos;NİN YENİ ENDÜSTRİYEL ODAĞI. USTALIĞA YATIRIM,
            GELECEĞE İMZA.
          </p>
        </div>

        {/* Social */}
        <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-[#2f312f]">
          <div
            className="text-[#FF4A00] text-[9px] tracking-[0.2em] uppercase mb-6"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            BİZİ TAKİP EDİN
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: "INSTAGRAM", href: "#" },
              { label: "LINKEDIN", href: "#" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="text-[#F4F3F0] text-xs tracking-[0.15em] uppercase hover:text-[#FF4A00] transition-none flex items-center gap-2"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                <span className="text-[#747878]">↗</span> {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Corporate */}
        <div className="p-8 md:p-10">
          <div
            className="text-[#FF4A00] text-[9px] tracking-[0.2em] uppercase mb-6"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            KURUMSAL
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: "GİZLİLİK POLİTİKASI", href: "/gizlilik" },
              { label: "SITE MAP", href: "/site-haritasi" },
              { label: "YÖNETİM GİRİŞİ", href: "/giris" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-[#F4F3F0] text-xs tracking-[0.15em] uppercase hover:text-[#FF4A00] transition-none"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <span
          className="text-[#747878] text-[9px] tracking-[0.1em] uppercase"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          ©2024 ASTIM TİCARET MERKEZİ. TÜM HAKLARI SAKLIDIR.
        </span>
        <span
          className="text-[#747878] text-[9px] tracking-[0.1em] uppercase"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          astimticaretmerkezi.com
        </span>
      </div>
    </footer>
  );
}
