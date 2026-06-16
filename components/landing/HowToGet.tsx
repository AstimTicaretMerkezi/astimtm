export default function HowToGet() {
  return (
    <section id="konum" className="border-b border-[#111111]">
      {/* Section header */}
      <div className="border-b border-[#111111] px-6 py-4 flex items-baseline justify-between">
        <span
          className="text-[10px] tracking-[0.2em] uppercase text-[#111111]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          NASIL GELİNİR?
        </span>
        <span
          className="text-[9px] tracking-[0.1em] uppercase text-[#747878]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          LOCATION: ÇANAKKALE // MERKEZ
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left — Address */}
        <div className="p-8 md:p-12 flex flex-col justify-between gap-8 border-b md:border-b-0 md:border-r border-[#111111]">
          <div>
            <div
              className="text-[#FF4A00] text-[9px] tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              ADRES BİLGİLERİ
            </div>

            <h2
              className="text-[clamp(36px,5vw,64px)] font-black tracking-[-0.03em] uppercase leading-none text-[#111111] mb-8"
              style={{ fontFamily: "var(--font-hanken)" }}
            >
              ASTİM
              <br />
              TİCARET
              <br />
              MERKEZİ
            </h2>

            <div className="flex flex-col gap-0 border-t border-[#111111]">
              {[
                { label: "ADRES", value: "Çanakkale, Türkiye" },
                { label: "TELEFON", value: "—" },
                { label: "E-POSTA", value: "—" },
                { label: "ÇALIŞMA SAATLERİ", value: "Pzt–Cts 09:00–18:00" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-[#111111] gap-1"
                >
                  <span
                    className="text-[9px] tracking-[0.15em] uppercase text-[#747878]"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="text-xs text-[#111111]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-[#FF4A00] text-[#F4F3F0] text-xs tracking-[0.15em] uppercase hover:bg-[#111111] transition-none inline-flex items-center gap-3 self-start"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            HARİTADA GÖRÜNTÜLE →
          </a>
        </div>

        {/* Right — Map placeholder */}
        <div className="relative min-h-[400px] bg-[#EFEEEB] flex items-center justify-center">
          <div className="text-center">
            <div
              className="text-4xl font-black tracking-[-0.04em] text-[#c4c7c7] uppercase mb-2"
              style={{ fontFamily: "var(--font-hanken)" }}
            >
              HARİTA
            </div>
            <div
              className="text-[9px] tracking-[0.15em] text-[#c4c7c7] uppercase"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Google Maps embed buraya gelecek
            </div>
          </div>

          {/* Corner badge */}
          <div
            className="absolute top-4 right-4 bg-[#111111] text-[#F4F3F0] px-3 py-1 text-[9px] tracking-[0.1em] uppercase"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            ÇANAKKALE // TR
          </div>
        </div>
      </div>
    </section>
  );
}
