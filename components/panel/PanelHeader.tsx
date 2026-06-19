"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function PanelHeader({ name }: { name: string }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header className="bg-[#111111] text-[#F4F3F0] border-b border-[#F4F3F0]/20 px-[2rem] h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/panel" className="flex items-center gap-3">
            <div className="h-7 w-7 relative">
              <Image src="/images/logo_trans.png" alt="ASTİM" fill sizes="28px" className="object-contain brightness-0 invert" />
            </div>
            <span className="text-[13px] font-[900] tracking-tighter uppercase" style={{ fontFamily: "var(--font-hanken)" }}>
              ASTİM — ATÖLYE PANELİ
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/panel" className="px-3 py-1.5 text-[11px] font-[700] tracking-[0.1em] uppercase text-[#F4F3F0]/60 hover:text-[#F4F3F0] transition-none" style={{ fontFamily: "var(--font-space-mono)" }}>
              PANEL
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[11px] text-[#DFFF00] font-[700] tracking-[0.1em] uppercase hidden md:block" style={{ fontFamily: "var(--font-space-mono)" }}>
            {name}
          </span>
          <button
            onClick={() => setShowModal(true)}
            className="text-[11px] font-[700] tracking-[0.1em] uppercase text-[#F4F3F0]/60 hover:text-[#F4F3F0] transition-none hidden md:block"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            ŞİFRE DEĞİŞTİR
          </button>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-[11px] font-[700] tracking-[0.1em] uppercase text-[#F4F3F0]/60 hover:text-[#FF4A00] transition-none"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            ÇIKIŞ →
          </button>
        </div>
      </header>

      {showModal && <SifreDegistirModal onClose={() => setShowModal(false)} />}
    </>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function SifreDegistirModal({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const mismatch = confirm.length > 0 && next !== confirm;
  const tooShort = next.length > 0 && next.length < 6;

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (next !== confirm) { setError("Yeni şifreler eşleşmiyor."); return; }
    if (next.length < 6) { setError("Şifre en az 6 karakter olmalı."); return; }

    setLoading(true);
    const res = await fetch("/api/panel/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Bir hata oluştu.");
      return;
    }
    setSuccess(true);
    setTimeout(onClose, 1500);
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-[#111111]/70" />
      <div className="relative z-10 w-full max-w-sm mx-4 border border-[#111111] bg-[#F4F3F0]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="border-b border-[#111111] px-8 py-6">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#FF4A00] mb-1" style={{ fontFamily: "var(--font-space-mono)" }}>
            HESAP
          </p>
          <h2 className="text-[24px] font-[900] tracking-[-0.03em] uppercase" style={{ fontFamily: "var(--font-hanken)" }}>
            ŞİFRE DEĞİŞTİR
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-4">
          {/* Mevcut şifre */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>
              MEVCUT ŞİFRE
            </label>
            <div className="relative">
              <input type={show.current ? "text" : "password"} value={current} onChange={(e) => setCurrent(e.target.value)} required
                className="w-full border border-[#111111] bg-transparent px-4 py-3 pr-10 text-[14px] text-[#111111] outline-none focus:border-[#FF4A00]"
                style={{ fontFamily: "var(--font-inter)" }} />
              <button type="button" onClick={() => setShow((s) => ({ ...s, current: !s.current }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#747878] hover:text-[#111111]">
                <EyeIcon open={show.current} />
              </button>
            </div>
          </div>

          {/* Yeni şifre */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>
              YENİ ŞİFRE
            </label>
            <div className="relative">
              <input type={show.next ? "text" : "password"} value={next} onChange={(e) => setNext(e.target.value)} required
                className={`w-full border bg-transparent px-4 py-3 pr-10 text-[14px] text-[#111111] outline-none focus:border-[#FF4A00] ${tooShort ? "border-[#FF4A00]" : "border-[#111111]"}`}
                style={{ fontFamily: "var(--font-inter)" }} />
              <button type="button" onClick={() => setShow((s) => ({ ...s, next: !s.next }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#747878] hover:text-[#111111]">
                <EyeIcon open={show.next} />
              </button>
            </div>
            {tooShort && <p className="text-[10px] text-[#FF4A00]" style={{ fontFamily: "var(--font-space-mono)" }}>En az 6 karakter olmalı</p>}
          </div>

          {/* Yeni şifre tekrar */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>
              YENİ ŞİFRE (TEKRAR)
            </label>
            <div className="relative">
              <input type={show.confirm ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} required
                className={`w-full border bg-transparent px-4 py-3 pr-10 text-[14px] text-[#111111] outline-none focus:border-[#FF4A00] ${mismatch ? "border-[#FF4A00]" : "border-[#111111]"}`}
                style={{ fontFamily: "var(--font-inter)" }} />
              <button type="button" onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#747878] hover:text-[#111111]">
                <EyeIcon open={show.confirm} />
              </button>
            </div>
            {mismatch && <p className="text-[10px] text-[#FF4A00]" style={{ fontFamily: "var(--font-space-mono)" }}>Şifreler eşleşmiyor</p>}
            {!mismatch && confirm.length > 0 && next === confirm && (
              <p className="text-[10px] text-[#111111]" style={{ fontFamily: "var(--font-space-mono)" }}>Şifreler eşleşiyor ✓</p>
            )}
          </div>

          {error && (
            <p className="text-[11px] text-[#FF4A00] tracking-wide" style={{ fontFamily: "var(--font-space-mono)" }}>
              {error}
            </p>
          )}
          {success && (
            <p className="text-[11px] text-[#111111] tracking-wide" style={{ fontFamily: "var(--font-space-mono)" }}>
              Şifre başarıyla güncellendi.
            </p>
          )}

          <div className="flex gap-2 mt-2 border-t border-[#111111] pt-6">
            <button type="button" onClick={onClose} className="flex-1 border border-[#111111] px-4 py-3 text-[11px] font-[700] tracking-[0.1em] uppercase hover:bg-[#111111] hover:text-[#F4F3F0] transition-none" style={{ fontFamily: "var(--font-space-mono)" }}>
              İPTAL
            </button>
            <button type="submit" disabled={loading || success} className="flex-1 bg-[#111111] text-[#F4F3F0] px-4 py-3 text-[11px] font-[700] tracking-[0.1em] uppercase hover:bg-[#FF4A00] transition-none disabled:opacity-40" style={{ fontFamily: "var(--font-space-mono)" }}>
              {loading ? "KAYDEDİLİYOR..." : "KAYDET →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
