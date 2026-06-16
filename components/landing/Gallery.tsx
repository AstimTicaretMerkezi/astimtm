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
            className={`relative aspect-[1.6] bg-[#EFEEEB] overflow-hidden ${
              i < photos.length - 1 ? "border-r border-[#111111]" : ""
            }`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover grayscale"
            />
            {/* Foto numarası — görsel yokken görünür */}
            <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-end pointer-events-none">
              <span
                className="text-[9px] font-[700] text-[#c4c7c7] uppercase"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                G-0{i + 1}
              </span>
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
            className={`p-6 flex flex-col justify-between gap-4 group hover:bg-[#111111] transition-none ${
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
