import { auth } from "@/lib/auth";
import { getAtolyeler, parseFirmId } from "@/lib/github";
import PanelClient from "./PanelClient";

export const dynamic = "force-dynamic";

export default async function PanelPage() {
  const session = await auth();
  const atolyeId = session?.user?.atolyeId ?? null;

  let atolye = null;
  if (atolyeId) {
    const { atolyeler } = await getAtolyeler();
    const parsed = parseFirmId(atolyeId);

    if (parsed) {
      // New format: "B-04.1"
      const { blockKey, shopId, firmSubId } = parsed;
      const shop = atolyeler.blocks?.[blockKey]?.shops?.find((s: any) => s.id === shopId);
      atolye = shop?.firms?.find((f: any) => f.subId === firmSubId) ?? null;
    } else {
      // Legacy format: "B-04" → use firm with subId 1 if it exists
      const blockKey = atolyeId.split("-")[0];
      const shop = atolyeler.blocks?.[blockKey]?.shops?.find((s: any) => s.id === atolyeId);
      if (shop) {
        const firms: any[] = shop.firms ?? [];
        atolye = firms.find((f: any) => f.subId === 1) ?? null;
      }
    }
  }

  return <PanelClient atolyeId={atolyeId} atolye={atolye} />;
}
