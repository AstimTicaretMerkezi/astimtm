"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

type Firm = {
  subId: number;
  businessName: string | null;
  ownerName: string | null;
  contactPerson: string | null;
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
type CardEntry = { firmId: string; firm: Firm | null };

function maskPhone(phone: string): string {
  const clean = phone.replace(/\s/g, "");
  if (clean.length < 7) return phone;
  return phone.slice(0, phone.length - 5) + "-- --";
}

function shortDesc(desc: string | null): string {
  if (!desc) return "BELİRTİLMEMİŞ";
  return desc.length > 32 ? desc.slice(0, 32) + "…" : desc;
}

// ─── Detail Modal ──────────────────────────────────────────────────────────────

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
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
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
        const idx = e.trim().indexOf(": ");
        if (idx === -1) return null;
        return { day: e.trim().slice(0, idx), hours: e.trim().slice(idx + 2) };
      }).filter(Boolean) as { day: string; hours: string }[]
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-6"
      style={{ backgroundColor: "rgba(17,17,17,0.75)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#F4F3F0] border-t md:border border-[#111111] w-full md:w-[80vw] md:max-w-5xl flex flex-col max-h-[92vh] md:max-h-[88vh]">
        <div className="bg-[#111111] px-6 md:px-10 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-5 min-w-0">
            {firm.logo && (
              <div className="w-14 h-14 relative flex-shrink-0 bg-[#F4F3F0] border border-[#F4F3F0]/20 overflow-hidden">
                <Image src={firm.logo} alt="Logo" fill className="object-contain p-1.5" sizes="56px" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <span className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#FF4A00]" style={{ fontFamily: "var(--font-space-mono)" }}>{firmId}</span>
                {firm.category && (
                  <span className="text-[9px] font-[700] tracking-[0.1em] uppercase px-2 py-1 bg-[#DFFF00] text-[#111111]" style={{ fontFamily: "var(--font-space-mono)" }}>{firm.category.toUpperCase()}</span>
                )}
              </div>
              <h2 className="text-[22px] md:text-[32px] font-[900] tracking-[-0.03em] uppercase text-[#F4F3F0] leading-none truncate" style={{ fontFamily: "var(--font-hanken)" }}>
                {firm.businessName}
              </h2>
              {firm.contactPerson && (
                <p className="text-[11px] text-[#F4F3F0]/50 mt-1 tracking-[0.08em] uppercase" style={{ fontFamily: "var(--font-space-mono)" }}>{firm.contactPerson}</p>
              )}
            </div>
          </div>
          <button type="button" onClick={onClose} className="flex-shrink-0 ml-6 w-10 h-10 flex items-center justify-center border border-[#F4F3F0]/20 text-[#F4F3F0]/50 hover:border-[#FF4A00] hover:text-[#FF4A00] text-[16px] font-[700] transition-none">✕</button>
        </div>

        <div className="overflow-y-auto flex-1">
          {firm.description && (
            <div className="border-b border-[#111111] px-6 md:px-10 py-6">
              <p className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878] mb-3" style={{ fontFamily: "var(--font-space-mono)" }}>HAKKINDA</p>
              <p className="text-[15px] md:text-[16px] leading-[26px] text-[#111111]" style={{ fontFamily: "var(--font-inter)" }}>{firm.description}</p>
            </div>
          )}
          {firm.brands && firm.brands.length > 0 && (
            <div className="border-b border-[#111111] px-6 md:px-10 py-6">
              <p className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878] mb-4" style={{ fontFamily: "var(--font-space-mono)" }}>MARKALAR / DİSTRİBÜTÖRLER</p>
              <div className="flex flex-wrap gap-2">
                {firm.brands.map((brand) => (
                  <span key={brand} className="border border-[#111111] px-3 py-1.5 text-[12px] font-[700] uppercase" style={{ fontFamily: "var(--font-space-mono)" }}>{brand}</span>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2">
            {contactItems.length > 0 && (
              <div className="border-b md:border-b-0 md:border-r border-[#111111]">
                <div className="px-6 md:px-10 py-4 border-b border-[#111111]">
                  <span className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>İLETİŞİM</span>
                </div>
                {contactItems.map((item, i) => (
                  <a key={item.label} href={item.href} target={item.external ? "_blank" : undefined} rel="noopener noreferrer"
                    className={`flex items-center gap-4 px-6 md:px-10 py-5 group hover:bg-[#111111] transition-none ${i < contactItems.length - 1 ? "border-b border-[#111111]" : ""}`}>
                    <span className="text-[10px] font-[700] tracking-[0.12em] uppercase text-[#747878] group-hover:text-[#F4F3F0]/40 w-24 flex-shrink-0" style={{ fontFamily: "var(--font-space-mono)" }}>{item.label}</span>
                    <span className="text-[14px] text-[#111111] group-hover:text-[#F4F3F0] flex-1 min-w-0 break-words" style={{ fontFamily: "var(--font-inter)" }}>{item.value}</span>
                    <span className="text-[#FF4A00] text-[14px] font-[700] flex-shrink-0">↗</span>
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

        <div className="border-t border-[#111111] px-6 md:px-10 py-4 flex-shrink-0">
          <button onClick={onClose} className="w-full border border-[#111111] text-[#111111] px-6 py-3.5 text-[11px] font-[700] tracking-[0.1em] uppercase hover:bg-[#111111] hover:text-[#F4F3F0] transition-none" style={{ fontFamily: "var(--font-space-mono)" }}>
            KAPAT
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Card ──────────────────────────────────────────────────────────────────────

function DataRow({ label, value, hover }: { label: string; value: string; hover?: boolean }) {
  return (
    <div className="flex items-baseline gap-1.5 min-w-0">
      <span
        className={`text-[10px] font-[700] uppercase flex-shrink-0 transition-none ${hover ? "text-[#F4F3F0]/30 group-hover:text-[#F4F3F0]/30" : "text-[#747878]"}`}
        style={{ fontFamily: "var(--font-space-mono)" }}
      >
        {label}:
      </span>
      <span
        className={`text-[10px] font-[400] tracking-[0.02em] uppercase truncate transition-none ${hover ? "text-[#F4F3F0]/60 group-hover:text-[#F4F3F0]/60" : "text-[#111111] group-hover:text-[#F4F3F0]/60"}`}
        style={{ fontFamily: "var(--font-space-mono)" }}
      >
        {value}
      </span>
    </div>
  );
}

function FirmCard({
  firmId,
  firm,
  onClick,
}: {
  firmId: string;
  firm: Firm | null;
  onClick?: () => void;
}) {
  const isEmpty = !firm || !firm.businessName;
  const isDolu = firm?.isActive === true;

  const brandsLabel = firm?.brands?.length
    ? firm.brands.slice(0, 2).join(", ") + (firm.brands.length > 2 ? ` +${firm.brands.length - 2}` : "")
    : "BELİRTİLMEMİŞ";

  const socialVal = firm?.instagram
    ? (firm.instagram.startsWith("@") ? firm.instagram : `@${firm.instagram}`)
    : firm?.website
      ? firm.website.replace(/^https?:\/\//, "")
      : "BELİRTİLMEMİŞ";

  return (
    <div
      onClick={isEmpty ? undefined : onClick}
      className={`border-r border-b border-[#111111] p-4 flex flex-col gap-0 min-h-[200px] transition-none ${
        isEmpty ? "bg-[#F4F3F0]" : "bg-[#F4F3F0] hover:bg-[#111111] cursor-pointer group"
      }`}
    >
      {/* ID + DOLU/BOŞ */}
      <div className="flex items-start justify-between gap-1 mb-1">
        <span
          className="text-[28px] font-[400] tracking-[-0.03em] uppercase leading-none text-[#111111] group-hover:text-[#F4F3F0] transition-none"
          style={{ fontFamily: "var(--font-hanken)" }}
        >
          {firmId}
        </span>
        <span
          className={`text-[11px] font-[700] uppercase px-1.5 py-0.5 border flex-shrink-0 mt-1 transition-none ${
            isDolu
              ? "border-[#FF4A00] text-[#FF4A00]"
              : "border-[#111111] text-[#111111]"
          }`}
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          {isEmpty ? "BOŞ" : isDolu ? "DOLU" : "BOŞ"}
        </span>
      </div>

      {/* Spacer — pushes data sections to bottom */}
      <div className="flex-1" />

      {/* Category */}
      <span
        className="text-[11px] font-[700] uppercase text-[#FF4A00] group-hover:text-[#FF4A00]/70 mb-2 transition-none block"
        style={{ fontFamily: "var(--font-space-mono)" }}
      >
        {isEmpty ? "—" : (firm?.category?.toUpperCase() ?? "BELİRTİLMEMİŞ")}
      </span>

      {/* Section 1: firm info */}
      <div className="flex flex-col gap-1 pb-2.5 border-b border-[#E3E2DF] group-hover:border-[#F4F3F0]/10 transition-none">
        <DataRow label="FİRMA" value={isEmpty ? "BELİRTİLMEMİŞ" : (firm?.businessName ?? "BELİRTİLMEMİŞ")} />
        <DataRow label="AÇIKLAMA" value={isEmpty ? "BELİRTİLMEMİŞ" : shortDesc(firm?.description ?? null)} />
      </div>

      {/* Section 2: brands */}
      <div className="flex flex-col gap-1 pt-2.5">
        <DataRow label="MARKALAR" value={isEmpty ? "BELİRTİLMEMİŞ" : brandsLabel} />
      </div>
    </div>
  );
}

// ─── Main Grid ─────────────────────────────────────────────────────────────────

export default function AtolyePublicGrid({ blocks }: { blocks: Blocks }) {
  const [selectedFirmId, setSelectedFirmId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("TÜMÜ");
  const [searchQuery, setSearchQuery] = useState("");

  function shopToCards(shop: Shop): CardEntry[] {
    const firms = shop.firms ?? [];
    if (firms.length === 0) return [{ firmId: shop.id, firm: null }];
    return firms.map((f) => ({ firmId: `${shop.id}.${f.subId}`, firm: f }));
  }

  const allCards: CardEntry[] = Object.values(blocks).flatMap((b) =>
    b.shops.flatMap(shopToCards)
  );

  const categories = ["TÜMÜ", ...Array.from(
    new Set(allCards.map((c) => c.firm?.category?.toUpperCase()).filter((c): c is string => !!c))
  ).sort()];

  const selectedFirm = selectedFirmId
    ? allCards.find((c) => c.firmId === selectedFirmId)?.firm ?? null
    : null;

  function filterCard(card: CardEntry): boolean {
    const matchesCat = activeFilter === "TÜMÜ" || card.firm?.category?.toUpperCase() === activeFilter;
    if (!searchQuery.trim()) return matchesCat;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      card.firmId.toLowerCase().includes(q) ||
      (card.firm?.businessName ?? "").toLowerCase().includes(q) ||
      (card.firm?.category ?? "").toLowerCase().includes(q) ||
      (card.firm?.contactPerson ?? "").toLowerCase().includes(q) ||
      (card.firm?.ownerName ?? "").toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  }

  const noResults = Object.values(blocks).every(
    (block) => block.shops.flatMap(shopToCards).filter(filterCard).length === 0
  );

  return (
    <>
      <section id="atolyeler" className="col-span-12 border-b border-[#111111]">

        {/* ── Hero ── */}
        <div className="border-b border-[#111111] px-6 md:px-10 py-10 md:py-16">
          <p className="text-[13px] font-[400] tracking-[0.02em] uppercase text-[#FF4A00] mb-3" style={{ fontFamily: "var(--font-space-mono)" }}>
            OPERASYONEL ENVANTER
          </p>
          <h1 className="text-[42px] md:text-[68px] font-[900] tracking-[-0.04em] uppercase leading-[0.92] text-[#111111]" style={{ fontFamily: "var(--font-hanken)" }}>
            ATÖLYE LİSTESİ &<br />MARKALARIMIZ
          </h1>
        </div>

        {/* ── Search + Filter — siyah bar ── */}
        <div className="border-b border-[#111111] bg-[#111111] px-4 py-3 flex items-center gap-2 overflow-x-auto">
          {/* Search box */}
          <div className="flex items-center gap-2 border border-[#F4F3F0]/25 px-3 py-2 flex-shrink-0 min-w-[180px]">
            <span className="text-[#F4F3F0] text-[14px] leading-none flex-shrink-0" style={{ fontFamily: "var(--font-space-mono)" }}>⌕</span>
            <input
              type="text"
              placeholder="ARAMA"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-[14px] font-[400] tracking-[0.02em] uppercase outline-none text-[#F4F3F0] placeholder:text-[#F4F3F0] hover:placeholder:text-[#747878] w-full min-w-0"
              style={{ fontFamily: "var(--font-space-mono)" }}
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")} className="text-[#747878] hover:text-[#FF4A00] text-[14px] flex-shrink-0 transition-none leading-none">×</button>
            )}
          </div>

          {/* Category filters */}
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={`flex-shrink-0 px-3 py-2 text-[12px] font-[700] uppercase border transition-none ${
                activeFilter === cat
                  ? "border-[#FF4A00] text-[#FF4A00]"
                  : "border-[#F4F3F0]/25 text-[#F4F3F0] hover:border-[#747878] hover:text-[#747878]"
              }`}
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Block grids ── */}
        {Object.entries(blocks).map(([blockKey, block]) => {
          const blockCards: CardEntry[] = block.shops.flatMap(shopToCards);
          const visibleCards = blockCards.filter(filterCard);
          if (visibleCards.length === 0) return null;

          return (
            <div key={blockKey} className="border-b border-[#111111]">
              <div className="px-6 py-3 flex items-center justify-between border-b border-[#111111] bg-[#E3E2DD]">
                <span className="text-[16px] font-[700] tracking-[0.08em] uppercase text-[#111111]" style={{ fontFamily: "var(--font-space-mono)" }}>
                  {blockKey} BLOK ATÖLYELER
                </span>
                <span className="text-[10px] font-[400] tracking-[0.06em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>
                  {block.shops.length} UNITS
                </span>
              </div>

              <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 border-l border-t border-[#111111] ${{1:"xl:grid-cols-1",2:"xl:grid-cols-2",3:"xl:grid-cols-3",4:"xl:grid-cols-4",5:"xl:grid-cols-5",6:"xl:grid-cols-6"}[Math.min(blockCards.length, 6)] ?? "xl:grid-cols-6"}`}>
                {visibleCards.map((card) => (
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

        {noResults && (
          <div className="px-10 py-16 text-center">
            <p className="text-[12px] font-[700] tracking-[0.15em] uppercase text-[#c4c7c7]" style={{ fontFamily: "var(--font-space-mono)" }}>
              "{searchQuery}" için sonuç bulunamadı
            </p>
          </div>
        )}
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
