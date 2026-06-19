"use client";

import { useState } from "react";
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
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <section id="galeri" className="md:col-span-12 border-b border-[#111111] bg-[#F4F3F0] flex flex-col">

      {/* Fotoğraf şeridi — her zaman üstte */}
      <div className="grid grid-cols-3 border-b border-[#111111]">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setLightbox(photo.src)}
            className={`p-3 md:p-6 bg-[#F4F3F0] hover:bg-[#EFEEEB] transition-none ${i < 2 ? "border-r border-[#111111]" : ""}`}
          >
            <div className="relative aspect-[1.4] md:aspect-[1.6] bg-[#EFEEEB] overflow-hidden">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 33vw, 27vw"
                className="object-cover grayscale hover:grayscale-0 transition-none"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-[#111111]/30 transition-none">
                <span className="text-[#F4F3F0] text-[10px] font-[700] tracking-[0.15em]" style={{ fontFamily: "var(--font-space-mono)" }}>
                  BÜYÜT
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Kartlar — fotoğrafların altında */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {cards.map((card, idx) => (
          <a
            key={card.id}
            href={card.href}
            className={`p-8 md:p-10 min-h-[180px] md:min-h-[260px] flex flex-col justify-between gap-4 group hover:bg-[#111111] transition-none ${
              idx === 0 ? "border-b md:border-b-0 md:border-r border-[#111111]" : ""
            }`}
          >
            <div>
              <p className="text-[12px] leading-[16px] font-[700] text-[#FF4A00] mb-2 uppercase" style={{ fontFamily: "var(--font-space-mono)" }}>
                {card.label}
              </p>
              <h3 className="text-[28px] md:text-[48px] leading-tight font-[800] tracking-[-0.02em] uppercase group-hover:text-[#F4F3F0] transition-none" style={{ fontFamily: "var(--font-hanken)" }}>
                {card.title}
              </h3>
            </div>
            <div className="flex justify-between text-[12px] leading-[16px] font-[700] border-t border-[#111111] group-hover:border-[#F4F3F0]/20 pt-4 transition-none" style={{ fontFamily: "var(--font-space-mono)" }}>
              <span className="group-hover:text-[#F4F3F0]/60 transition-none">LOCATION: {card.location}</span>
              <span className="group-hover:text-[#F4F3F0]/60 transition-none">ID: {card.id}/{card.total}</span>
            </div>
          </a>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(17,17,17,0.92)" }}
          onClick={() => setLightbox(null)}
        >
          <div className="relative w-full max-w-3xl max-h-[85vh] aspect-[1.6]">
            <Image
              src={lightbox}
              alt="Galeri"
              fill
              sizes="(max-width: 768px) 95vw, 768px"
              className="object-contain"
            />
          </div>
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 text-[#F4F3F0]/60 hover:text-[#FF4A00] text-[24px] font-[700] leading-none transition-none"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}
