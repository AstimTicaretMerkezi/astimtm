export default function Ticker() {
  const text =
    "USTALARIN MERKEZİ // YENİ NESİL TİCARET // ÇANAKKALE // TÜRKİYE // ASTİM TİCARET MERKEZİ // SANAT & TİCARET // 29 DÜKKAN // 3 BLOK // ";

  return (
    <div
      className="col-span-12 h-12 border-b border-[#111111] overflow-hidden flex items-center"
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, #FF4A00 0, #FF4A00 10px, transparent 10px, transparent 20px)",
      }}
    >
      <div
        className="whitespace-nowrap flex gap-10"
        style={{ animation: "marquee 20s linear infinite" }}
      >
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="text-[12px] leading-[16px] font-[700] text-[#111111] flex-shrink-0"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
