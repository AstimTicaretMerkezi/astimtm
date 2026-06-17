import { auth } from "@/lib/auth";
import { getAtolyeler, saveAtolyeler } from "@/lib/github";
import { NextResponse } from "next/server";

/** POST /api/admin/atolyeler/[shopId]/firms — add a new empty firm to the shop */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "admin") return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

  const { id: shopId } = await params; // shopId like "B-04"
  const blockKey = shopId.split("-")[0];
  const { atolyeler, sha } = await getAtolyeler();

  const shops = atolyeler.blocks?.[blockKey]?.shops;
  if (!shops) return NextResponse.json({ error: "Blok bulunamadı." }, { status: 404 });

  const shopIdx = shops.findIndex((s: any) => s.id === shopId);
  if (shopIdx === -1) return NextResponse.json({ error: "Atölye bulunamadı." }, { status: 404 });

  const firms: any[] = shops[shopIdx].firms ?? [];
  const nextSubId = firms.length > 0 ? Math.max(...firms.map((f: any) => f.subId)) + 1 : 1;

  const newFirm = {
    subId: nextSubId,
    businessName: null,
    ownerName: null,
    category: null,
    logo: null,
    phone: null,
    website: null,
    instagram: null,
    whatsapp: null,
    description: null,
    taxNumber: null,
    address: null,
    workingHours: null,
    brands: [],
    isActive: false,
  };

  atolyeler.blocks[blockKey].shops[shopIdx].firms = [...firms, newFirm];
  await saveAtolyeler(atolyeler, sha);

  return NextResponse.json({ ok: true, firmId: `${shopId}.${nextSubId}`, firm: newFirm });
}
