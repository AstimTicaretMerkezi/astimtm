import { auth } from "@/lib/auth";
import { getAtolyeler, saveAtolyeler, parseFirmId } from "@/lib/github";
import { NextResponse } from "next/server";

const ALLOWED_FIELDS = [
  "businessName", "ownerName", "category", "logo", "phone", "website",
  "instagram", "whatsapp", "description", "taxNumber", "address", "workingHours",
];

const EMPTY_FIRM = {
  businessName: null, ownerName: null, category: null, logo: null,
  phone: null, website: null, instagram: null, whatsapp: null,
  description: null, taxNumber: null, address: null, workingHours: null,
  brands: [], isActive: false,
};

export async function PATCH(req: Request) {
  const session = await auth();
  const atolyeId = session?.user?.atolyeId;
  if (!session || !atolyeId) return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

  const body = await req.json();
  const { atolyeler, sha } = await getAtolyeler();

  // Support both new "B-04.1" and legacy "B-04" formats
  let blockKey: string;
  let shopId: string;
  let firmSubId: number;

  const parsed = parseFirmId(atolyeId);
  if (parsed) {
    blockKey = parsed.blockKey;
    shopId = parsed.shopId;
    firmSubId = parsed.firmSubId;
  } else {
    // Legacy format: treat shopId as firmSubId 1
    shopId = atolyeId;
    blockKey = shopId.split("-")[0];
    firmSubId = 1;
  }

  const shops = atolyeler.blocks?.[blockKey]?.shops;
  if (!shops) return NextResponse.json({ error: "Atölye bulunamadı." }, { status: 404 });

  const shopIdx = shops.findIndex((s: any) => s.id === shopId);
  if (shopIdx === -1) return NextResponse.json({ error: "Atölye bulunamadı." }, { status: 404 });

  // Migrate legacy shop: if no firms array, create it
  if (!Array.isArray(atolyeler.blocks[blockKey].shops[shopIdx].firms)) {
    atolyeler.blocks[blockKey].shops[shopIdx] = {
      id: shopId,
      no: shops[shopIdx].no,
      firms: [],
    };
  }

  const firms: any[] = atolyeler.blocks[blockKey].shops[shopIdx].firms;
  let firmIdx = firms.findIndex((f: any) => f.subId === firmSubId);

  if (firmIdx === -1) {
    // Auto-create the firm slot
    firms.push({ subId: firmSubId, ...EMPTY_FIRM });
    firmIdx = firms.length - 1;
  }

  const updates: Record<string, any> = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in body) updates[key] = body[key] || null;
  }
  if ("workingHours" in body) updates.workingHours = body.workingHours || null;
  if ("brands" in body) updates.brands = Array.isArray(body.brands) ? body.brands : [];

  const merged = { ...firms[firmIdx], ...updates };
  merged.isActive = !!(merged.businessName && merged.phone);

  atolyeler.blocks[blockKey].shops[shopIdx].firms[firmIdx] = merged;
  await saveAtolyeler(atolyeler, sha);

  return NextResponse.json({ ok: true });
}
