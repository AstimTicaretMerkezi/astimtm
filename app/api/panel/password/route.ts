import { auth } from "@/lib/auth";
import { getUsers, saveUsers } from "@/lib/github";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) return NextResponse.json({ error: "Eksik alan" }, { status: 400 });
  if (newPassword.length < 6) return NextResponse.json({ error: "Şifre en az 6 karakter olmalı" }, { status: 400 });

  const { users, sha } = await getUsers();
  const idx = users.findIndex((u) => u.email === session.user.email);
  if (idx === -1) return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });

  const valid = await bcrypt.compare(currentPassword, users[idx].passwordHash);
  if (!valid) return NextResponse.json({ error: "Mevcut şifre hatalı" }, { status: 400 });

  users[idx].passwordHash = await bcrypt.hash(newPassword, 10);
  await saveUsers(users, sha);

  return NextResponse.json({ ok: true });
}
