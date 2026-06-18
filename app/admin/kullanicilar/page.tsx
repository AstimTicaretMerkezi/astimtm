import { getUsers, getAtolyeler } from "@/lib/github";
import KullanicilarClient from "./KullanicilarClient";

export const dynamic = "force-dynamic";

export default async function KullanicilarPage() {
  const [{ users }, { atolyeler }] = await Promise.all([getUsers(), getAtolyeler()]);

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

  return <KullanicilarClient users={users} firmIds={firmIds} />;
}
