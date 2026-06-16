export default function Gallery() {
  const cards = [
    {
      id: "001",
      label: "ASTİM TİCARET MERKEZİ SANAL TUR",
      title: "GALERİ",
      location: "ÇANAKKALE",
      total: "6",
      href: "#galeri",
    },
    {
      id: "002",
      label: "YOL TARİFİ ALMAK İÇİN DOKUNUN",
      title: "NASIL GELİNİR?",
      location: "MERKEZ",
      total: "10",
      href: "#konum",
    },
  ];

  return (
    <section id="galeri" className="border-b border-[#111111]">
      {/* Section header */}
      <div className="border-b border-[#111111] px-6 py-4 flex items-baseline justify-between">
        <span
          className="text-[10px] tracking-[0.2em] uppercase text-[#111111]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          GALERİ & KONUM
        </span>
        <span
          className="text-[9px] tracking-[0.1em] uppercase text-[#747878]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          ATC — 2024
        </span>
      </div>

      {/* Gallery images */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#111111]">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="relative overflow-hidden aspect-[4/3] bg-[#EFEEEB] border-r border-[#111111] last:border-r-0"
          >
            <div className="absolute inset-0 flex items-end p-3">
              <span
                className="text-[9px] tracking-[0.1em] uppercase text-[#c4c7c7]"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                gallery/g-0{i}.jpg
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Cards row */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {cards.map((card, idx) => (
          <a
            key={card.id}
            href={card.href}
            className={`p-8 md:p-10 flex flex-col justify-between gap-6 group hover:bg-[#111111] transition-none border-b md:border-b-0 ${
              idx === 0 ? "border-b md:border-b-0 md:border-r border-[#111111]" : ""
            }`}
          >
            <div>
              <div
                className="text-[#FF4A00] text-[9px] tracking-[0.2em] uppercase mb-3 group-hover:text-[#FF4A00]"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {card.label}
              </div>
              <h3
                className="text-[clamp(36px,5vw,56px)] font-black tracking-[-0.03em] uppercase leading-none text-[#111111] group-hover:text-[#F4F3F0]"
                style={{ fontFamily: "var(--font-hanken)" }}
              >
                {card.title}
              </h3>
              <div className="border-t border-[#111111] group-hover:border-[#2f312f] mt-4" />
            </div>
            <div className="flex items-center justify-between">
              <span
                className="text-[9px] tracking-[0.15em] uppercase text-[#747878] group-hover:text-[#747878]"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                LOCATION: {card.location}
              </span>
              <span
                className="text-[9px] tracking-[0.15em] uppercase text-[#747878] group-hover:text-[#747878]"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                ID: {card.id}/{card.total}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
