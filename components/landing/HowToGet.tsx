export default function HowToGet() {
  return (
    <section id="konum" className="col-span-12 border-b border-[#111111]">
      {/* Section header */}
      <div className="border-b border-[#111111] px-6 py-4 flex items-baseline justify-between">
        <span
          className="text-[10px] tracking-[0.2em] uppercase text-[#111111]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          NASIL GELİNİR?
        </span>
        <span
          className="text-[9px] tracking-[0.1em] uppercase text-[#595C5C]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          LOCATION: ÇANAKKALE // MERKEZ
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left — Address */}
        <div className="p-[2rem] md:p-[2.5rem] flex flex-col justify-between gap-8 border-b md:border-b-0 md:border-r border-[#111111]">
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
                { label: "ADRES", value: "Çan Yolu 2.sk Karacaören Mah. Merkez Çanakkale, Türkiye" },
                { label: "TELEFON", value: "+90 532 221 52 14" },
                { label: "E-POSTA", value: "astimticaretmerkezi@gmail.com" },
                { label: "ÇALIŞMA SAATLERİ", value: "Pzt–Pz 08:00–22:00" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-[#111111] gap-1"
                >
                  <span
                    className="text-[9px] tracking-[0.15em] uppercase text-[#595C5C]"
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
            href="https://www.google.com/maps/dir/?api=1&destination=40.14521043444345,26.45483170305124&travelmode=driving"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-[#FF4A00] text-[#F4F3F0] text-xs tracking-[0.15em] uppercase hover:bg-[#111111] transition-none inline-flex items-center gap-3 self-start"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            YOL TARİFİ AL →
          </a>
        </div>

        {/* Right — Map */}
        <div className="relative min-h-[400px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d788.9222922772549!2d26.45483170305124!3d40.14521043444345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1str!2str!4v1781804196876!5m2!1str!2str"
            title="ASTİM Ticaret Merkezi - Google Haritalar"
            width="100%"
            height="100%"
            style={{ border: 0, position: "absolute", inset: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Corner badge */}
          <div
            className="absolute top-4 right-4 bg-[#111111] text-[#F4F3F0] px-3 py-1 text-[9px] tracking-[0.1em] uppercase z-10"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            ÇANAKKALE // TR
          </div>
        </div>
      </div>
    </section>
  );
}
