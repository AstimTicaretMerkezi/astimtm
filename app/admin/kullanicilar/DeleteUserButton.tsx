"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteUserButton({ userId, userName }: { userId: string; userName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`"${userName}" kullanıcısını silmek istediğinize emin misiniz?`)) return;
    setLoading(true);
    const res = await fetch(`/api/admin/kullanicilar/${userId}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) router.refresh();
    else alert("Silme işlemi başarısız.");
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-[11px] font-[700] tracking-[0.1em] uppercase text-[#747878] hover:text-[#FF4A00] transition-none disabled:opacity-40"
      style={{ fontFamily: "var(--font-space-mono)" }}
    >
      {loading ? "..." : "SİL"}
    </button>
  );
}
