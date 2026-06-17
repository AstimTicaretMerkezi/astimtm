import { auth } from "@/lib/auth";
import { getAtolyeler, saveAtolyeler } from "@/lib/github";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "admin") return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const { atolyeler, sha } = await getAtolyeler();

  const block = id.split("-")[0];
  const atolyeList = atolyeler.blocks?.[block]?.shops;
  if (!atolyeList) return NextResponse.json({ error: "Atölye bulunamadı." }, { status: 404 });

  const idx = atolyeList.findIndex((s: any) => s.id === id);
  if (idx === -1) return NextResponse.json({ error: "Atölye bulunamadı." }, { status: 404 });

  const allowedFields = [
    "businessName", "ownerName", "category", "logo", "phone", "website",
    "instagram", "whatsapp", "description", "taxNumber", "address", "workingHours",
  ];
  const updates: Record<string, any> = {};
  for (const key of allowedFields) {
    if (key in body) updates[key] = body[key] || null;
  }
  if ("isActive" in body) updates.isActive = Boolean(body.isActive);

  // workingHours is a string — don't coerce to null if it's a non-empty string
  if ("workingHours" in body) {
    updates.workingHours = body.workingHours || null;
  }

  atolyeler.blocks[block].shops[idx] = { ...atolyeList[idx], ...updates };

  // Add new custom category to the global list if provided
  if (body.newCustomCategory) {
    const existing: string[] = atolyeler.customCategories ?? [];
    if (!existing.includes(body.newCustomCategory)) {
      atolyeler.customCategories = [...existing, body.newCustomCategory];
    }
  }

  await saveAtolyeler(atolyeler, sha);
  return NextResponse.json({ ok: true });
}
