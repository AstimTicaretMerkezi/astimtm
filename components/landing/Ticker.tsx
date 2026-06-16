export default function Ticker() {
  const text =
    "YENİ NESİL TİCARET // ÇANAKKALE // TÜRKİYE // USTALARIN MERKEZİ // ASTİM TİCARET MERKEZİ // SANAT & TİCARET // 29 DÜKKAN // 3 BLOK // ";

  return (
    <div className="border-y border-[#111111] overflow-hidden relative">
      {/* Construction tape stripes background */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #FF4A00 0px, #FF4A00 20px, #F4F3F0 20px, #F4F3F0 40px)",
        }}
      />

      {/* Scrolling text on top */}
      <div className="relative bg-[#111111] mx-2 my-2 overflow-hidden">
        <div className="flex whitespace-nowrap animate-ticker py-2">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="text-[#F4F3F0] text-[10px] tracking-[0.2em] uppercase px-4 flex-shrink-0"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
