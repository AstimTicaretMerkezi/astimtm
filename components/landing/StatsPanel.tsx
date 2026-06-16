import shopsData from "@/data/shops.json";

function getBlockStats() {
  const blocks = shopsData.blocks as Record<string, { label: string; shops: { isActive: boolean; category: string | null }[] }>;
  return Object.entries(blocks).map(([key, block]) => ({
    key,
    label: block.label,
    total: block.shops.length,
    active: block.shops.filter((s) => s.isActive).length,
  }));
}

function getCategories() {
  const blocks = shopsData.blocks as Record<string, { shops: { category: string | null; isActive: boolean }[] }>;
  const cats = new Map<string, number>();
  Object.values(blocks).forEach((block) => {
    block.shops.forEach((shop) => {
      if (shop.category && shop.isActive) {
        const key = shop.category.toUpperCase().trim();
        cats.set(key, (cats.get(key) ?? 0) + 1);
      }
    });
  });
  return Array.from(cats.entries()).map(([name, count]) => ({ name, count }));
}

export default function StatsPanel() {
  const blockStats = getBlockStats();
  const categories = getCategories();
  const totalShops = blockStats.reduce((s, b) => s + b.total, 0);
  const activeShops = blockStats.reduce((s, b) => s + b.active, 0);

  return (
    <section className="border-b border-[#111111] grid grid-cols-1 md:grid-cols-3">
      {/* Left — Stats */}
      <div className="bg-[#111111] p-8 md:p-10 flex flex-col justify-between gap-8 border-b md:border-b-0 md:border-r border-[#111111]">
        {/* Active shops count */}
        <div>
          <div
            className="text-[#DFFF00] text-xs tracking-[0.2em] uppercase mb-1"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            TOPLAM DÜKKAN
          </div>
          <div
            className="text-[#DFFF00] text-5xl font-bold"
            style={{ fontFamily: "var(--font-hanken)" }}
          >
            {totalShops}
          </div>
        </div>

        {/* Block breakdown */}
        <div className="flex flex-col gap-0">
          {blockStats.map((block) => (
            <div
              key={block.key}
              className="flex items-center justify-between border-t border-[#2f312f] py-3"
            >
              <span
                className="text-[#DFFF00] text-sm font-bold"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {block.total}
              </span>
              <span
                className="text-[#F4F3F0] text-[11px] tracking-[0.15em] uppercase"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {block.label}
              </span>
            </div>
          ))}

          {/* Categories (dynamic, shown when shops fill in) */}
          {categories.length > 0 && (
            <>
              <div className="border-t border-[#2f312f] pt-4 mt-2">
                <div
                  className="text-[#747878] text-[9px] tracking-[0.2em] uppercase mb-2"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  KATEGORİLER
                </div>
                {categories.map((cat) => (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between border-t border-[#2f312f] py-2"
                  >
                    <span
                      className="text-[#DFFF00] text-xs font-bold"
                      style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                      {cat.count}
                    </span>
                    <span
                      className="text-[#F4F3F0] text-[10px] tracking-[0.1em] uppercase"
                      style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                      {cat.name}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer note */}
        <div
          className="text-[#747878] text-[9px] tracking-[0.15em] uppercase border-t border-[#2f312f] pt-4"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          3 BLOK // ASTİM TİCARET MERKEZİ
        </div>
      </div>

      {/* Middle — Photo 1 */}
      <div className="relative overflow-hidden min-h-[300px] bg-[#EFEEEB] border-b md:border-b-0 md:border-r border-[#111111]">
        {/* Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6">
            <div
              className="text-3xl font-black tracking-[-0.04em] text-[#c4c7c7] uppercase"
              style={{ fontFamily: "var(--font-hanken)" }}
            >
              FOTOĞRAF 1
            </div>
            <div
              className="text-[9px] tracking-[0.15em] text-[#c4c7c7] mt-1 uppercase"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              public/images/gallery/g-01.jpg
            </div>
          </div>
        </div>
      </div>

      {/* Right — Photo 2 */}
      <div className="relative overflow-hidden min-h-[300px] bg-[#E9E8E5]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6">
            <div
              className="text-3xl font-black tracking-[-0.04em] text-[#c4c7c7] uppercase"
              style={{ fontFamily: "var(--font-hanken)" }}
            >
              FOTOĞRAF 2
            </div>
            <div
              className="text-[9px] tracking-[0.15em] text-[#c4c7c7] mt-1 uppercase"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              public/images/gallery/g-02.jpg
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
