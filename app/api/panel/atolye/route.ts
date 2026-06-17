import { auth } from "@/lib/auth";
import { getAtolyeler, saveAtolyeler } from "@/lib/github";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await auth();
  const atolyeId = session?.user?.atolyeId;
  if (!session || !atolyeId) return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

  const body = await req.json();
  const { atolyeler, sha } = await getAtolyeler();

  const block = atolyeId.split("-")[0];
  const atolyeList = atolyeler.blocks?.[block]?.shops;
  if (!atolyeList) return NextResponse.json({ error: "Atölye bulunamadı." }, { status: 404 });

  const idx = atolyeList.findIndex((s: any) => s.id === atolyeId);
  if (idx === -1) return NextResponse.json({ error: "Atölye bulunamadı." }, { status: 404 });

  const allowedFields = ["businessName", "ownerName", "category", "logo", "phone", "website", "instagram", "whatsapp", "description", "taxNumber", "address", "workingHours"];
  const updates: Record<string, any> = {};
  for (const key of allowedFields) {
    if (key in body) updates[key] = body[key] || null;
  }

  const merged = { ...atolyeList[idx], ...updates };
  merged.isActive = !!(merged.businessName && merged.phone);

  atolyeler.blocks[block].shops[idx] = merged;
  await saveAtolyeler(atolyeler, sha);

  return NextResponse.json({ ok: true });
}
