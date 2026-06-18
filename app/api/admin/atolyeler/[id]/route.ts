import { auth } from "@/lib/auth";
import { getAtolyeler, saveAtolyeler, parseFirmId } from "@/lib/github";
import { NextResponse } from "next/server";

const FIRM_FIELDS = [
  "businessName", "ownerName", "contactPerson", "category", "logo", "phone", "website",
  "instagram", "whatsapp", "description", "taxNumber", "address", "workingHours",
];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "admin") return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

  const { id } = await params; // firmId like "B-04.1"
  const parsed = parseFirmId(id);
  if (!parsed) return NextResponse.json({ error: "Geçersiz firma ID." }, { status: 400 });

  const { blockKey, shopId, firmSubId } = parsed;
  const body = await req.json();
  const { atolyeler, sha } = await getAtolyeler();

  const shops = atolyeler.blocks?.[blockKey]?.shops;
  if (!shops) return NextResponse.json({ error: "Blok bulunamadı." }, { status: 404 });

  const shopIdx = shops.findIndex((s: any) => s.id === shopId);
  if (shopIdx === -1) return NextResponse.json({ error: "Atölye bulunamadı." }, { status: 404 });

  const firms: any[] = shops[shopIdx].firms ?? [];
  const firmIdx = firms.findIndex((f: any) => f.subId === firmSubId);
  if (firmIdx === -1) return NextResponse.json({ error: "Firma bulunamadı." }, { status: 404 });

  const updates: Record<string, any> = {};
  for (const key of FIRM_FIELDS) {
    if (key in body) updates[key] = body[key] || null;
  }
  if ("workingHours" in body) updates.workingHours = body.workingHours || null;
  if ("brands" in body) updates.brands = Array.isArray(body.brands) ? body.brands : [];
  if ("isActive" in body) updates.isActive = Boolean(body.isActive);

  firms[firmIdx] = { ...firms[firmIdx], ...updates };
  atolyeler.blocks[blockKey].shops[shopIdx].firms = firms;

  if (body.newCustomCategory) {
    const existing: string[] = atolyeler.customCategories ?? [];
    if (!existing.includes(body.newCustomCategory)) {
      atolyeler.customCategories = [...existing, body.newCustomCategory];
    }
  }

  await saveAtolyeler(atolyeler, sha);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "admin") return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

  const { id } = await params;
  const parsed = parseFirmId(id);
  if (!parsed) return NextResponse.json({ error: "Geçersiz firma ID." }, { status: 400 });

  const { blockKey, shopId, firmSubId } = parsed;
  const { atolyeler, sha } = await getAtolyeler();

  const shops = atolyeler.blocks?.[blockKey]?.shops;
  if (!shops) return NextResponse.json({ error: "Blok bulunamadı." }, { status: 404 });

  const shopIdx = shops.findIndex((s: any) => s.id === shopId);
  if (shopIdx === -1) return NextResponse.json({ error: "Atölye bulunamadı." }, { status: 404 });

  const firms: any[] = shops[shopIdx].firms ?? [];
  const before = firms.length;
  atolyeler.blocks[blockKey].shops[shopIdx].firms = firms.filter((f: any) => f.subId !== firmSubId);

  if (atolyeler.blocks[blockKey].shops[shopIdx].firms.length === before) {
    return NextResponse.json({ error: "Firma bulunamadı." }, { status: 404 });
  }

  await saveAtolyeler(atolyeler, sha);
  return NextResponse.json({ ok: true });
}
