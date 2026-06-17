import atolyelerData from "@/data/atolyeler.json";

type Atolye = { isActive: boolean; category: string | null };
type Block = { label: string; shops: Atolye[] };

function getBlockStats() {
  return Object.entries(atolyelerData.blocks as Record<string, Block>).map(
    ([key, block]) => ({
      key,
      label: block.label,
      total: block.shops.length,
    })
  );
}

function getCategories() {
  const cats = new Map<string, number>();
  Object.values(atolyelerData.blocks as Record<string, Block>).forEach((block) => {
    block.shops.forEach((atolye) => {
      if (atolye.category && atolye.isActive) {
        const key = atolye.category.toUpperCase().trim();
        cats.set(key, (cats.get(key) ?? 0) + 1);
      }
    });
  });
  return Array.from(cats.entries()).map(([name, count]) => ({ name, count }));
}

export default function StatsPanel() {
  const blockStats = getBlockStats();
  const categories = getCategories();
  const totalAtolye = blockStats.reduce((s, b) => s + b.total, 0);

  const rows = [
    ...blockStats.map((b) => ({ count: b.total, label: b.label })),
    ...categories.map((c) => ({ count: c.count, label: c.name })),
  ];

  return (
    <section className="md:col-span-4 border-b border-r border-[#111111] p-[2rem] md:p-[2.5rem] bg-[#111111] text-[#F4F3F0] flex flex-col justify-between">
      {/* Top */}
      <div>
        <h2
          className="text-[12px] leading-[16px] font-[700] text-[#DFFF00] mb-[32px] uppercase tracking-tighter"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          TOPLAM ATÖLYE: {totalAtolye}
        </h2>

        <div className="flex flex-col gap-[32px]">
          {rows.map((row, i) => (
            <div
              key={i}
              className="border-t border-[#F4F3F0]/20 pt-4 flex justify-between"
            >
              <span
                className="text-[12px] leading-[16px] font-[700] text-[#DFFF00]"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {row.count}
              </span>
              <span
                className="text-[12px] leading-[16px] font-[700] uppercase"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {row.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-[32px] pt-[32px] border-t border-[#F4F3F0]/20">
        <p
          className="text-[12px] leading-[16px] font-[700] opacity-60 uppercase"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          3 BLOK // ASTİM TİCARET MERKEZİ
        </p>
      </div>
    </section>
  );
}
