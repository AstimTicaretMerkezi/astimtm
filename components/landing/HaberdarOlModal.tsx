"use client";

import { useEffect, useRef, useState } from "react";

export default function HaberdarOlModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Bir hata oluştu."); return; }
      setSuccess(true);
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(17,17,17,0.75)" }}
    >
      <div
        className="bg-[#F4F3F0] border border-[#111111] w-full max-w-md flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-[#111111] px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#FF4A00] mb-0.5" style={{ fontFamily: "var(--font-space-mono)" }}>
              BÜLTEN
            </p>
            <h2 className="text-[20px] font-[900] tracking-[-0.03em] uppercase" style={{ fontFamily: "var(--font-hanken)" }}>
              HABERDAR OL
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#595C5C] hover:text-[#111111] text-[20px] leading-none transition-none"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            ✕
          </button>
        </div>

        {success ? (
          <div className="px-6 py-10 flex flex-col items-center gap-4 text-center">
            <span className="text-[40px] font-[900] text-[#FF4A00]" style={{ fontFamily: "var(--font-hanken)" }}>✓</span>
            <p className="text-[14px] font-[700] uppercase tracking-wide" style={{ fontFamily: "var(--font-space-mono)" }}>
              Kaydınız Alındı
            </p>
            <p className="text-[13px] text-[#595C5C]" style={{ fontFamily: "var(--font-inter)" }}>
              Gelişmeler ve haberlerden ilk siz haberdar olacaksınız.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 bg-[#111111] text-[#F4F3F0] px-8 py-3 text-[11px] font-[700] uppercase tracking-widest hover:bg-[#FF4A00] transition-none"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              KAPAT
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6 flex flex-col gap-4">
              <p className="text-[13px] text-[#595C5C]" style={{ fontFamily: "var(--font-inter)" }}>
                ASTİM Ticaret Merkezi'ndeki gelişmeler, açılışlar ve etkinliklerden haberdar olmak için kaydolun.
              </p>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-[700] tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-space-mono)" }}>
                  ADINIZ
                </label>
                <input
                  ref={nameRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ad Soyad"
                  className="border border-[#111111] px-4 py-3 text-[14px] bg-[#F4F3F0] focus:outline-none focus:border-[#FF4A00] placeholder:text-[#9a9d9d]"
                  style={{ fontFamily: "var(--font-inter)" }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-[700] tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-space-mono)" }}>
                  E-POSTA
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="ornek@mail.com"
                  className="border border-[#111111] px-4 py-3 text-[14px] bg-[#F4F3F0] focus:outline-none focus:border-[#FF4A00] placeholder:text-[#9a9d9d]"
                  style={{ fontFamily: "var(--font-inter)" }}
                />
              </div>

              {error && (
                <p className="text-[12px] text-[#FF4A00] font-[700]" style={{ fontFamily: "var(--font-space-mono)" }}>
                  {error}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-[#111111] px-6 py-4 flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-[11px] font-[700] uppercase tracking-widest border border-[#111111] hover:bg-[#111111] hover:text-[#F4F3F0] transition-none"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                İPTAL
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 text-[11px] font-[700] uppercase tracking-widest bg-[#111111] text-[#F4F3F0] hover:bg-[#FF4A00] transition-none disabled:opacity-50"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {loading ? "GÖNDERİLİYOR..." : "KAYIT OL"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
