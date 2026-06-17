import { getUsers } from "@/lib/github";
import { notFound } from "next/navigation";
import EditUserForm from "./EditUserForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { users } = await getUsers();
  const user = users.find((u) => u.id === id);
  if (!user) notFound();

  return (
    <div className="flex flex-col gap-8 max-w-lg">
      <div className="border-b border-[#111111] pb-6">
        <Link href="/admin/kullanicilar" className="text-[10px] font-[700] tracking-[0.15em] uppercase text-[#747878] hover:text-[#FF4A00] mb-4 inline-block" style={{ fontFamily: "var(--font-space-mono)" }}>
          ← KULLANICILARA DÖN
        </Link>
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#FF4A00] mb-1" style={{ fontFamily: "var(--font-space-mono)" }}>
          YÖNETİM PANELİ
        </p>
        <h1 className="text-[40px] font-[900] tracking-[-0.03em] uppercase" style={{ fontFamily: "var(--font-hanken)" }}>
          KULLANICI DÜZENLE
        </h1>
      </div>
      <EditUserForm user={user} />
    </div>
  );
}
