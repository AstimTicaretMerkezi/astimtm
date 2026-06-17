"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DeleteUserButton from "./DeleteUserButton";
import YeniKullaniciModal from "@/components/admin/YeniKullaniciModal";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  atolyeId: string | null;
};

// ─── Main Client Component ────────────────────────────────────────────────────

export default function KullanicilarClient({ users, firmIds }: { users: User[]; firmIds: string[] }) {
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
          firmIds={firmIds}
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </>
  );
}
