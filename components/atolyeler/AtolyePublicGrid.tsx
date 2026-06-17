"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

type Firm = {
  subId: number;
  businessName: string | null;
  ownerName: string | null;
  category: string | null;
  logo: string | null;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  whatsapp: string | null;
  description: string | null;
  address: string | null;
  workingHours: string | null;
  brands: string[];
  isActive: boolean;
};

type Shop = { id: string; no: number; firms: Firm[] };
type Block = { label: string; shops: Shop[] };
type Blocks = Record<string, Block>;

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function AtolyeDetailModal({
  firmId,
  firm,
  onClose,
}: {
  firmId: string;
  firm: Firm;
  onClose: () => void;
}) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  const contactItems = [
    firm.phone && { label: "TELEFON", value: firm.phone, href: `tel:${firm.phone}`, external: false },
    firm.whatsapp && { label: "WHATSAPP", value: firm.whatsapp, href: `https://wa.me/${firm.whatsapp.replace(/\D/g, "")}`, external: true },
    firm.instagram && {
      label: "INSTAGRAM",
      value: firm.instagram.startsWith("@") ? firm.instagram : `@${firm.instagram}`,
      href: `https://instagram.com/${firm.instagram.replace("@", "")}`,
      external: true,
    },
    firm.website && { label: "WEBSİTE", value: firm.website.replace(/^https?:\/\//, ""), href: firm.website, external: true },
    firm.address && { label: "ADRES", value: firm.address, href: `https://maps.google.com/?q=${encodeURIComponent(firm.address)}`, external: true },
  ].filter(Boolean) as { label: string; value: string; href: string; external: boolean }[];

  const workingDays = firm.workingHours
    ? firm.workingHours.split(",").map((e) => {
        const colonIdx = e.trim().indexOf(": ");
        if (colonIdx === -1) return null;
        return { day: e.trim().slice(0, colonIdx), hours: e.trim().slice(colonIdx + 2) };
      }).filter(Boolean) as { day: string; hours: string }[]
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-6"
      style={{ backgroundColor: "rgba(17,17,17,0.75)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#F4F3F0] border-t md:border border-[#111111] w-full md:w-[80vw] md:max-w-5xl flex flex-col max-h-[92vh] md:max-h-[88vh]">

        {/* Header */}
        <div className="bg-[#111111] px-6 md:px-10 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-5 min-w-0">
            {firm.logo && (
              <div className="w-14 h-14 relative flex-shrink-0 bg-[#F4F3F0] border border-[#F4F3F0]/20 overflow-hidden">
                <Image src={firm.logo} alt="Logo" fill className="object-contain p-1.5" sizes="56px" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <span className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#FF4A00]" style={{ fontFamily: "var(--font-space-mono)" }}>
                  {firmId}
                </span>
                {firm.category && (
                  <span className="text-[9px] font-[700] tracking-[0.1em] uppercase px-2 py-1 bg-[#DFFF00] text-[#111111]" style={{ fontFamily: "var(--font-space-mono)" }}>
                    {firm.category.toUpperCase()}
                  </span>
                )}
              </div>
              <h2 className="text-[22px] md:text-[32px] font-[900] tracking-[-0.03em] uppercase text-[#F4F3F0] leading-none truncate" style={{ fontFamily: "var(--font-hanken)" }}>
                {firm.businessName}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 ml-6 w-10 h-10 flex items-center justify-center border border-[#F4F3F0]/20 text-[#F4F3F0]/50 hover:border-[#FF4A00] hover:text-[#FF4A00] text-[16px] font-[700] transition-none"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">

          {firm.description && (
            <div className="border-b border-[#111111] px-6 md:px-10 py-6">
              <p className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878] mb-3" style={{ fontFamily: "var(--font-space-mono)" }}>HAKKINDA</p>
              <p className="text-[15px] md:text-[16px] leading-[26px] text-[#111111]" style={{ fontFamily: "var(--font-inter)" }}>{firm.description}</p>
            </div>
          )}

          {/* Brands */}
          {firm.brands && firm.brands.length > 0 && (
            <div className="border-b border-[#111111] px-6 md:px-10 py-6">
              <p className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878] mb-4" style={{ fontFamily: "var(--font-space-mono)" }}>MARKALAR / DİSTRİBÜTÖRLER</p>
              <div className="flex flex-wrap gap-2">
                {firm.brands.map((brand) => (
                  <span key={brand} className="border border-[#111111] px-3 py-1.5 text-[12px] font-[700] uppercase" style={{ fontFamily: "var(--font-space-mono)" }}>
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact + Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2">

            {contactItems.length > 0 && (
              <div className="border-b md:border-b-0 md:border-r border-[#111111]">
                <div className="px-6 md:px-10 py-4 border-b border-[#111111]">
                  <span className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>İLETİŞİM</span>
                </div>
                {contactItems.map((item, i) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className={`flex items-center gap-4 px-6 md:px-10 py-5 group hover:bg-[#111111] transition-none ${i < contactItems.length - 1 ? "border-b border-[#111111]" : ""}`}
                  >
                    <span className="text-[10px] font-[700] tracking-[0.12em] uppercase text-[#747878] group-hover:text-[#F4F3F0]/40 w-24 flex-shrink-0 transition-none" style={{ fontFamily: "var(--font-space-mono)" }}>{item.label}</span>
                    <span className="text-[14px] text-[#111111] group-hover:text-[#F4F3F0] flex-1 min-w-0 break-words transition-none" style={{ fontFamily: "var(--font-inter)" }}>{item.value}</span>
                    <span className="text-[#FF4A00] text-[14px] font-[700] flex-shrink-0 transition-none">↗</span>
                  </a>
                ))}
              </div>
            )}

            {workingDays.length > 0 && (
              <div>
                <div className="px-6 md:px-10 py-4 border-b border-[#111111]">
                  <span className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>ÇALIŞMA SAATLERİ</span>
                </div>
                {workingDays.map((entry, i) => {
                  const isOpen = entry.hours !== "Kapalı";
                  return (
                    <div key={entry.day} className={`flex items-center justify-between px-6 md:px-10 py-4 ${i < workingDays.length - 1 ? "border-b border-[#111111]" : ""}`}>
                      <span className="text-[12px] font-[700] uppercase text-[#111111] w-28" style={{ fontFamily: "var(--font-space-mono)" }}>{entry.day}</span>
                      <span className={`text-[12px] font-[700] ${isOpen ? "text-[#111111]" : "text-[#c4c7c7]"}`} style={{ fontFamily: "var(--font-space-mono)" }}>{isOpen ? entry.hours : "KAPALI"}</span>
                      {isOpen && <span className="text-[9px] px-2 py-0.5 bg-[#DFFF00] text-[#111111] font-[700] uppercase" style={{ fontFamily: "var(--font-space-mono)" }}>AÇIK</span>}
                    </div>
                  );
                })}
              </div>
            )}

            {contactItems.length === 0 && workingDays.length === 0 && !firm.description && (
              <div className="col-span-2 px-10 py-12 text-center">
                <p className="text-[12px] text-[#c4c7c7] uppercase" style={{ fontFamily: "var(--font-space-mono)" }}>İletişim bilgisi henüz eklenmedi</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#111111] px-6 md:px-10 py-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full border border-[#111111] text-[#111111] px-6 py-3.5 text-[11px] font-[700] tracking-[0.1em] uppercase hover:bg-[#111111] hover:text-[#F4F3F0] transition-none"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            KAPAT
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function FirmCard({
  firmId,
  firm,
  onClick,
}: {
  firmId: string;
  firm: Firm | null; // null = empty shop slot
  onClick?: () => void;
}) {
  const isEmpty = !firm || !firm.businessName;

  return (
    <div
      onClick={isEmpty ? undefined : onClick}
      className={`border-r border-b border-[#111111] p-6 flex flex-col justify-between gap-4 min-h-[180px] transition-none ${
        isEmpty ? "bg-[#F4F3F0]" : "bg-[#F4F3F0] hover:bg-[#111111] cursor-pointer group"
      }`}
    >
      {/* Top */}
      <div className="flex items-start justify-between gap-2">
        <span
          className={`text-[10px] font-[700] tracking-[0.1em] uppercase px-2 py-1 border transition-none ${
            isEmpty ? "border-[#c4c7c7] text-[#c4c7c7]" : "border-[#FF4A00] text-[#FF4A00]"
          }`}
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          {firmId}
        </span>
        <div className="flex items-center gap-2">
          {firm?.logo && (
            <div className="w-8 h-8 relative flex-shrink-0 bg-[#EFEEEB] overflow-hidden border border-[#c4c7c7]">
              <Image src={firm.logo} alt="Logo" fill className="object-contain p-0.5" sizes="32px" />
            </div>
          )}
          {firm?.category && (
            <span className="text-[9px] font-[700] tracking-[0.1em] uppercase px-2 py-1 bg-[#DFFF00] text-[#111111]" style={{ fontFamily: "var(--font-space-mono)" }}>
              {firm.category.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Middle */}
      <div className="flex-1">
        {isEmpty ? (
          <>
            <div className="text-[#c4c7c7] text-lg font-[900] tracking-[-0.02em] uppercase leading-tight" style={{ fontFamily: "var(--font-hanken)" }}>
              {firmId}
            </div>
            <div className="text-[#c4c7c7] text-[9px] tracking-[0.1em] uppercase mt-1" style={{ fontFamily: "var(--font-space-mono)" }}>
              Boş
            </div>
          </>
        ) : (
          <>
            <div className="text-[#111111] group-hover:text-[#F4F3F0] text-lg font-[900] tracking-[-0.02em] uppercase leading-tight transition-none" style={{ fontFamily: "var(--font-hanken)" }}>
              {firm.businessName}
            </div>
            {firm.description && (
              <div className="text-[#747878] group-hover:text-[#F4F3F0]/50 text-[11px] mt-1 line-clamp-2 transition-none" style={{ fontFamily: "var(--font-inter)" }}>
                {firm.description}
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom */}
      {!isEmpty && (
        <div className="flex items-center justify-between border-t border-[#EFEEEB] group-hover:border-[#F4F3F0]/10 pt-3 transition-none">
          <div className="flex items-center gap-3">
            {firm?.phone && <span className="text-[9px] font-[700] tracking-[0.1em] uppercase text-[#747878] group-hover:text-[#F4F3F0]/50 transition-none" style={{ fontFamily: "var(--font-space-mono)" }}>☎</span>}
            {firm?.instagram && <span className="text-[9px] font-[700] tracking-[0.1em] uppercase text-[#747878] group-hover:text-[#F4F3F0]/50 transition-none" style={{ fontFamily: "var(--font-space-mono)" }}>IG</span>}
          </div>
          <span className="text-[10px] font-[700] text-[#FF4A00] transition-none" style={{ fontFamily: "var(--font-space-mono)" }}>
            DETAY →
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Main Grid ────────────────────────────────────────────────────────────────

export default function AtolyePublicGrid({ blocks }: { blocks: Blocks }) {
  const [selectedFirmId, setSelectedFirmId] = useState<string | null>(null);

  type CardEntry = { firmId: string; firm: Firm | null };

  function shopToCards(shop: Shop): CardEntry[] {
    const firms = shop.firms ?? [];
    if (firms.length === 0) return [{ firmId: shop.id, firm: null }];
    return firms.map((f) => ({ firmId: `${shop.id}.${f.subId}`, firm: f }));
  }

  const allCards: CardEntry[] = Object.values(blocks).flatMap((b) =>
    b.shops.flatMap(shopToCards)
  );

  const activeFirms = allCards.filter((c) => c.firm?.isActive).length;
  const totalCards = allCards.length;

  const selectedFirm = selectedFirmId
    ? allCards.find((c) => c.firmId === selectedFirmId)?.firm ?? null
    : null;

  return (
    <>
      <section id="atolyeler" className="col-span-12 border-b border-[#111111]">

        {/* Section header */}
        <div className="border-b border-[#111111] px-6 py-4 flex items-baseline justify-between">
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#111111]" style={{ fontFamily: "var(--font-space-mono)" }}>ATÖLYELERİMİZ</span>
          <span className="text-[9px] tracking-[0.1em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>
            {activeFirms} AKTİF // {totalCards} TOPLAM // 3 BLOK
          </span>
        </div>

        {Object.entries(blocks).map(([blockKey, block]) => {
          const blockCards: CardEntry[] = block.shops.flatMap(shopToCards);
          const blockActive = blockCards.filter((c) => c.firm?.isActive).length;

          return (
            <div key={blockKey} className="border-b border-[#111111]">
              <div className="bg-[#111111] px-6 py-4 flex items-center justify-between">
                <span className="text-[#F4F3F0] text-sm font-[700] tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-space-mono)" }}>
                  {block.label}
                </span>
                <span className="text-[#DFFF00] text-[9px] tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-space-mono)" }}>
                  {blockActive} AKTİF / {block.shops.length} ATÖLYE
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 border-l border-t border-[#111111]">
                {blockCards.map((card) => (
                  <FirmCard
                    key={card.firmId}
                    firmId={card.firmId}
                    firm={card.firm}
                    onClick={card.firm?.businessName ? () => setSelectedFirmId(card.firmId) : undefined}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {selectedFirmId && selectedFirm?.businessName && (
        <AtolyeDetailModal
          firmId={selectedFirmId}
          firm={selectedFirm}
          onClose={() => setSelectedFirmId(null)}
        />
      )}
    </>
  );
}
