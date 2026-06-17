import { getAtolyeler } from "@/lib/github";
import AtolyelerClient from "./AtolyelerClient";

export const dynamic = "force-dynamic";

export default async function AtolyelerPage() {
  const { atolyeler } = await getAtolyeler();

  return (
    <div className="flex flex-col gap-8">
      <div className="border-b border-[#111111] pb-6">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#FF4A00] mb-1" style={{ fontFamily: "var(--font-space-mono)" }}>
          YÖNETİM PANELİ
        </p>
        <h1 className="text-[40px] font-[900] tracking-[-0.03em] uppercase" style={{ fontFamily: "var(--font-hanken)" }}>
          ATÖLYELER
        </h1>
      </div>

      <AtolyelerClient
        blocks={atolyeler.blocks}
        customCategories={atolyeler.customCategories ?? []}
      />
    </div>
  );
}
