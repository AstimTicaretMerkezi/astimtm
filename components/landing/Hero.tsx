"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const heroImages = [
  { src: "/images/hero/hero-main.png",  alt: "ASTİM Ticaret Merkezi" },
  { src: "/images/hero/hero-main2.png", alt: "ASTİM Ticaret Merkezi hava görüntüsü" },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="col-span-12 border-b border-[#111111] relative overflow-hidden flex flex-col md:flex-row">
      {/* Left — Text */}
      <div className="w-full md:w-1/2 p-[1rem] md:p-[2.5rem] flex flex-col justify-center border-r border-[#111111] bg-[#F4F3F0] relative z-10">

        {/* Status label */}
        <div className="flex items-center gap-2 mb-[32px]">
          <span className="w-3 h-3 bg-[#FF4A00] animate-pulse flex-shrink-0" />
          <p
            className="text-[12px] leading-[16px] font-[700] uppercase tracking-widest"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            SİSTEM DURUMU: AKTİF
          </p>
        </div>

        {/* Headline */}
        <h1
          className="text-[32px] md:text-[80px] leading-[32px] md:leading-[72px] font-[900] tracking-[-0.04em] uppercase mb-[16px]"
          style={{ fontFamily: "var(--font-hanken)" }}
        >
          USTALIĞIN
          <br />
          <span className="text-[#FF4A00]">YENİ</span>
          <br />
          ODAĞI.
        </h1>

        {/* Body */}
        <p
          className="text-[16px] leading-[24px] font-[400] max-w-md mb-[32px] opacity-80"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Sanat ve ticaretin kesiştiği noktada, 29 dükkan ve 3 bloktan oluşan
          Çanakkale&apos;nin en modern iş merkezi. Ustanın eline, zanaatın
          kalbine hoş geldiniz.
        </p>

        {/* CTA butonları */}
        <div className="flex flex-col sm:flex-row gap-[8px] mt-auto">
          <a
            href="#dukkanlar"
            className="bg-[#111111] text-[#F4F3F0] px-10 py-5 text-[12px] leading-[16px] font-[700] uppercase hover:bg-[#FF4A00] transition-none flex items-center gap-2"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            HABERDAR OL →
          </a>
          <a
            href="#dukkanlar"
            className="border border-[#111111] text-[#111111] px-10 py-5 text-[12px] leading-[16px] font-[700] uppercase hover:bg-[#111111] hover:text-[#F4F3F0] transition-none flex items-center gap-2"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            DÜKKANLARIMIZ →
          </a>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center gap-2 mt-[16px]">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-[2px] transition-none ${
                i === current ? "w-8 bg-[#FF4A00]" : "w-4 bg-[#111111] opacity-30"
              }`}
              aria-label={`Görsel ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Right — Sliding images */}
      <div className="w-full md:w-1/2 min-h-[300px] md:min-h-[500px] relative bg-[#EFEEEB]">
        <div className="absolute inset-0 bg-[#111111]/10 z-10 pointer-events-none" />

        {heroImages.map((img, i) => (
          <div
            key={img.src}
            className="absolute inset-0"
            style={{
              opacity: i === current ? 1 : 0,
              transition: "opacity 1.2s ease-in-out",
              zIndex: i === current ? 2 : 1,
            }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover object-center"
              priority={i === 0}
            />
          </div>
        ))}

        {/* Fallback */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div className="text-center p-4">
            <div
              className="text-[clamp(24px,4vw,48px)] font-[900] tracking-[-0.04em] text-[#c4c7c7] uppercase"
              style={{ fontFamily: "var(--font-hanken)" }}
            >
              FOTOĞRAF
            </div>
            <div
              className="text-[11px] font-[700] text-[#c4c7c7] mt-2 uppercase"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              hero-main.png / hero-main2.png
            </div>
          </div>
        </div>

        {/* REF badge */}
        <div
          className="absolute bottom-0 right-0 p-4 bg-[#111111] text-[#F4F3F0] text-[12px] leading-[16px] font-[700] z-20"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          REF. NO: ATC_2024_001
        </div>
      </div>
    </section>
  );
}
