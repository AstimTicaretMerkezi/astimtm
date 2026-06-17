import { getUsers, getAtolyeler, allFirmIds } from "@/lib/github";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [{ users }, { atolyeler }] = await Promise.all([getUsers(), getAtolyeler()]);

  const tumAtolyeler = Object.values(atolyeler.blocks).flatMap((b: any) => b.shops);
  const tumFirmalar = tumAtolyeler.flatMap((s: any) => s.firms ?? []);
  const aktifFirmalar = tumFirmalar.filter((f: any) => f.isActive).length;
  const firmIds = allFirmIds(atolyeler.blocks);

  const stats = [
    { label: "TOPLAM KULLANICI", value: users.length },
    { label: "ATÖLYE ATANMIŞ", value: users.filter((u) => u.atolyeId).length },
    { label: "AKTİF FİRMA", value: aktifFirmalar },
    { label: "TOPLAM FİRMA", value: tumFirmalar.length },
  ];

  const recentUsers = users.slice(-5).reverse().map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    atolyeId: u.atolyeId,
  }));

  return <AdminDashboardClient stats={stats} recentUsers={recentUsers} firmIds={firmIds} />;
}
