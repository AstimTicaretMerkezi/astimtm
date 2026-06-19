import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";

const sections = [
  {
    id: "01",
    category: "GENEL",
    pages: [
      {
        title: "ANA SAYFA",
        href: "/",
        description: "ASTİM Ticaret Merkezi'nin ana sayfası. Atölyeler, galeri ve iletişim bilgileri.",
        tag: "HERKESE AÇIK",
      },
      {
        title: "ATÖLYELERİMİZ",
        href: "/atolyeler",
        description: "29 atölye, 3 blok. A, B ve C bloklarındaki tüm firmaları keşfedin.",
        tag: "HERKESE AÇIK",
      },
    ],
  },
  {
    id: "02",
    category: "İLETİŞİM",
    pages: [
      {
        title: "KONUM & HARİTA",
        href: "/#konum",
        description: "Çanakkale Merkez'deki konumumuz, adres bilgileri ve çalışma saatleri.",
        tag: "HERKESE AÇIK",
      },
      {
        title: "HABERDAR OL",
        href: "/",
        description: "Açılışlar ve etkinliklerden haberdar olmak için e-posta bültenine kayıt olun.",
        tag: "BÜLTEN",
      },
    ],
  },
  {
    id: "03",
    category: "HESAP",
    pages: [
      {
        title: "ÜYE GİRİŞİ",
        href: "/giris",
        description: "Kiracı veya mülk sahibi girişi. Atölye bilgilerinizi yönetin.",
        tag: "ÜYE",
      },
      {
        title: "KULLANICI PANELİ",
        href: "/panel",
        description: "Atölye bilgileri, logo ve iletişim bilgilerini güncelleyin.",
        tag: "ÜYE",
      },
    ],
  },
];

export const metadata = {
  title: "Site Haritası — ASTİM Ticaret Merkezi",
  description: "ASTİM Ticaret Merkezi web sitesinin tüm sayfaları.",
};

export default function SiteHaritasi() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F4F3F0]">
        {/* Header */}
        <div className="border-b border-[#111111] px-6 md:px-10 py-8 md:py-12 flex flex-col gap-2">
          <p
            className="text-[10px] tracking-[0.25em] uppercase text-[#FF4A00]"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            NAVİGASYON
          </p>
          <h1
            className="text-[36px] md:text-[64px] font-[900] tracking-[-0.03em] uppercase leading-none"
            style={{ fontFamily: "var(--font-hanken)" }}
          >
            SİTE HARİTASI
          </h1>
          <p
            className="text-[13px] text-[#595C5C] mt-1"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            astimticaretmerkezi.com üzerindeki tüm sayfalar
          </p>
        </div>

        {/* Sections */}
        <div className="divide-y divide-[#111111]">
          {sections.map((section) => (
            <div key={section.id} className="grid grid-cols-1 md:grid-cols-12">
              {/* Section label */}
              <div className="md:col-span-3 border-b md:border-b-0 md:border-r border-[#111111] px-6 md:px-10 py-6 md:py-10 flex md:flex-col gap-3 md:gap-2 items-center md:items-start">
                <span
                  className="text-[48px] md:text-[64px] font-[900] tracking-[-0.04em] text-[#111111]/10 leading-none"
                  style={{ fontFamily: "var(--font-hanken)" }}
                >
                  {section.id}
                </span>
                <span
                  className="text-[11px] font-[700] tracking-[0.2em] uppercase text-[#111111]"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  {section.category}
                </span>
              </div>

              {/* Pages grid */}
              <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2">
                {section.pages.map((page, i) => (
                  <Link
                    key={page.href + page.title}
                    href={page.href}
                    className={`group p-6 md:p-10 flex flex-col gap-3 hover:bg-[#111111] transition-none ${
                      i % 2 === 0 ? "sm:border-r border-[#111111]" : ""
                    } border-b border-[#111111] last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="text-[10px] font-[700] tracking-[0.15em] uppercase px-2 py-1 border border-[#111111] group-hover:border-[#F4F3F0]/30 group-hover:text-[#F4F3F0]/60 transition-none"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                      >
                        {page.tag}
                      </span>
                      <span className="text-[18px] text-[#595C5C] group-hover:text-[#F4F3F0]/40 transition-none leading-none mt-0.5">
                        →
                      </span>
                    </div>

                    <h2
                      className="text-[22px] md:text-[28px] font-[900] tracking-[-0.02em] uppercase group-hover:text-[#F4F3F0] transition-none leading-tight"
                      style={{ fontFamily: "var(--font-hanken)" }}
                    >
                      {page.title}
                    </h2>

                    <p
                      className="text-[13px] text-[#595C5C] group-hover:text-[#F4F3F0]/60 transition-none leading-relaxed"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {page.description}
                    </p>

                    <span
                      className="text-[10px] font-[700] tracking-[0.1em] text-[#595C5C] group-hover:text-[#F4F3F0]/40 transition-none mt-auto"
                      style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                      {page.href}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* XML Sitemap link */}
        <div className="border-t border-[#111111] px-6 md:px-10 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span
            className="text-[11px] font-[700] tracking-[0.15em] uppercase text-[#595C5C]"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            ARAMA MOTORLARI İÇİN
          </span>
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-[700] tracking-[0.1em] uppercase border border-[#111111] px-4 py-2 hover:bg-[#111111] hover:text-[#F4F3F0] transition-none self-start sm:self-auto"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            XML SİTEMAP →
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
