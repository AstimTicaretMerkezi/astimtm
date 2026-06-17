import { auth } from "@/lib/auth";
import { getUsers, saveUsers } from "@/lib/github";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "admin") return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

  const { id } = await params;
  const { name, email, password, role, atolyeId } = await req.json();
  const { users, sha } = await getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });

  const updated = { ...users[idx], name, email, role, atolyeId: atolyeId || null };
  if (password && password.length >= 8) {
    updated.passwordHash = await bcrypt.hash(password, 12);
  }

  const newUsers = [...users];
  newUsers[idx] = updated;
  await saveUsers(newUsers, sha);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "admin") return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

  const { id } = await params;
  const { users, sha } = await getUsers();
  const target = users.find((u) => u.id === id);

  if (!target) return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
  if (target.role === "admin") return NextResponse.json({ error: "Admin silinemez." }, { status: 403 });

  await saveUsers(users.filter((u) => u.id !== id), sha);
  return NextResponse.json({ ok: true });
}
