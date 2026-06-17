import { auth } from "@/lib/auth";
import { getUsers, saveUsers } from "@/lib/github";
import { sendMail, welcomeMailHtml } from "@/lib/mail";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "admin") return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

  const { name, email, password, role, atolyeId } = await req.json();

  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "Tüm alanları doldurun." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Şifre en az 8 karakter olmalıdır." }, { status: 400 });
  }

  const { users, sha } = await getUsers();
  if (users.find((u) => u.email === email)) {
    return NextResponse.json({ error: "Bu e-posta zaten kullanımda." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const newUser = {
    id: `u-${Date.now()}`,
    name,
    email,
    passwordHash,
    role,
    atolyeId: atolyeId || null,
    createdAt: new Date().toISOString().split("T")[0],
  };

  await saveUsers([...users, newUser], sha);

  // Send welcome email (non-blocking — failure doesn't abort user creation)
  sendMail({
    to: email,
    subject: "ASTİM Atölye Paneli — Hesabınız Oluşturuldu",
    html: welcomeMailHtml({ name, email, password, atolyeId: atolyeId || null }),
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
