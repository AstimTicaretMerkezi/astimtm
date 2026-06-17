"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function GirisPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("E-posta veya şifre hatalı.");
      return;
    }

    // Role göre yönlendir
    const session = await fetch("/api/auth/session").then((r) => r.json());
    if (session?.user?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/panel");
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F3F0] flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-[#111111] px-[2rem] h-16 flex items-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 relative">
            <Image src="/images/logo_trans.png" alt="ASTİM" fill sizes="32px" className="object-contain" />
          </div>
          <span
            className="text-[14px] font-[900] tracking-tighter uppercase text-[#111111]"
            style={{ fontFamily: "var(--font-hanken)" }}
          >
            ASTİM TİCARET MERKEZİ
          </span>
        </div>
      </nav>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm border border-[#111111] bg-[#F4F3F0]">
          {/* Header */}
          <div className="border-b border-[#111111] px-8 py-6">
            <p
              className="text-[10px] tracking-[0.2em] uppercase text-[#FF4A00] mb-1"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              YÖNETİM PANELİ
            </p>
            <h1
              className="text-[28px] font-[900] tracking-[-0.03em] uppercase"
              style={{ fontFamily: "var(--font-hanken)" }}
            >
              GİRİŞ YAP
            </h1>
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

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-[#111111] text-[#F4F3F0] px-8 py-4 text-[12px] font-[700] tracking-[0.1em] uppercase hover:bg-[#FF4A00] transition-none disabled:opacity-40"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {loading ? "GİRİŞ YAPILIYOR..." : "GİRİŞ YAP →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
