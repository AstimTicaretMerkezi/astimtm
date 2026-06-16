import Image from "next/image";

const cards = [
  {
    id: "001",
    total: "6",
    label: "ASTİM TİCARET MERKEZİ SANAL TUR",
    title: "GALERİ",
    location: "ÇANAKKALE",
    href: "#galeri",
    img: "/images/gallery/g-01.jpg",
    imgAlt: "ASTİM Ticaret Merkezi galerisi",
  },
  {
    id: "002",
    total: "10",
    label: "YOL TARİFİ ALMAK İÇİN DOKUNUN",
    title: "NASIL GELİNİR?",
    location: "MERKEZ",
    href: "#konum",
    img: "/images/gallery/g-02.jpg",
    imgAlt: "ASTİM Ticaret Merkezi konumu",
  },
];

export default function Gallery() {
  return (
    <section id="galeri" className="md:col-span-8 border-b border-[#111111] bg-[#F4F3F0]">
      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
        {cards.map((card, idx) => (
          <a
            key={card.id}
            href={card.href}
            className={`flex flex-col group ${
              idx === 0 ? "border-b md:border-b-0 md:border-r border-[#111111]" : ""
            }`}
          >
            {/* Image */}
            <div className="p-6 border-b border-[#111111]">
              <div className="relative w-full aspect-[1.9] bg-[#EFEEEB] overflow-hidden">
                <Image
                  src={card.img}
                  alt={card.imgAlt}
                  fill
                  className="object-cover grayscale"
                />
                {/* Fallback */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-[12px] font-[700] text-[#c4c7c7] uppercase"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                  >
                    {card.img.replace("/images/", "")}
                  </span>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="p-6 flex-grow flex flex-col justify-between group-hover:bg-[#111111] transition-none">
              <div>
                <p
                  className="text-[12px] leading-[16px] font-[700] text-[#FF4A00] mb-2 uppercase"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  {card.label}
                </p>
                <h3
                  className="text-[32px] md:text-[48px] leading-[32px] md:leading-[48px] font-[800] tracking-[-0.02em] uppercase mb-4 group-hover:text-[#F4F3F0] transition-none"
                  style={{ fontFamily: "var(--font-hanken)" }}
                >
                  {card.title}
                </h3>
              </div>
              <div
                className="flex justify-between text-[12px] leading-[16px] font-[700] border-t border-[#111111] group-hover:border-[#F4F3F0]/20 pt-4 mt-4 transition-none"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                <span className="group-hover:text-[#F4F3F0]/60 transition-none">
                  LOCATION: {card.location}
                </span>
                <span className="group-hover:text-[#F4F3F0]/60 transition-none">
                  ID: {card.id}/{card.total}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
