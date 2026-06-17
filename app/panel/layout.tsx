import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role === "admin") redirect("/giris");

  return (
    <div className="min-h-screen bg-[#F4F3F0] flex flex-col">
      <header className="bg-[#111111] text-[#F4F3F0] border-b border-[#F4F3F0]/20 px-[2rem] h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/panel" className="flex items-center gap-3">
            <div className="h-7 w-7 relative">
              <Image src="/images/logo_trans.png" alt="ASTİM" fill sizes="28px" className="object-contain brightness-0 invert" />
            </div>
            <span className="text-[13px] font-[900] tracking-tighter uppercase" style={{ fontFamily: "var(--font-hanken)" }}>
              ASTİM — ATÖLYE PANELİ
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/panel" className="px-3 py-1.5 text-[11px] font-[700] tracking-[0.1em] uppercase text-[#F4F3F0]/60 hover:text-[#F4F3F0] transition-none" style={{ fontFamily: "var(--font-space-mono)" }}>
              PANEL
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[11px] text-[#DFFF00] font-[700] tracking-[0.1em] uppercase hidden md:block" style={{ fontFamily: "var(--font-space-mono)" }}>
            {session.user.name}
          </span>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/giris" }); }}>
            <button type="submit" className="text-[11px] font-[700] tracking-[0.1em] uppercase text-[#F4F3F0]/60 hover:text-[#FF4A00] transition-none" style={{ fontFamily: "var(--font-space-mono)" }}>
              ÇIKIŞ →
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 p-[2rem]">{children}</main>
    </div>
  );
}
