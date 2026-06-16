import Image from "next/image";

const photos = [
  { src: "/images/gallery/G-01.png", alt: "ASTİM Ticaret Merkezi - 1" },
  { src: "/images/gallery/G-02.png", alt: "ASTİM Ticaret Merkezi - 2" },
  { src: "/images/gallery/G-03.png", alt: "ASTİM Ticaret Merkezi - 3" },
];

const cards = [
  {
    id: "001",
    total: "6",
    label: "ASTİM TİCARET MERKEZİ SANAL TUR",
    title: "GALERİ",
    location: "ÇANAKKALE",
    href: "#galeri",
  },
  {
    id: "002",
    total: "10",
    label: "YOL TARİFİ ALMAK İÇİN DOKUNUN",
    title: "NASIL GELİNİR?",
    location: "MERKEZ",
    href: "#konum",
  },
];

export default function Gallery() {
  return (
    <section id="galeri" className="md:col-span-8 border-b border-[#111111] bg-[#F4F3F0]">
      {/* Fotoğraf şeridi — 3 eşit kolon */}
      <div className="grid grid-cols-3 border-b border-[#111111]">
        {photos.map((photo, i) => (
          <div
            key={photo.src}
            className={`p-6 bg-[#F4F3F0] ${i < 2 ? "border-r border-[#111111]" : ""}`}
          >
            <div className="relative aspect-[1.6] bg-[#EFEEEB] overflow-hidden">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 33vw, 27vw"
                className="object-cover grayscale"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Alt kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {cards.map((card, idx) => (
          <a
            key={card.id}
            href={card.href}
            className={`p-8 md:p-10 min-h-[220px] md:min-h-[260px] flex flex-col justify-between gap-4 group hover:bg-[#111111] transition-none ${
              idx === 0 ? "border-b md:border-b-0 md:border-r border-[#111111]" : ""
            }`}
          >
            <div>
              <p
                className="text-[12px] leading-[16px] font-[700] text-[#FF4A00] mb-2 uppercase"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {card.label}
              </p>
              <h3
                className="text-[32px] md:text-[48px] leading-[32px] md:leading-[48px] font-[800] tracking-[-0.02em] uppercase group-hover:text-[#F4F3F0] transition-none"
                style={{ fontFamily: "var(--font-hanken)" }}
              >
                {card.title}
              </h3>
            </div>
            <div
              className="flex justify-between text-[12px] leading-[16px] font-[700] border-t border-[#111111] group-hover:border-[#F4F3F0]/20 pt-4 transition-none"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              <span className="group-hover:text-[#F4F3F0]/60 transition-none">
                LOCATION: {card.location}
              </span>
              <span className="group-hover:text-[#F4F3F0]/60 transition-none">
                ID: {card.id}/{card.total}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
