import { getUsers, getAtolyeler } from "@/lib/github";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [{ users }, { atolyeler }] = await Promise.all([getUsers(), getAtolyeler()]);

  const tumAtolyeler = Object.values(atolyeler.blocks).flatMap((b: any) => b.shops);
  const tumFirmalar = tumAtolyeler.flatMap((s: any) => s.firms ?? []);
  const aktifFirmalar = tumFirmalar.filter((f: any) => f.isActive).length;
  const firmIds: string[] = [];
  for (const block of Object.values(atolyeler.blocks) as any[]) {
    for (const shop of block.shops as any[]) {
      const firms: any[] = shop.firms ?? [];
      if (firms.length <= 1) {
        firmIds.push(shop.id);
      } else {
        for (const firm of firms) {
          firmIds.push(`${shop.id}.${firm.subId}`);
        }
      }
    }
  }

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
