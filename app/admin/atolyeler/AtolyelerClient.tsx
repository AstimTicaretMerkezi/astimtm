"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ─── Constants ───────────────────────────────────────────────────────────────

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
  // String format: "Pzt: 09:00-18:00, Sal: Kapalı, ..."
  const parts = raw.split(",").map((p) => p.trim());
  for (const part of parts) {
    const colonIdx = part.indexOf(":");
    if (colonIdx === -1) continue;
    const key = part.slice(0, colonIdx).trim();
    const val = part.slice(colonIdx + 1).trim();
    if (!base[key]) continue;
    if (val === "Kapalı") {
      base[key].open = false;
    } else {
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

type Atolye = {
  id: string;
  no: number;
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
  isActive: boolean;
};

type Block = { label: string; shops: Atolye[] };
type Blocks = Record<string, Block>;

// ─── Modal ────────────────────────────────────────────────────────────────────

function AtolyeModal({
  atolye,
  customCategories,
  onClose,
  onSaved,
}: {
  atolye: Atolye;
  customCategories: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const allCategories = [
    ...FIXED_CATEGORIES,
    ...customCategories.filter((c) => !FIXED_CATEGORIES.includes(c)),
  ];

  const isCustomCat = !!atolye.category && !allCategories.includes(atolye.category);

  const [form, setForm] = useState({
    businessName: atolye.businessName ?? "",
    ownerName: atolye.ownerName ?? "",
    taxNumber: atolye.taxNumber ?? "",
    address: atolye.address ?? "",
    phone: atolye.phone ?? "",
    whatsapp: atolye.whatsapp ?? "",
    website: atolye.website ?? "",
    instagram: atolye.instagram ?? "",
    description: atolye.description ?? "",
  });
  const [category, setCategory] = useState(isCustomCat ? "" : (atolye.category ?? ""));
  const [categoryMode, setCategoryMode] = useState<"select" | "custom">(isCustomCat ? "custom" : "select");
  const [customCategoryInput, setCustomCategoryInput] = useState(isCustomCat ? (atolye.category ?? "") : "");
  const [logo, setLogo] = useState<string | null>(atolye.logo);
  const [logoUploading, setLogoUploading] = useState(false);
  const [workingHours, setWorkingHours] = useState<WorkingHoursMap>(() =>
    parseWorkingHours(atolye.workingHours)
  );
  const [isActive, setIsActive] = useState(atolye.isActive);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  function setField(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setDay(key: string, patch: Partial<DaySchedule>) {
    setWorkingHours((h) => ({ ...h, [key]: { ...h[key], ...patch } }));
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Logo dosyası 5MB'dan büyük olamaz."); return; }
    setLogoUploading(true);
    setError("");
    const data = new FormData();
    data.append("file", file);
    data.append("atolyeId", atolye.id);
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
    };
    if (isNewCustom) body.newCustomCategory = finalCategory;

    const res = await fetch(`/api/admin/atolyeler/${atolye.id}`, {
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
              YÖNETİM — {atolye.id}
            </p>
            <h2 className="text-[20px] font-[900] tracking-[-0.02em] uppercase text-[#F4F3F0]" style={{ fontFamily: "var(--font-hanken)" }}>
              {atolye.businessName ?? "BOŞ ATÖLYE"}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="text-[#F4F3F0]/40 hover:text-[#FF4A00] text-[18px] font-[700] leading-none transition-none">
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto flex-1">

            {/* DURUM */}
            <div className="border-b border-[#111111] px-6 py-4 flex items-center justify-between">
              <span className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>DURUM</span>
              <button
                type="button"
                onClick={() => setIsActive((v) => !v)}
                className={`px-4 py-2 text-[11px] font-[700] tracking-[0.1em] uppercase transition-none ${
                  isActive ? "bg-[#DFFF00] text-[#111111]" : "border border-[#c4c7c7] text-[#c4c7c7] hover:border-[#111111] hover:text-[#111111]"
                }`}
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {isActive ? "AKTİF" : "PASİF"}
              </button>
            </div>

            {/* LOGO */}
            <div className="border-b border-[#111111] px-6 py-4 flex flex-col gap-3">
              <label className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>
                FİRMA LOGOSU
              </label>
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
                  <p className="text-[10px] text-[#c4c7c7]" style={{ fontFamily: "var(--font-space-mono)" }}>Maks. 5MB · PNG, JPG, WEBP · 400×400px</p>
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
                  if (e.target.value === "__diger__") {
                    setCategoryMode("custom");
                    setCategory("");
                  } else {
                    setCategoryMode("select");
                    setCategory(e.target.value);
                  }
                }}
                className="border border-[#111111] bg-[#F4F3F0] px-4 py-2.5 text-[14px] outline-none focus:border-[#FF4A00]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <option value="">— Seçin —</option>
                {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                <option value="__diger__">+ Yeni Kategori Ekle</option>
              </select>
              {categoryMode === "custom" && (
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="Kategori adını girin..."
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    className="border border-[#FF4A00] bg-transparent px-3 py-2 text-[13px] outline-none"
                    style={{ fontFamily: "var(--font-inter)" }}
                    autoFocus
                  />
                  <p className="text-[10px] text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>
                    Bu kategori kalıcı olarak listeye eklenecek.
                  </p>
                </div>
              )}
            </div>

            {/* Text fields (2-column grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {TEXT_FIELDS.map((field, i) => (
                <div
                  key={field.key}
                  className={`border-b border-[#111111] px-6 py-4 flex flex-col gap-2 ${i % 2 === 0 ? "sm:border-r border-[#111111]" : ""}`}
                >
                  <label className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>
                    {field.label}
                  </label>
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

            {/* ÇALIŞMA SAATLERİ */}
            <div className="border-b border-[#111111] px-6 py-4 flex flex-col gap-3">
              <label className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>
                ÇALIŞMA SAATLERİ
              </label>
              <div className="flex flex-col gap-0 border border-[#111111]">
                {DAYS.map(({ key, label }, i) => {
                  const day = workingHours[key] ?? DEFAULT_HOURS[key];
                  return (
                    <div
                      key={key}
                      className={`flex items-center gap-3 px-4 py-3 ${i < DAYS.length - 1 ? "border-b border-[#111111]" : ""}`}
                    >
                      {/* Day name */}
                      <span className="text-[11px] font-[700] uppercase w-24 flex-shrink-0" style={{ fontFamily: "var(--font-space-mono)" }}>
                        {label}
                      </span>

                      {/* Open/Closed toggle */}
                      <button
                        type="button"
                        onClick={() => setDay(key, { open: !day.open })}
                        className={`px-3 py-1 text-[10px] font-[700] tracking-[0.08em] uppercase transition-none flex-shrink-0 ${
                          day.open
                            ? "bg-[#DFFF00] text-[#111111]"
                            : "border border-[#c4c7c7] text-[#c4c7c7]"
                        }`}
                        style={{ fontFamily: "var(--font-space-mono)" }}
                      >
                        {day.open ? "AÇIK" : "KAPALI"}
                      </button>

                      {/* Time range */}
                      {day.open ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="time"
                            value={day.start}
                            onChange={(e) => setDay(key, { start: e.target.value })}
                            className="border border-[#111111] bg-transparent px-2 py-1 text-[13px] outline-none focus:border-[#FF4A00] w-28"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          />
                          <span className="text-[#747878] text-[11px]" style={{ fontFamily: "var(--font-space-mono)" }}>—</span>
                          <input
                            type="time"
                            value={day.end}
                            onChange={(e) => setDay(key, { end: e.target.value })}
                            className="border border-[#111111] bg-transparent px-2 py-1 text-[13px] outline-none focus:border-[#FF4A00] w-28"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          />
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
                placeholder="Atölyeyi kısaca tanıtın..."
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

          {/* Footer */}
          <div className="border-t border-[#111111] px-6 py-4 flex gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#111111] text-[#111111] px-6 py-3 text-[11px] font-[700] tracking-[0.1em] uppercase hover:bg-[#111111] hover:text-[#F4F3F0] transition-none"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              İPTAL
            </button>
            <button
              type="submit"
              disabled={loading || logoUploading}
              className="flex-1 bg-[#111111] text-[#F4F3F0] px-6 py-3 text-[11px] font-[700] tracking-[0.1em] uppercase hover:bg-[#FF4A00] transition-none disabled:opacity-40"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {loading ? "KAYDEDİLİYOR..." : "KAYDET →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export default function AtolyelerClient({
  blocks,
  customCategories,
}: {
  blocks: Blocks;
  customCategories: string[];
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const allShops = Object.values(blocks).flatMap((b) => b.shops);
  const totalAktif = allShops.filter((s) => s.isActive).length;
  const totalPasif = allShops.length - totalAktif;

  const selectedAtolyeObj = selectedId
    ? allShops.find((s) => s.id === selectedId) ?? null
    : null;

  function handleSaved() {
    setSelectedId(null);
    router.refresh();
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-3 border border-[#111111]">
        {[
          { label: "TOPLAM", value: allShops.length },
          { label: "AKTİF", value: totalAktif, accent: "#DFFF00" },
          { label: "PASİF", value: totalPasif },
        ].map((stat, i) => (
          <div key={stat.label} className={`p-6 flex flex-col gap-1 ${i < 2 ? "border-r border-[#111111]" : ""}`}>
            <span className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>
              {stat.label}
            </span>
            <span
              className="text-[48px] font-[900] tracking-[-0.04em] leading-none"
              style={{ fontFamily: "var(--font-hanken)", color: stat.accent ?? "#111111" }}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Blocks */}
      {Object.entries(blocks).map(([blockKey, block]) => {
        const aktif = block.shops.filter((s) => s.isActive).length;
        return (
          <div key={blockKey} className="border border-[#111111]">
            <div className="bg-[#111111] px-6 py-4 flex items-center justify-between">
              <span className="text-[#F4F3F0] text-[14px] font-[900] tracking-[0.05em] uppercase" style={{ fontFamily: "var(--font-hanken)" }}>
                {block.label}
              </span>
              <div className="flex items-center gap-4">
                <span className="text-[#DFFF00] text-[10px] font-[700] tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-space-mono)" }}>{aktif} AKTİF</span>
                <span className="text-[#F4F3F0]/40 text-[10px] font-[700] tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-space-mono)" }}>{block.shops.length - aktif} PASİF</span>
              </div>
            </div>

            <div className="border-b border-[#111111] px-6 py-3 grid grid-cols-12 gap-4 bg-[#F4F3F0]">
              {[
                { label: "ATÖLYE", cols: "col-span-2" },
                { label: "FİRMA ADI", cols: "col-span-4" },
                { label: "KATEGORİ", cols: "col-span-2" },
                { label: "YETKİLİ", cols: "col-span-2" },
                { label: "DURUM", cols: "col-span-1" },
                { label: "İŞLEM", cols: "col-span-1 text-right" },
              ].map((h) => (
                <span key={h.label} className={`text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878] ${h.cols}`} style={{ fontFamily: "var(--font-space-mono)" }}>
                  {h.label}
                </span>
              ))}
            </div>

            {block.shops.map((atolye, i) => (
              <div key={atolye.id} className={`px-6 py-4 grid grid-cols-12 gap-4 items-center ${i < block.shops.length - 1 ? "border-b border-[#111111]" : ""}`}>
                <span className="col-span-2">
                  <span className={`text-[10px] font-[700] tracking-[0.1em] uppercase px-2 py-1 border ${atolye.isActive ? "border-[#FF4A00] text-[#FF4A00]" : "border-[#c4c7c7] text-[#c4c7c7]"}`} style={{ fontFamily: "var(--font-space-mono)" }}>
                    {atolye.id}
                  </span>
                </span>
                <span className="col-span-4 text-[14px] font-[700] text-[#111111] truncate" style={{ fontFamily: "var(--font-inter)" }}>
                  {atolye.businessName ?? <span className="text-[#c4c7c7] font-[400]">— Boş —</span>}
                </span>
                <span className="col-span-2 text-[12px] text-[#747878] truncate" style={{ fontFamily: "var(--font-space-mono)" }}>
                  {atolye.category ?? "—"}
                </span>
                <span className="col-span-2 text-[12px] text-[#747878] truncate" style={{ fontFamily: "var(--font-inter)" }}>
                  {atolye.ownerName ?? "—"}
                </span>
                <span className="col-span-1">
                  <span className={`text-[9px] font-[700] tracking-[0.1em] uppercase px-2 py-1 ${atolye.isActive ? "bg-[#DFFF00] text-[#111111]" : "border border-[#c4c7c7] text-[#c4c7c7]"}`} style={{ fontFamily: "var(--font-space-mono)" }}>
                    {atolye.isActive ? "AKTİF" : "PASİF"}
                  </span>
                </span>
                <div className="col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedId(atolye.id)}
                    className="text-[11px] font-[700] tracking-[0.1em] uppercase text-[#111111] hover:text-[#FF4A00] transition-none"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                  >
                    DÜZENLE
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {/* Modal */}
      {selectedId && selectedAtolyeObj && (
        <AtolyeModal
          atolye={selectedAtolyeObj}
          customCategories={customCategories}
          onClose={() => setSelectedId(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}
