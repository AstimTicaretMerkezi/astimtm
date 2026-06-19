"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { label: "PANEL", href: "/admin" },
  { label: "KULLANICILAR", href: "/admin/kullanicilar" },
  { label: "ATÖLYELER", href: "/admin/atolyeler" },
];

export default function AdminLayoutClient({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F3F0] flex flex-col">
      <header className="bg-[#111111] text-[#F4F3F0] border-b border-[#F4F3F0]/20 px-[2rem] h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="h-7 w-7 relative">
              <Image src="/images/logo_trans.png" alt="ASTİM" fill sizes="28px" className="object-contain brightness-0 invert" />
            </div>
            <span className="text-[13px] font-[900] tracking-tighter uppercase" style={{ fontFamily: "var(--font-hanken)" }}>
              ASTİM — YÖNETİM
            </span>
          </Link>
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="px-3 py-1.5 text-[11px] font-[700] tracking-[0.1em] uppercase text-[#F4F3F0]/60 hover:text-[#F4F3F0] transition-none" style={{ fontFamily: "var(--font-space-mono)" }}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[11px] text-[#DFFF00] font-[700] tracking-[0.1em] uppercase hidden md:block" style={{ fontFamily: "var(--font-space-mono)" }}>
            {name}
          </span>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="hidden md:block text-[11px] font-[700] tracking-[0.1em] uppercase text-[#F4F3F0]/60 hover:text-[#FF4A00] transition-none"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            ÇIKIŞ →
          </button>
          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menü"
          >
            {menuOpen ? (
              <>
                <span className="w-5 h-px bg-[#F4F3F0] rotate-45 translate-y-[3px]" />
                <span className="w-5 h-px bg-[#F4F3F0] -rotate-45 -translate-y-[3px]" />
              </>
            ) : (
              <>
                <span className="w-5 h-px bg-[#F4F3F0]" />
                <span className="w-5 h-px bg-[#F4F3F0]" />
                <span className="w-5 h-px bg-[#F4F3F0]" />
              </>
            )}
          </button>
        </div>
      </header>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-[#111111] border-b border-[#F4F3F0]/20 flex flex-col">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="px-8 py-4 text-[12px] font-[700] tracking-[0.1em] uppercase text-[#F4F3F0]/70 hover:text-[#FF4A00] border-b border-[#F4F3F0]/10 transition-none"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {l.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-8 py-4 text-left text-[12px] font-[700] tracking-[0.1em] uppercase text-[#FF4A00] transition-none"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            ÇIKIŞ →
          </button>
        </div>
      )}

      <main className="flex-1 p-[2rem]">{children}</main>
    </div>
  );
}
