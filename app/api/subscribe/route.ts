import { getSubscribers, saveSubscribers } from "@/lib/github";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: "Ad ve e-posta zorunludur." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Geçerli bir e-posta adresi girin." }, { status: 400 });
  }

  const { subscribers, sha } = await getSubscribers();

  if (subscribers.find((s) => s.email.toLowerCase() === email.toLowerCase())) {
    return NextResponse.json({ error: "Bu e-posta zaten kayıtlı." }, { status: 409 });
  }

  const newSubscriber = {
    id: `sub-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subscribedAt: new Date().toISOString(),
  };

  await saveSubscribers([...subscribers, newSubscriber], sha);

  return NextResponse.json({ ok: true });
}
