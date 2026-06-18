import type { Metadata } from "next";
import { Hanken_Grotesk, Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "ASTİM Ticaret Merkezi",
  description:
    "Yeni Nesil Ticaret Merkezi. Ustalık ve sanatın buluştuğu 29 dükkan, 3 blok.",
  keywords: ["ASTİM", "ticaret merkezi", "Çanakkale", "dükkan", "esnaf"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="tr"
      className={`${hanken.variable} ${inter.variable} ${spaceMono.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
