export default function StatsPanel({
  categories,
}: {
  categories: { label: string; count: number }[];
}) {
  const items = categories.length > 0 ? categories : [{ label: "ATÖLYE", count: 0 }];

  return (
    <section className="md:col-span-12 border-b border-[#111111] bg-[#F4F3F0]">
      <div className={`grid grid-cols-2 md:grid-cols-${Math.min(items.length, 4)}`}>
        {items.map((stat, i) => (
          <div
            key={stat.label}
            className={`p-[1.5rem] md:p-[2.5rem] flex flex-col gap-4 border-[#111111] ${
              i % 2 === 0 && i < items.length - 1 ? "border-r" : ""
            } ${
              i < items.length - 2 ? "border-b md:border-b-0" : ""
            } ${
              i < items.length - 1 ? "md:border-r" : ""
            }`}
          >
            <span
              className="text-[56px] md:text-[80px] leading-none font-[900] tracking-[-0.04em]"
              style={{ fontFamily: "var(--font-hanken)" }}
            >
              {String(stat.count).padStart(2, "0")}
            </span>
            <span
              className="text-[11px] leading-[16px] font-[700] uppercase tracking-widest"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
