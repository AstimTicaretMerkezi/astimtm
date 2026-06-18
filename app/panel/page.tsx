import { auth } from "@/lib/auth";
import { getAtolyeler, parseFirmId } from "@/lib/github";
import PanelClient from "./PanelClient";

export const dynamic = "force-dynamic";

export default async function PanelPage() {
  const session = await auth();
  const atolyeId = session?.user?.atolyeId ?? null;

  let atolye = null;
  let customCategories: string[] = [];

  if (atolyeId) {
    const { atolyeler } = await getAtolyeler();
    customCategories = atolyeler.customCategories ?? [];
    const parsed = parseFirmId(atolyeId);

    if (parsed) {
      const { blockKey, shopId, firmSubId } = parsed;
      const shop = atolyeler.blocks?.[blockKey]?.shops?.find((s: any) => s.id === shopId);
      atolye = shop?.firms?.find((f: any) => f.subId === firmSubId) ?? null;
    } else {
      const blockKey = atolyeId.split("-")[0];
      const shop = atolyeler.blocks?.[blockKey]?.shops?.find((s: any) => s.id === atolyeId);
      if (shop) {
        const firms: any[] = shop.firms ?? [];
        atolye = firms.find((f: any) => f.subId === 1) ?? null;
      }
    }
  }

  return <PanelClient atolyeId={atolyeId} atolye={atolye} customCategories={customCategories} />;
}
