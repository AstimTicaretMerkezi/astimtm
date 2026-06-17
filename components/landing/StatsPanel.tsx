const STATS = [
  { count: "05", label: "MOBİLYA ATÖLYESİ" },
  { count: "03", label: "OTOMOTİV ATÖLYESİ" },
  { count: "03", label: "SANAT ATÖLYESİ" },
  { count: "04", label: "GIDA ATÖLYESİ" },
];

export default function StatsPanel() {
  return (
    <section className="md:col-span-12 border-b border-[#111111] bg-[#F4F3F0]">
      <div className="grid grid-cols-1 md:grid-cols-4">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={`p-[2rem] md:p-[2.5rem] flex flex-col gap-4 ${
              i < STATS.length - 1
                ? "border-b md:border-b-0 md:border-r border-[#111111]"
                : ""
            }`}
          >
            <span
              className="text-[64px] md:text-[80px] leading-none font-[900] tracking-[-0.04em]"
              style={{ fontFamily: "var(--font-hanken)" }}
            >
              {stat.count}
            </span>
            <span
              className="text-[12px] leading-[16px] font-[700] uppercase tracking-widest"
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
