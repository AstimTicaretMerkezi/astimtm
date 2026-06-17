"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/github";

const ROLES = [
  { value: "kiracı", label: "Kiracı" },
  { value: "mülk-sahibi", label: "Mülk Sahibi" },
];

const TUM_ATOLYELER = [
  ...Array.from({ length: 5 }, (_, i) => `A-${String(i + 1).padStart(2, "0")}`),
  ...Array.from({ length: 12 }, (_, i) => `B-${String(i + 1).padStart(2, "0")}`),
  ...Array.from({ length: 12 }, (_, i) => `C-${String(i + 1).padStart(2, "0")}`),
];

export default function EditUserForm({ user }: { user: User }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    password: "",
    role: user.role,
    atolyeId: user.atolyeId ?? "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    const res = await fetch(`/api/admin/kullanicilar/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) { setSuccess(true); router.refresh(); }
    else { const data = await res.json(); setError(data.error || "Bir hata oluştu."); }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-[#111111] flex flex-col">
      {[
        { key: "name", label: "AD SOYAD", type: "text" },
        { key: "email", label: "E-POSTA", type: "email" },
      ].map((field) => (
        <div key={field.key} className="border-b border-[#111111] p-6 flex flex-col gap-2">
          <label className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>{field.label}</label>
          <input type={field.type} required value={(form as any)[field.key]} onChange={(e) => set(field.key, e.target.value)} className="border border-[#111111] bg-transparent px-4 py-3 text-[14px] outline-none focus:border-[#FF4A00]" style={{ fontFamily: "var(--font-inter)" }} />
        </div>
      ))}

      <div className="border-b border-[#111111] p-6 flex flex-col gap-2">
        <label className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>
          YENİ ŞİFRE <span className="normal-case text-[#c4c7c7]">(boş bırakırsan değişmez)</span>
        </label>
        <div className="relative">
          <input type={showPassword ? "text" : "password"} placeholder="Değiştirmek için yaz" value={form.password} onChange={(e) => set("password", e.target.value)} className="w-full border border-[#111111] bg-transparent px-4 py-3 pr-12 text-[14px] outline-none focus:border-[#FF4A00]" style={{ fontFamily: "var(--font-inter)" }} />
          <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#747878] hover:text-[#111111]">
            {showPassword ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
          </button>
        </div>
      </div>

      {user.role !== "admin" && (
        <>
          <div className="border-b border-[#111111] p-6 flex flex-col gap-2">
            <label className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>ROL</label>
            <select value={form.role} onChange={(e) => set("role", e.target.value)} className="border border-[#111111] bg-[#F4F3F0] px-4 py-3 text-[14px] outline-none focus:border-[#FF4A00]" style={{ fontFamily: "var(--font-inter)" }}>
              {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div className="border-b border-[#111111] p-6 flex flex-col gap-2">
            <label className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>ATÖLYE</label>
            <select value={form.atolyeId} onChange={(e) => set("atolyeId", e.target.value)} className="border border-[#111111] bg-[#F4F3F0] px-4 py-3 text-[14px] outline-none focus:border-[#FF4A00]" style={{ fontFamily: "var(--font-inter)" }}>
              <option value="">— Atölye seçilmedi —</option>
              {TUM_ATOLYELER.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </>
      )}

      {error && <div className="px-6 py-3 bg-[#FF4A00]/10 border-b border-[#111111]"><p className="text-[12px] text-[#FF4A00] font-[700]" style={{ fontFamily: "var(--font-space-mono)" }}>{error}</p></div>}
      {success && <div className="px-6 py-3 bg-[#DFFF00]/20 border-b border-[#111111]"><p className="text-[12px] text-[#111111] font-[700]" style={{ fontFamily: "var(--font-space-mono)" }}>Kaydedildi.</p></div>}

      <div className="p-6">
        <button type="submit" disabled={loading} className="w-full bg-[#111111] text-[#F4F3F0] px-8 py-4 text-[12px] font-[700] tracking-[0.1em] uppercase hover:bg-[#FF4A00] transition-none disabled:opacity-40" style={{ fontFamily: "var(--font-space-mono)" }}>
          {loading ? "KAYDEDİLİYOR..." : "KAYDET →"}
        </button>
      </div>
    </form>
  );
}
