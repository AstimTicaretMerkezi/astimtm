"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import YeniKullaniciModal from "@/components/admin/YeniKullaniciModal";

type Stat = { label: string; value: number };
type User = { id: string; name: string; email: string; role: string; atolyeId: string | null };

export default function AdminDashboardClient({
  stats,
  recentUsers,
  firmIds,
}: {
  stats: Stat[];
  recentUsers: User[];
  firmIds: string[];
}) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  function handleCreated() {
    setShowModal(false);
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="border-b border-[#111111] pb-6 flex items-end justify-between">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#FF4A00] mb-1" style={{ fontFamily: "var(--font-space-mono)" }}>
              YÖNETİM PANELİ
            </p>
            <h1 className="text-[40px] font-[900] tracking-[-0.03em] uppercase" style={{ fontFamily: "var(--font-hanken)" }}>
              GENEL BAKIŞ
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

        <div className="grid grid-cols-2 md:grid-cols-4 border border-[#111111]">
          {stats.map((s, i) => (
            <div key={s.label} className={`p-6 flex flex-col gap-2 ${i < stats.length - 1 ? "border-r border-[#111111]" : ""}`}>
              <span className="text-[36px] font-[900] tracking-[-0.03em] text-[#111111]" style={{ fontFamily: "var(--font-hanken)" }}>
                {s.value}
              </span>
              <span className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="border border-[#111111] p-6 flex flex-col gap-3 hover:bg-[#111111] hover:text-[#F4F3F0] group transition-none text-left"
          >
            <span className="text-[10px] font-[700] tracking-[0.2em] uppercase text-[#FF4A00]" style={{ fontFamily: "var(--font-space-mono)" }}>
              KULLANICI YÖNETİMİ
            </span>
            <h2 className="text-[24px] font-[900] tracking-[-0.02em] uppercase" style={{ fontFamily: "var(--font-hanken)" }}>
              YENİ KULLANICI OLUŞTUR →
            </h2>
            <p className="text-[13px] text-[#747878] group-hover:text-[#F4F3F0]/60" style={{ fontFamily: "var(--font-inter)" }}>
              Kiracı veya mülk sahibi ekle, atölye ata.
            </p>
          </button>
          <Link href="/admin/kullanicilar" className="border border-[#111111] p-6 flex flex-col gap-3 hover:bg-[#111111] hover:text-[#F4F3F0] group transition-none">
            <span className="text-[10px] font-[700] tracking-[0.2em] uppercase text-[#FF4A00]" style={{ fontFamily: "var(--font-space-mono)" }}>
              KULLANICI LİSTESİ
            </span>
            <h2 className="text-[24px] font-[900] tracking-[-0.02em] uppercase" style={{ fontFamily: "var(--font-hanken)" }}>
              KULLANICILARI GÖRÜNTÜLE →
            </h2>
            <p className="text-[13px] text-[#747878] group-hover:text-[#F4F3F0]/60" style={{ fontFamily: "var(--font-inter)" }}>
              Mevcut kullanıcıları düzenle veya sil.
            </p>
          </Link>
        </div>

        <div className="border border-[#111111]">
          <div className="border-b border-[#111111] px-6 py-4 flex items-center justify-between">
            <span className="text-[11px] font-[700] tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-space-mono)" }}>
              SON KULLANICILAR
            </span>
            <Link href="/admin/kullanicilar" className="text-[11px] font-[700] tracking-[0.1em] uppercase text-[#FF4A00] hover:text-[#111111]" style={{ fontFamily: "var(--font-space-mono)" }}>
              TÜMÜNÜ GÖR →
            </Link>
          </div>
          {recentUsers.map((user, i) => (
            <div key={user.id} className={`px-6 py-4 flex items-center justify-between ${i < recentUsers.length - 1 ? "border-b border-[#111111]" : ""}`}>
              <div className="flex flex-col gap-0.5">
                <span className="text-[14px] font-[700] text-[#111111]" style={{ fontFamily: "var(--font-inter)" }}>{user.name}</span>
                <span className="text-[11px] text-[#747878]" style={{ fontFamily: "var(--font-space-mono)" }}>{user.email}</span>
              </div>
              <div className="flex items-center gap-4">
                {user.atolyeId && (
                  <span className="text-[10px] font-[700] tracking-[0.1em] uppercase bg-[#DFFF00] px-2 py-1" style={{ fontFamily: "var(--font-space-mono)" }}>
                    {user.atolyeId}
                  </span>
                )}
                <span className={`text-[10px] font-[700] tracking-[0.1em] uppercase px-2 py-1 ${user.role === "admin" ? "bg-[#FF4A00] text-[#F4F3F0]" : "border border-[#111111]"}`} style={{ fontFamily: "var(--font-space-mono)" }}>
                  {user.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <YeniKullaniciModal
          firmIds={firmIds}
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </>
  );
}
