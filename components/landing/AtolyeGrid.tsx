import atolyelerData from "@/data/atolyeler.json";

type Atolye = {
  id: string;
  no: number;
  businessName: string | null;
  ownerName: string | null;
  category: string | null;
  logo: string | null;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  description: string | null;
  isActive: boolean;
};

type Block = {
  label: string;
  shops: Atolye[];
};

function AtolyeCard({ atolye, blockKey }: { atolye: Atolye; blockKey: string }) {
  const isEmpty = !atolye.businessName;

  return (
    <div
      className={`border-r border-b border-[#111111] p-6 flex flex-col justify-between gap-4 min-h-[180px] group ${
        isEmpty
          ? "hover:bg-[#EFEEEB]"
          : "hover:bg-[#111111] cursor-pointer"
      } transition-none`}
    >
      {/* Top */}
      <div className="flex items-start justify-between gap-2">
        <span
          className={`text-[9px] tracking-[0.15em] uppercase px-2 py-1 border ${
            isEmpty
              ? "border-[#c4c7c7] text-[#c4c7c7]"
              : "border-[#FF4A00] text-[#FF4A00]"
          }`}
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          {atolye.id}
        </span>

        {atolye.category && (
          <span
            className="text-[8px] tracking-[0.1em] uppercase px-2 py-1 bg-[#DFFF00] text-[#111111] group-hover:bg-[#DFFF00]"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            {atolye.category.toUpperCase()}
          </span>
        )}
      </div>

      {/* Middle */}
      <div>
        {isEmpty ? (
          <div>
            <div
              className="text-[#c4c7c7] text-xl font-black tracking-[-0.02em] uppercase leading-tight"
              style={{ fontFamily: "var(--font-hanken)" }}
            >
              ATÖLYE {blockKey}-{String(atolye.no).padStart(2, "0")}
            </div>
            <div
              className="text-[#c4c7c7] text-[9px] tracking-[0.1em] uppercase mt-1"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Henüz bilgi girilmedi
            </div>
          </div>
        ) : (
          <div>
            <div
              className="text-[#111111] group-hover:text-[#F4F3F0] text-xl font-black tracking-[-0.02em] uppercase leading-tight transition-none"
              style={{ fontFamily: "var(--font-hanken)" }}
            >
              {atolye.businessName}
            </div>
            {atolye.description && (
              <div
                className="text-[#747878] group-hover:text-[#747878] text-[11px] mt-1 line-clamp-2"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {atolye.description}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="flex items-center gap-3 border-t border-[#EFEEEB] group-hover:border-[#2f312f] pt-3 transition-none">
        {atolye.instagram && (
          <a
            href={`https://instagram.com/${atolye.instagram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] tracking-[0.1em] uppercase text-[#747878] hover:text-[#FF4A00]"
            style={{ fontFamily: "var(--font-space-mono)" }}
            onClick={(e) => e.stopPropagation()}
          >
            IG
          </a>
        )}
        {atolye.phone && (
          <a
            href={`tel:${atolye.phone}`}
            className="text-[9px] tracking-[0.1em] uppercase text-[#747878] hover:text-[#FF4A00]"
            style={{ fontFamily: "var(--font-space-mono)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {atolye.phone}
          </a>
        )}
        {atolye.website && (
          <a
            href={atolye.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] tracking-[0.1em] uppercase text-[#747878] hover:text-[#FF4A00] ml-auto"
            style={{ fontFamily: "var(--font-space-mono)" }}
            onClick={(e) => e.stopPropagation()}
          >
            WEB ↗
          </a>
        )}
      </div>
    </div>
  );
}

export default function AtolyeGrid() {
  const blocks = atolyelerData.blocks as Record<string, Block>;

  return (
    <section id="atolyeler" className="col-span-12 border-b border-[#111111]">
      {/* Section header */}
      <div className="border-b border-[#111111] px-6 py-4 flex items-baseline justify-between">
        <span
          className="text-[10px] tracking-[0.2em] uppercase text-[#111111]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          ATÖLYELERİMİZ
        </span>
        <span
          className="text-[9px] tracking-[0.1em] uppercase text-[#747878]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          TOPLAM: 29 ATÖLYE // 3 BLOK
        </span>
      </div>

      {Object.entries(blocks).map(([blockKey, block]) => (
        <div key={blockKey} className="border-b border-[#111111]">
          {/* Block header */}
          <div className="bg-[#111111] px-6 py-4 flex items-center justify-between">
            <span
              className="text-[#F4F3F0] text-sm font-bold tracking-[0.1em] uppercase"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {block.label}
            </span>
            <span
              className="text-[#DFFF00] text-[9px] tracking-[0.15em] uppercase"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {block.shops.length} ATÖLYE
            </span>
          </div>

          {/* Atolye cards grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 border-l border-t border-[#111111]">
            {block.shops.map((atolye) => (
              <AtolyeCard key={atolye.id} atolye={atolye} blockKey={blockKey} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
