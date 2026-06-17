import { getUsers, getAtolyeler, allFirmIds } from "@/lib/github";
import KullanicilarClient from "./KullanicilarClient";

export const dynamic = "force-dynamic";

export default async function KullanicilarPage() {
  const [{ users }, { atolyeler }] = await Promise.all([getUsers(), getAtolyeler()]);
  const firmIds = allFirmIds(atolyeler.blocks);
  return <KullanicilarClient users={users} firmIds={firmIds} />;
}
