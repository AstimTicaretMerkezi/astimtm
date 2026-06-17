"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ─── Constants ────────────────────────────────────────────────────────────────

const FIXED_CATEGORIES = [
  "Tekstil", "Ayakkabı", "Elektronik", "Gıda", "Hırdavat",
  "Mobilya", "Kozmetik", "Spor", "Oyuncak", "Kırtasiye",
];

const DAYS = [
  { key: "Pzt", label: "Pazartesi" },
  { key: "Sal", label: "Salı" },
  { key: "Çar", label: "Çarşamba" },
  { key: "Per", label: "Perşembe" },
  { key: "Cum", label: "Cuma" },
  { key: "Cmt", label: "Cumartesi" },
  { key: "Paz", label: "Pazar" },
];

const TEXT_FIELDS = [
  { key: "businessName", label: "FİRMA ADI", type: "text", placeholder: "Örn: Ahmet Tekstil" },
  { key: "ownerName", label: "YETKİLİ ADI", type: "text", placeholder: "Örn: Ahmet Yılmaz" },
  { key: "taxNumber", label: "VERGİ NUMARASI", type: "text", placeholder: "10 haneli vergi no" },
  { key: "address", label: "ADRES", type: "text", placeholder: "Atölye adresi" },
  { key: "phone", label: "TELEFON", type: "tel", placeholder: "0555 000 00 00" },
  { key: "whatsapp", label: "WHATSAPP", type: "tel", placeholder: "0555 000 00 00" },
  { key: "website", label: "WEBSİTE", type: "url", placeholder: "https://example.com" },
  { key: "instagram", label: "INSTAGRAM", type: "text", placeholder: "@kullaniciadi" },
];

// ─── Working hours helpers ────────────────────────────────────────────────────

type DaySchedule = { open: boolean; start: string; end: string };
type WorkingHoursMap = Record<string, DaySchedule>;

const DEFAULT_HOURS: WorkingHoursMap = {
  Pzt: { open: true, start: "09:00", end: "18:00" },
  Sal: { open: true, start: "09:00", end: "18:00" },
  Çar: { open: true, start: "09:00", end: "18:00" },
  Per: { open: true, start: "09:00", end: "18:00" },
  Cum: { open: true, start: "09:00", end: "18:00" },
  Cmt: { open: false, start: "10:00", end: "15:00" },
  Paz: { open: false, start: "10:00", end: "14:00" },
};

function parseWorkingHours(raw: string | null | undefined): WorkingHoursMap {
  const base = structuredClone(DEFAULT_HOURS);
  if (!raw) return base;
  for (const part of raw.split(",").map((p) => p.trim())) {
    const colonIdx = part.indexOf(":");
    if (colonIdx === -1) continue;
    const key = part.slice(0, colonIdx).trim();
    const val = part.slice(colonIdx + 1).trim();
    if (!base[key]) continue;
    if (val === "Kapalı") base[key].open = false;
    else {
      const m = val.match(/^(\d{2}:\d{2})-(\d{2}:\d{2})$/);
      if (m) base[key] = { open: true, start: m[1], end: m[2] };
    }
  }
  return base;
}

function serializeWorkingHours(hours: WorkingHoursMap): string {
  return DAYS.map(({ key }) => {
    const d = hours[key];
    if (!d || !d.open) return `${key}: Kapalı`;
    return `${key}: ${d.start}-${d.end}`;
  }).join(", ");
}

// ─── Types ────────────────────────────────────────────────────────────────────

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
  taxNumber: string | null;
  address: string | null;
  workingHours: string | null;
  brands: string[];
  isActive: boolean;
};

type Shop = { id: string; no: number; firms: Firm[] };
type Block = { label: string; shops: Shop[] };
type Blocks = Record<string, Block>;

// ─── Firm Edit Modal ──────────────────────────────────────────────────────────

function FirmModal({
  firmId,
  firm,
  customCategories,
  onClose,
  onSaved,
}: {
  firmId: string;
  firm: Firm;
  customCategories: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const allCategories = [
    ...FIXED_CATEGORIES,
    ...customCategories.filter((c) => !FIXED_CATEGORIES.includes(c)),
  ];
  const isCustomCat = !!firm.category && !allCategories.includes(firm.category);

  const [form, setForm] = useState({
    businessName: firm.businessName ?? "",
    ownerName: firm.ownerName ?? "",
    taxNumber: firm.taxNumber ?? "",
    address: firm.address ?? "",
    phone: firm.phone ?? "",
    whatsapp: firm.whatsapp ?? "",
    website: firm.website ?? "",
    instagram: firm.instagram ?? "",
    description: firm.description ?? "",
  });
  const [category, setCategory] = useState(isCustomCat ? "" : (firm.category ?? ""));
  const [categoryMode, setCategoryMode] = useState<"select" | "custom">(isCustomCat ? "custom" : "select");
  const [customCategoryInput, setCustomCategoryInput] = useState(isCustomCat ? (firm.category ?? "") : "");
  const [logo, setLogo] = useState<string | null>(firm.logo);
  const [logoUploading, setLogoUploading] = useState(false);
  const [workingHours, setWorkingHours] = useState<WorkingHoursMap>(() => parseWorkingHours(firm.workingHours));
  const [isActive, setIsActive] = useState(firm.isActive);
  const [brands, setBrands] = useState<string[]>(firm.brands ?? []);
  const [brandInput, setBrandInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === "Escape") onClose(); }, [onClose]);
  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [handleKey]);

  function setField(key: string, value: string) { setForm((f) => ({ ...f, [key]: value })); }
  function setDay(key: string, patch: Partial<DaySchedule>) { setWorkingHours((h) => ({ ...h, [key]: { ...h[key], ...patch } })); }

  function addBrand() {
    const val = brandInput.trim();
    if (!val || brands.includes(val)) return;
    setBrands((b) => [...b, val]);
    setBrandInput("");
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Logo dosyası 5MB'dan büyük olamaz."); return; }
    setLogoUploading(true);
    setError("");
    const data = new FormData();
    data.append("file", file);
    data.append("atolyeId", firmId);
    const res = await fetch("/api/admin/logo", { method: "POST", body: data });
    setLogoUploading(false);
    if (res.ok) { const { url } = await res.json(); setLogo(url); }
    else setError("Logo yüklenemedi.");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const finalCategory = categoryMode === "custom" ? customCategoryInput.trim() : category;
    const isNewCustom = categoryMode === "custom" && finalCategory && !allCategories.includes(finalCategory);

    const body: Record<string, any> = {
      ...form,
      category: finalCategory || null,
      logo,
      workingHours: serializeWorkingHours(workingHours),
      isActive,
      brands,
    };
    if (isNewCustom) body.newCustomCategory = finalCategory;

    const res = await fetch(`/api/admin/atolyeler/${encodeURIComponent(firmId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);
    if (res.ok) onSaved();
    else { const d = await res.json(); setError(d.error || "Bir hata oluştu."); }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(17,17,17,0.7)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#F4F3F0] border border-[#111111] w-full max-w-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="bg-[#111111] px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#FF4A00]" style={{ fontFamily: "var(--font-space-mono)" }}>
              FİRMA — {firmId}
            </p>
            <h2 className="text-[20px] font-[900] tracking-[-0.02em] uppercase text-[#F4F3F0]" style={{ fontFamily: "var(--font-hanken)" }}>
              {firm.businessName ?? "YENİ FİRMA"}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="text-[#F4F3F0]/40 hover:text-[#FF4A00] text-[18px] font-[700] leading-none transition-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto flex-1">

            {/* DURUM */}
            <div className="border-b border-[#111111] px-6 py-4 flex items-center justify-between">
              <span className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>DURUM</span>
              <button
                type="button"
                onClick={() => setIsActive((v) => !v)}
                className={`px-4 py-2 text-[11px] font-[700] tracking-[0.1em] uppercase transition-none ${isActive ? "bg-[#DFFF00] text-[#111111]" : "border border-[#c4c7c7] text-[#c4c7c7] hover:border-[#111111] hover:text-[#111111]"}`}
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {isActive ? "AKTİF" : "PASİF"}
              </button>
            </div>

            {/* LOGO */}
            <div className="border-b border-[#111111] px-6 py-4 flex flex-col gap-3">
              <label className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>FİRMA LOGOSU</label>
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 border border-[#c4c7c7] bg-[#EFEEEB] flex items-center justify-center relative overflow-hidden flex-shrink-0">
                  {logo ? (
                    <Image src={logo} alt="Logo" fill className="object-contain p-2" sizes="80px" />
                  ) : (
                    <span className="text-[9px] text-[#c4c7c7] text-center" style={{ fontFamily: "var(--font-space-mono)" }}>LOGO YOK</span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={logoUploading}
                    className="bg-[#111111] text-[#F4F3F0] px-4 py-2 text-[10px] font-[700] tracking-[0.1em] uppercase hover:bg-[#FF4A00] transition-none disabled:opacity-40"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                  >
                    {logoUploading ? "YÜKLENİYOR..." : "LOGO YÜKLE"}
                  </button>
                  <p className="text-[10px] text-[#c4c7c7]" style={{ fontFamily: "var(--font-space-mono)" }}>Maks. 5MB · PNG, JPG, WEBP</p>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleLogoChange} />
            </div>

            {/* KATEGORİ */}
            <div className="border-b border-[#111111] px-6 py-4 flex flex-col gap-2">
              <label className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>KATEGORİ</label>
              <select
                value={categoryMode === "custom" ? "__diger__" : category}
                onChange={(e) => {
                  if (e.target.value === "__diger__") { setCategoryMode("custom"); setCategory(""); }
                  else { setCategoryMode("select"); setCategory(e.target.value); }
                }}
                className="border border-[#111111] bg-[#F4F3F0] px-4 py-2.5 text-[14px] outline-none focus:border-[#FF4A00]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <option value="">— Seçin —</option>
                {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                <option value="__diger__">+ Yeni Kategori Ekle</option>
              </select>
              {categoryMode === "custom" && (
                <input
                  type="text"
                  placeholder="Kategori adını girin..."
                  value={customCategoryInput}
                  onChange={(e) => setCustomCategoryInput(e.target.value)}
                  className="border border-[#FF4A00] bg-transparent px-3 py-2 text-[13px] outline-none"
                  style={{ fontFamily: "var(--font-inter)" }}
                  autoFocus
                />
              )}
            </div>

            {/* Text fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {TEXT_FIELDS.map((field, i) => (
                <div
                  key={field.key}
                  className={`border-b border-[#111111] px-6 py-4 flex flex-col gap-2 ${i % 2 === 0 ? "sm:border-r border-[#111111]" : ""}`}
                >
                  <label className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={(form as any)[field.key]}
                    onChange={(e) => setField(field.key, e.target.value)}
                    className="border border-[#111111] bg-transparent px-3 py-2 text-[13px] outline-none focus:border-[#FF4A00]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  />
                </div>
              ))}
            </div>

            {/* MARKALAR / DİSTRİBÜTÖRLER */}
            <div className="border-b border-[#111111] px-6 py-4 flex flex-col gap-3">
              <label className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>
                MARKALAR / DİSTRİBÜTÖRLER
              </label>
              {brands.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {brands.map((brand) => (
                    <span
                      key={brand}
                      className="flex items-center gap-2 border border-[#111111] px-3 py-1 text-[12px] font-[700]"
                      style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                      {brand}
                      <button
                        type="button"
                        onClick={() => setBrands((b) => b.filter((x) => x !== brand))}
                        className="text-[#c4c7c7] hover:text-[#FF4A00] leading-none transition-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Marka veya distribütör adı..."
                  value={brandInput}
                  onChange={(e) => setBrandInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addBrand(); } }}
                  className="flex-1 border border-[#111111] bg-transparent px-3 py-2 text-[13px] outline-none focus:border-[#FF4A00]"
                  style={{ fontFamily: "var(--font-inter)" }}
                />
                <button
                  type="button"
                  onClick={addBrand}
                  className="bg-[#111111] text-[#F4F3F0] px-4 py-2 text-[12px] font-[700] hover:bg-[#FF4A00] transition-none"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  + EKLE
                </button>
              </div>
            </div>

            {/* ÇALIŞMA SAATLERİ */}
            <div className="border-b border-[#111111] px-6 py-4 flex flex-col gap-3">
              <label className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>ÇALIŞMA SAATLERİ</label>
              <div className="flex flex-col gap-0 border border-[#111111]">
                {DAYS.map(({ key, label }, i) => {
                  const day = workingHours[key] ?? DEFAULT_HOURS[key];
                  return (
                    <div key={key} className={`flex items-center gap-3 px-4 py-3 ${i < DAYS.length - 1 ? "border-b border-[#111111]" : ""}`}>
                      <span className="text-[11px] font-[700] uppercase w-24 flex-shrink-0" style={{ fontFamily: "var(--font-space-mono)" }}>{label}</span>
                      <button
                        type="button"
                        onClick={() => setDay(key, { open: !day.open })}
                        className={`px-3 py-1 text-[10px] font-[700] tracking-[0.08em] uppercase transition-none flex-shrink-0 ${day.open ? "bg-[#DFFF00] text-[#111111]" : "border border-[#c4c7c7] text-[#c4c7c7]"}`}
                        style={{ fontFamily: "var(--font-space-mono)" }}
                      >
                        {day.open ? "AÇIK" : "KAPALI"}
                      </button>
                      {day.open ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input type="time" value={day.start} onChange={(e) => setDay(key, { start: e.target.value })} className="border border-[#111111] bg-transparent px-2 py-1 text-[13px] outline-none focus:border-[#FF4A00] w-28" style={{ fontFamily: "var(--font-space-mono)" }} />
                          <span className="text-[#747878] text-[11px]" style={{ fontFamily: "var(--font-space-mono)" }}>—</span>
                          <input type="time" value={day.end} onChange={(e) => setDay(key, { end: e.target.value })} className="border border-[#111111] bg-transparent px-2 py-1 text-[13px] outline-none focus:border-[#FF4A00] w-28" style={{ fontFamily: "var(--font-space-mono)" }} />
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#c4c7c7] flex-1" style={{ fontFamily: "var(--font-space-mono)" }}>—</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AÇIKLAMA */}
            <div className="border-b border-[#111111] px-6 py-4 flex flex-col gap-2">
              <label className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>AÇIKLAMA</label>
              <textarea
                rows={3}
                placeholder="Firmayı kısaca tanıtın..."
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                className="border border-[#111111] bg-transparent px-3 py-2 text-[13px] outline-none focus:border-[#FF4A00] resize-none"
                style={{ fontFamily: "var(--font-inter)" }}
              />
            </div>

            {error && (
              <div className="px-6 py-3 bg-[#FF4A00]/10">
                <p className="text-[12px] text-[#FF4A00] font-[700]" style={{ fontFamily: "var(--font-space-mono)" }}>{error}</p>
              </div>
            )}
          </div>

          <div className="border-t border-[#111111] px-6 py-4 flex gap-3 flex-shrink-0">
            <button type="button" onClick={onClose} className="flex-1 border border-[#111111] text-[#111111] px-6 py-3 text-[11px] font-[700] tracking-[0.1em] uppercase hover:bg-[#111111] hover:text-[#F4F3F0] transition-none" style={{ fontFamily: "var(--font-space-mono)" }}>
              İPTAL
            </button>
            <button type="submit" disabled={loading || logoUploading} className="flex-1 bg-[#111111] text-[#F4F3F0] px-6 py-3 text-[11px] font-[700] tracking-[0.1em] uppercase hover:bg-[#FF4A00] transition-none disabled:opacity-40" style={{ fontFamily: "var(--font-space-mono)" }}>
              {loading ? "KAYDEDİLİYOR..." : "KAYDET →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Client ──────────────────────────────────────────────────────────────

export default function AtolyelerClient({
  blocks,
  customCategories,
}: {
  blocks: Blocks;
  customCategories: string[];
}) {
  const router = useRouter();
  const [selectedFirmId, setSelectedFirmId] = useState<string | null>(null);
  const [addingShopId, setAddingShopId] = useState<string | null>(null);

  const allFirms = Object.values(blocks).flatMap((b) =>
    b.shops.flatMap((s) => s.firms)
  );
  const totalShops = Object.values(blocks).flatMap((b) => b.shops).length;
  const totalAktif = allFirms.filter((f) => f.isActive).length;
  const totalFirms = allFirms.length;

  // Resolve selected firm object
  const selectedFirm = selectedFirmId
    ? (() => {
        const dotIdx = selectedFirmId.lastIndexOf(".");
        if (dotIdx === -1) return null;
        const shopId = selectedFirmId.slice(0, dotIdx);
        const subId = parseInt(selectedFirmId.slice(dotIdx + 1), 10);
        const blockKey = shopId.split("-")[0];
        const shop = blocks[blockKey]?.shops.find((s) => s.id === shopId);
        return shop?.firms.find((f) => f.subId === subId) ?? null;
      })()
    : null;

  async function handleAddFirm(shopId: string) {
    setAddingShopId(shopId);
    const res = await fetch(`/api/admin/atolyeler/${shopId}/firms`, { method: "POST" });
    setAddingShopId(null);
    if (res.ok) {
      const { firmId } = await res.json();
      router.refresh();
      // Open modal for the new firm after refresh completes
      setTimeout(() => setSelectedFirmId(firmId), 100);
    }
  }

  async function handleDeleteFirm(firmId: string) {
    if (!confirm(`"${firmId}" firmasını silmek istediğinize emin misiniz?`)) return;
    await fetch(`/api/admin/atolyeler/${encodeURIComponent(firmId)}`, { method: "DELETE" });
    router.refresh();
  }

  function handleSaved() {
    setSelectedFirmId(null);
    router.refresh();
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-3 border border-[#111111]">
        {[
          { label: "ATÖLYE SAYISI", value: totalShops },
          { label: "TOPLAM FİRMA", value: totalFirms },
          { label: "AKTİF FİRMA", value: totalAktif, accent: "#DFFF00" },
        ].map((stat, i) => (
          <div key={stat.label} className={`p-6 flex flex-col gap-1 ${i < 2 ? "border-r border-[#111111]" : ""}`}>
            <span className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>
              {stat.label}
            </span>
            <span className="text-[48px] font-[900] tracking-[-0.04em] leading-none" style={{ fontFamily: "var(--font-hanken)", color: stat.accent ?? "#111111" }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Blocks */}
      {Object.entries(blocks).map(([blockKey, block]) => (
        <div key={blockKey} className="border border-[#111111]">
          <div className="bg-[#111111] px-6 py-4 flex items-center justify-between">
            <span className="text-[#F4F3F0] text-[14px] font-[900] tracking-[0.05em] uppercase" style={{ fontFamily: "var(--font-hanken)" }}>
              {block.label}
            </span>
            <span className="text-[#DFFF00] text-[10px] font-[700] tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-space-mono)" }}>
              {block.shops.flatMap((s) => s.firms).filter((f) => f.isActive).length} AKTİF
            </span>
          </div>

          {block.shops.map((shop, si) => {
            const isEmpty = shop.firms.length === 0;
            return (
              <div key={shop.id} className={si < block.shops.length - 1 ? "border-b border-[#111111]" : ""}>

                {/* Shop header row */}
                <div className={`px-6 py-3 flex items-center justify-between ${isEmpty ? "bg-[#F4F3F0]" : "bg-[#EFEEEB]"}`}>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-[700] tracking-[0.1em] uppercase px-2 py-1 border ${isEmpty ? "border-[#c4c7c7] text-[#c4c7c7]" : "border-[#FF4A00] text-[#FF4A00]"}`}
                      style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                      {shop.id}
                    </span>
                    {isEmpty ? (
                      <span className="text-[12px] text-[#c4c7c7]" style={{ fontFamily: "var(--font-inter)" }}>— Boş atölye —</span>
                    ) : (
                      <span className="text-[11px] text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>
                        {shop.firms.length} FİRMA
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddFirm(shop.id)}
                    disabled={addingShopId === shop.id}
                    className="text-[10px] font-[700] tracking-[0.1em] uppercase text-[#111111] border border-[#111111] px-3 py-1.5 hover:bg-[#111111] hover:text-[#F4F3F0] transition-none disabled:opacity-40"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                  >
                    {addingShopId === shop.id ? "EKLENİYOR..." : "+ FİRMA EKLE"}
                  </button>
                </div>

                {/* Firm rows */}
                {shop.firms.map((firm, fi) => {
                  const firmId = `${shop.id}.${firm.subId}`;
                  return (
                    <div
                      key={firm.subId}
                      className={`px-6 py-4 grid grid-cols-12 gap-4 items-center border-t border-[#111111] bg-[#F4F3F0] ${fi < shop.firms.length - 1 ? "" : ""}`}
                    >
                      {/* FirmId */}
                      <div className="col-span-2">
                        <span className={`text-[10px] font-[700] tracking-[0.1em] uppercase px-2 py-1 border ${firm.isActive ? "border-[#FF4A00] text-[#FF4A00]" : "border-[#c4c7c7] text-[#c4c7c7]"}`} style={{ fontFamily: "var(--font-space-mono)" }}>
                          {firmId}
                        </span>
                      </div>

                      {/* Business name */}
                      <span className="col-span-3 text-[14px] font-[700] text-[#111111] truncate" style={{ fontFamily: "var(--font-inter)" }}>
                        {firm.businessName ?? <span className="text-[#c4c7c7] font-[400]">— Boş —</span>}
                      </span>

                      {/* Category */}
                      <span className="col-span-2 text-[12px] text-[#747878] truncate" style={{ fontFamily: "var(--font-space-mono)" }}>
                        {firm.category ?? "—"}
                      </span>

                      {/* Owner */}
                      <span className="col-span-2 text-[12px] text-[#747878] truncate" style={{ fontFamily: "var(--font-inter)" }}>
                        {firm.ownerName ?? "—"}
                      </span>

                      {/* Status */}
                      <span className="col-span-1">
                        <span className={`text-[9px] font-[700] tracking-[0.1em] uppercase px-2 py-1 ${firm.isActive ? "bg-[#DFFF00] text-[#111111]" : "border border-[#c4c7c7] text-[#c4c7c7]"}`} style={{ fontFamily: "var(--font-space-mono)" }}>
                          {firm.isActive ? "AKTİF" : "PASİF"}
                        </span>
                      </span>

                      {/* Actions */}
                      <div className="col-span-2 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedFirmId(firmId)}
                          className="text-[11px] font-[700] tracking-[0.1em] uppercase text-[#111111] hover:text-[#FF4A00] transition-none"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          DÜZENLE
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFirm(firmId)}
                          className="text-[11px] font-[700] tracking-[0.1em] uppercase text-[#c4c7c7] hover:text-[#FF4A00] transition-none"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          SİL
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      ))}

      {/* Modal */}
      {selectedFirmId && selectedFirm && (
        <FirmModal
          firmId={selectedFirmId}
          firm={selectedFirm}
          customCategories={customCategories}
          onClose={() => setSelectedFirmId(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}
