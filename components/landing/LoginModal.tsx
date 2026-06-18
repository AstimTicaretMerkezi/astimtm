"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (res?.error) {
      setError("E-posta veya şifre hatalı.");
      return;
    }

    const session = await fetch("/api/auth/session").then((r) => r.json());
    if (session?.user?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/panel");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#111111]/70" />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-sm mx-4 border border-[#111111] bg-[#F4F3F0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-[#111111] px-8 py-6">
          <p
            className="text-[10px] tracking-[0.2em] uppercase text-[#FF4A00] mb-1"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            YÖNETİM PANELİ
          </p>
          <h2
            className="text-[28px] font-[900] tracking-[-0.03em] uppercase"
            style={{ fontFamily: "var(--font-hanken)" }}
          >
            GİRİŞ YAP
          </h2>
        </div>

        {/* Fields */}
        <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label
              className="text-[10px] tracking-[0.15em] uppercase text-[#747878]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              E-POSTA
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="border border-[#111111] bg-transparent px-4 py-3 text-[14px] text-[#111111] outline-none focus:border-[#FF4A00]"
              style={{ fontFamily: "var(--font-inter)" }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-[10px] tracking-[0.15em] uppercase text-[#747878]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              ŞİFRE
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-[#111111] bg-transparent px-4 py-3 pr-12 text-[14px] text-[#111111] outline-none focus:border-[#FF4A00]"
                style={{ fontFamily: "var(--font-inter)" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#747878] hover:text-[#111111]"
                aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <p
              className="text-[11px] text-[#FF4A00] tracking-wide"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {error}
            </p>
          )}

          {/* Footer */}
          <div className="flex gap-2 mt-2 border-t border-[#111111] pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#111111] px-4 py-3 text-[11px] font-[700] tracking-[0.1em] uppercase hover:bg-[#111111] hover:text-[#F4F3F0] transition-none"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              İPTAL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#111111] text-[#F4F3F0] px-4 py-3 text-[11px] font-[700] tracking-[0.1em] uppercase hover:bg-[#FF4A00] transition-none disabled:opacity-40"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {loading ? "GİRİŞ..." : "GİRİŞ YAP →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
