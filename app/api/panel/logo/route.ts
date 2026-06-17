import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const session = await auth();
  const atolyeId = session?.user?.atolyeId;
  if (!session || !atolyeId) return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Dosya 5MB'dan büyük olamaz." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: "astimtm/logos",
        public_id: `atolye-${atolyeId}`,
        overwrite: true,
        transformation: [
          { width: 400, height: 400, crop: "limit" },
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (err, res) => (err ? reject(err) : resolve(res as any))
    ).end(buffer);
  });

  return NextResponse.json({ url: result.secure_url });
}
