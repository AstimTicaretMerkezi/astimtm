"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DeleteUserButton from "./DeleteUserButton";

const ROLES = [
  { value: "kiracı", label: "Kiracı" },
  { value: "mülk-sahibi", label: "Mülk Sahibi" },
];

const TUM_ATOLYELER = [
  ...Array.from({ length: 5 }, (_, i) => `A-${String(i + 1).padStart(2, "0")}`),
  ...Array.from({ length: 12 }, (_, i) => `B-${String(i + 1).padStart(2, "0")}`),
  ...Array.from({ length: 12 }, (_, i) => `C-${String(i + 1).padStart(2, "0")}`),
];

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  atolyeId: string | null;
};

// ─── New User Modal ───────────────────────────────────────────────────────────

function YeniKullaniciModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "kiracı", atolyeId: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/kullanicilar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      onCreated();
    } else {
      const data = await res.json();
      setError(data.error || "Bir hata oluştu.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(17,17,17,0.7)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#F4F3F0] border border-[#111111] w-full max-w-lg flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="bg-[#111111] px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#FF4A00]" style={{ fontFamily: "var(--font-space-mono)" }}>
              YÖNETİM PANELİ
            </p>
            <h2 className="text-[20px] font-[900] tracking-[-0.02em] uppercase text-[#F4F3F0]" style={{ fontFamily: "var(--font-hanken)" }}>
              YENİ KULLANICI
            </h2>
          </div>
          <button type="button" onClick={onClose} className="text-[#F4F3F0]/40 hover:text-[#FF4A00] text-[18px] font-[700] leading-none transition-none">
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto flex-1">

            {/* AD SOYAD */}
            <div className="border-b border-[#111111] px-6 py-4 flex flex-col gap-2">
              <label className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>AD SOYAD</label>
              <input
                type="text" required placeholder="Ahmet Yılmaz"
                value={form.name} onChange={(e) => set("name", e.target.value)}
                className="border border-[#111111] bg-transparent px-4 py-3 text-[14px] outline-none focus:border-[#FF4A00]"
                style={{ fontFamily: "var(--font-inter)" }}
              />
            </div>

            {/* E-POSTA */}
            <div className="border-b border-[#111111] px-6 py-4 flex flex-col gap-2">
              <label className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>E-POSTA</label>
              <input
                type="email" required placeholder="ahmet@example.com"
                value={form.email} onChange={(e) => set("email", e.target.value)}
                className="border border-[#111111] bg-transparent px-4 py-3 text-[14px] outline-none focus:border-[#FF4A00]"
                style={{ fontFamily: "var(--font-inter)" }}
              />
            </div>

            {/* ŞİFRE */}
            <div className="border-b border-[#111111] px-6 py-4 flex flex-col gap-2">
              <label className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>ŞİFRE</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} required placeholder="En az 8 karakter"
                  value={form.password} onChange={(e) => set("password", e.target.value)}
                  className="w-full border border-[#111111] bg-transparent px-4 py-3 pr-12 text-[14px] outline-none focus:border-[#FF4A00]"
                  style={{ fontFamily: "var(--font-inter)" }}
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#747878] hover:text-[#111111]">
                  {showPassword
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* ROL */}
            <div className="border-b border-[#111111] px-6 py-4 flex flex-col gap-2">
              <label className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>ROL</label>
              <select
                value={form.role} onChange={(e) => set("role", e.target.value)}
                className="border border-[#111111] bg-[#F4F3F0] px-4 py-3 text-[14px] outline-none focus:border-[#FF4A00]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>

            {/* ATÖLYE ATA */}
            <div className="border-b border-[#111111] px-6 py-4 flex flex-col gap-2">
              <label className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>ATÖLYE ATA <span className="font-[400] normal-case tracking-normal">(opsiyonel)</span></label>
              <select
                value={form.atolyeId} onChange={(e) => set("atolyeId", e.target.value)}
                className="border border-[#111111] bg-[#F4F3F0] px-4 py-3 text-[14px] outline-none focus:border-[#FF4A00]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <option value="">— Atölye seçilmedi —</option>
                {TUM_ATOLYELER.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
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
              type="button" onClick={onClose}
              className="flex-1 border border-[#111111] text-[#111111] px-6 py-3 text-[11px] font-[700] tracking-[0.1em] uppercase hover:bg-[#111111] hover:text-[#F4F3F0] transition-none"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              İPTAL
            </button>
            <button
              type="submit" disabled={loading}
              className="flex-1 bg-[#111111] text-[#F4F3F0] px-6 py-3 text-[11px] font-[700] tracking-[0.1em] uppercase hover:bg-[#FF4A00] transition-none disabled:opacity-40"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {loading ? "KAYDEDİLİYOR..." : "KULLANICI OLUŞTUR →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export default function KullanicilarClient({ users }: { users: User[] }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  function handleCreated() {
    setShowModal(false);
    router.refresh();
  }

  return (
    <>
      {/* Header */}
      <div className="border-b border-[#111111] pb-6 flex items-end justify-between">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#FF4A00] mb-1" style={{ fontFamily: "var(--font-space-mono)" }}>
            YÖNETİM PANELİ
          </p>
          <h1 className="text-[40px] font-[900] tracking-[-0.03em] uppercase" style={{ fontFamily: "var(--font-hanken)" }}>
            KULLANICILAR
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="bg-[#111111] text-[#F4F3F0] px-6 py-3 text-[11px] font-[700] tracking-[0.1em] uppercase hover:bg-[#FF4A00] transition-none"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          + YENİ KULLANICI
        </button>
      </div>

      {/* Table */}
      <div className="border border-[#111111]">
        <div className="border-b border-[#111111] px-6 py-3 grid grid-cols-12 gap-4 bg-[#111111] text-[#F4F3F0]">
          {["AD SOYAD", "E-POSTA", "ROL", "ATÖLYE", "İŞLEMLER"].map((h, i) => (
            <span
              key={h}
              className={`text-[10px] font-[700] tracking-[0.15em] uppercase ${
                i === 0 ? "col-span-3" : i === 1 ? "col-span-3" : i === 2 ? "col-span-2" : i === 3 ? "col-span-2" : "col-span-2 text-right"
              }`}
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {h}
            </span>
          ))}
        </div>

        {users.length === 0 && (
          <div className="px-6 py-12 text-center text-[#747878] text-[13px]" style={{ fontFamily: "var(--font-inter)" }}>
            Henüz kullanıcı yok.
          </div>
        )}

        {users.map((user, i) => (
          <div
            key={user.id}
            className={`px-6 py-4 grid grid-cols-12 gap-4 items-center ${i < users.length - 1 ? "border-b border-[#111111]" : ""}`}
          >
            <span className="col-span-3 text-[14px] font-[700] text-[#111111] truncate" style={{ fontFamily: "var(--font-inter)" }}>
              {user.name}
            </span>
            <span className="col-span-3 text-[12px] text-[#747878] truncate" style={{ fontFamily: "var(--font-space-mono)" }}>
              {user.email}
            </span>
            <span className="col-span-2">
              <span
                className={`text-[10px] font-[700] tracking-[0.1em] uppercase px-2 py-1 ${user.role === "admin" ? "bg-[#FF4A00] text-[#F4F3F0]" : "border border-[#111111]"}`}
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {user.role}
              </span>
            </span>
            <span className="col-span-2">
              {user.atolyeId ? (
                <span className="text-[10px] font-[700] tracking-[0.1em] uppercase bg-[#DFFF00] px-2 py-1" style={{ fontFamily: "var(--font-space-mono)" }}>
                  {user.atolyeId}
                </span>
              ) : (
                <span className="text-[11px] text-[#c4c7c7]" style={{ fontFamily: "var(--font-space-mono)" }}>—</span>
              )}
            </span>
            <div className="col-span-2 flex items-center justify-end gap-3">
              <Link
                href={`/admin/kullanicilar/${user.id}`}
                className="text-[11px] font-[700] tracking-[0.1em] uppercase text-[#111111] hover:text-[#FF4A00] transition-none"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                DÜZENLE
              </Link>
              {user.role !== "admin" && <DeleteUserButton userId={user.id} userName={user.name} />}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <YeniKullaniciModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </>
  );
}
