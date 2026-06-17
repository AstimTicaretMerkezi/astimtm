"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ─── Working hours ────────────────────────────────────────────────────────────

const DAYS = [
  { key: "Pzt", label: "Pazartesi" },
  { key: "Sal", label: "Salı" },
  { key: "Çar", label: "Çarşamba" },
  { key: "Per", label: "Perşembe" },
  { key: "Cum", label: "Cuma" },
  { key: "Cmt", label: "Cumartesi" },
  { key: "Paz", label: "Pazar" },
];

const CATEGORIES = [
  "Tekstil", "Ayakkabı", "Elektronik", "Gıda", "Hırdavat",
  "Mobilya", "Kozmetik", "Spor", "Oyuncak", "Kırtasiye", "Diğer",
];

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

type AtolyeData = {
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

// ─── Edit Modal ───────────────────────────────────────────────────────────────

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

function AtolyeEditModal({
  atolyeId,
  atolye,
  onClose,
  onSaved,
}: {
  atolyeId: string;
  atolye: AtolyeData | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    businessName: atolye?.businessName ?? "",
    ownerName: atolye?.ownerName ?? "",
    category: atolye?.category ?? "",
    taxNumber: atolye?.taxNumber ?? "",
    address: atolye?.address ?? "",
    phone: atolye?.phone ?? "",
    whatsapp: atolye?.whatsapp ?? "",
    website: atolye?.website ?? "",
    instagram: atolye?.instagram ?? "",
    description: atolye?.description ?? "",
  });
  const [logo, setLogo] = useState<string | null>(atolye?.logo ?? null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [workingHours, setWorkingHours] = useState<WorkingHoursMap>(() =>
    parseWorkingHours(atolye?.workingHours)
  );
  const [brands, setBrands] = useState<string[]>(atolye?.brands ?? []);
  const [brandInput, setBrandInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function addBrand() {
    const val = brandInput.trim();
    if (!val || brands.includes(val)) return;
    setBrands((b) => [...b, val]);
    setBrandInput("");
  }

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
    data.append("atolyeId", atolyeId);
    const res = await fetch("/api/panel/logo", { method: "POST", body: data });
    setLogoUploading(false);
    if (res.ok) { const { url } = await res.json(); setLogo(url); }
    else setError("Logo yüklenemedi.");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/panel/atolye", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        logo,
        workingHours: serializeWorkingHours(workingHours),
        brands,
      }),
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
              ATÖLYE PANELİ — {atolyeId}
            </p>
            <h2 className="text-[20px] font-[900] tracking-[-0.02em] uppercase text-[#F4F3F0]" style={{ fontFamily: "var(--font-hanken)" }}>
              ATÖLYEMİ DÜZENLE
            </h2>
          </div>
          <button type="button" onClick={onClose} className="text-[#F4F3F0]/40 hover:text-[#FF4A00] text-[18px] font-[700] leading-none transition-none">
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto flex-1">

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
                  <p className="text-[10px] text-[#c4c7c7]" style={{ fontFamily: "var(--font-space-mono)" }}>
                    Maks. 5MB · PNG, JPG, WEBP · 400×400px
                  </p>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleLogoChange} />
            </div>

            {/* KATEGORİ */}
            <div className="border-b border-[#111111] px-6 py-4 flex flex-col gap-2">
              <label className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>KATEGORİ</label>
              <select
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                className="border border-[#111111] bg-[#F4F3F0] px-4 py-2.5 text-[14px] outline-none focus:border-[#FF4A00]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <option value="">— Seçin —</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Text fields (2 columns) */}
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
              <div className="flex flex-col border border-[#111111]">
                {DAYS.map(({ key, label }, i) => {
                  const day = workingHours[key] ?? DEFAULT_HOURS[key];
                  return (
                    <div
                      key={key}
                      className={`flex items-center gap-3 px-4 py-3 ${i < DAYS.length - 1 ? "border-b border-[#111111]" : ""}`}
                    >
                      <span className="text-[11px] font-[700] uppercase w-24 flex-shrink-0" style={{ fontFamily: "var(--font-space-mono)" }}>
                        {label}
                      </span>
                      <button
                        type="button"
                        onClick={() => setDay(key, { open: !day.open })}
                        className={`px-3 py-1 text-[10px] font-[700] tracking-[0.08em] uppercase transition-none flex-shrink-0 ${
                          day.open ? "bg-[#DFFF00] text-[#111111]" : "border border-[#c4c7c7] text-[#c4c7c7]"
                        }`}
                        style={{ fontFamily: "var(--font-space-mono)" }}
                      >
                        {day.open ? "AÇIK" : "KAPALI"}
                      </button>
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

            {/* AÇIKLAMA */}
            <div className="border-b border-[#111111] px-6 py-4 flex flex-col gap-2">
              <label className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>AÇIKLAMA</label>
              <textarea
                rows={3}
                placeholder="Atölyenizi kısaca tanıtın..."
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

// ─── Main Panel Client ────────────────────────────────────────────────────────

export default function PanelClient({
  atolyeId,
  atolye,
}: {
  atolyeId: string | null;
  atolye: AtolyeData | null;
}) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  function handleSaved() {
    setShowModal(false);
    router.refresh();
  }

  return (
    <>
      <div className="border-b border-[#111111] pb-6">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#FF4A00] mb-1" style={{ fontFamily: "var(--font-space-mono)" }}>
          ATÖLYE PANELİ
        </p>
        <h1 className="text-[40px] font-[900] tracking-[-0.03em] uppercase" style={{ fontFamily: "var(--font-hanken)" }}>
          HOŞ GELDİNİZ
        </h1>
      </div>

      {!atolyeId ? (
        <div className="border border-[#111111] p-8 text-center">
          <p className="text-[14px] text-[#747878]" style={{ fontFamily: "var(--font-inter)" }}>
            Henüz bir atölye atanmadı. Lütfen yöneticinizle iletişime geçin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Atölye bilgi kartı */}
          <div className="border border-[#111111] p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-[700] tracking-[0.2em] uppercase text-[#FF4A00]" style={{ fontFamily: "var(--font-space-mono)" }}>ATÖLYENİZ</span>
              <span
                className={`text-[10px] font-[700] tracking-[0.1em] uppercase px-2 py-1 ${atolye?.isActive ? "bg-[#DFFF00]" : "border border-[#c4c7c7] text-[#c4c7c7]"}`}
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {atolye?.isActive ? "AKTİF" : "PASİF"}
              </span>
            </div>
            <div>
              <p className="text-[32px] font-[900] tracking-[-0.03em] uppercase" style={{ fontFamily: "var(--font-hanken)" }}>{atolyeId}</p>
              <p className="text-[16px] font-[700] text-[#747878]" style={{ fontFamily: "var(--font-inter)" }}>
                {atolye?.businessName || "Henüz isim girilmedi"}
              </p>
            </div>
            {atolye?.category && (
              <span className="text-[11px] font-[700] tracking-[0.1em] uppercase border border-[#111111] px-2 py-1 self-start" style={{ fontFamily: "var(--font-space-mono)" }}>
                {atolye.category}
              </span>
            )}
          </div>

          {/* Düzenle butonu kartı */}
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="border border-[#111111] p-6 flex flex-col justify-between gap-4 hover:bg-[#111111] hover:text-[#F4F3F0] group transition-none text-left"
          >
            <span className="text-[10px] font-[700] tracking-[0.2em] uppercase text-[#FF4A00]" style={{ fontFamily: "var(--font-space-mono)" }}>ATÖLYE BİLGİLERİ</span>
            <div>
              <h2 className="text-[24px] font-[900] tracking-[-0.02em] uppercase" style={{ fontFamily: "var(--font-hanken)" }}>ATÖLYEMİ DÜZENLE →</h2>
              <p className="text-[13px] text-[#747878] group-hover:text-[#F4F3F0]/60 mt-2" style={{ fontFamily: "var(--font-inter)" }}>
                Logo, iletişim, açıklama ve daha fazlası.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Firma Adı", done: !!atolye?.businessName },
                { label: "Telefon", done: !!atolye?.phone },
                { label: "Logo", done: !!atolye?.logo },
                { label: "Açıklama", done: !!atolye?.description },
              ].map((item) => (
                <span
                  key={item.label}
                  className={`text-[10px] font-[700] px-2 py-0.5 ${item.done ? "bg-[#DFFF00] text-[#111111]" : "border border-[#c4c7c7] text-[#c4c7c7] group-hover:border-[#F4F3F0]/20 group-hover:text-[#F4F3F0]/40"}`}
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  {item.done ? "✓ " : ""}{item.label}
                </span>
              ))}
            </div>
          </button>
        </div>
      )}

      {showModal && atolyeId && (
        <AtolyeEditModal
          atolyeId={atolyeId}
          atolye={atolye}
          onClose={() => setShowModal(false)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}
