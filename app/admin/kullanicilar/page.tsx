import { getUsers } from "@/lib/github";
import KullanicilarClient from "./KullanicilarClient";

export const dynamic = "force-dynamic";

export default async function KullanicilarPage() {
  const { users } = await getUsers();
  return <KullanicilarClient users={users} />;
}
