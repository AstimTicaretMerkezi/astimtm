import { auth } from "@/lib/auth";
import { getAtolyeler } from "@/lib/github";
import PanelClient from "./PanelClient";

export const dynamic = "force-dynamic";

export default async function PanelPage() {
  const session = await auth();
  const atolyeId = session?.user?.atolyeId ?? null;

  let atolye = null;
  if (atolyeId) {
    const { atolyeler } = await getAtolyeler();
    const blok = atolyeId.split("-")[0];
    atolye = atolyeler.blocks?.[blok]?.shops?.find((s: any) => s.id === atolyeId) ?? null;
  }

  return <PanelClient atolyeId={atolyeId} atolye={atolye} />;
}
