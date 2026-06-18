import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PanelHeader from "@/components/panel/PanelHeader";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role === "admin") redirect("/giris");

  return (
    <div className="min-h-screen bg-[#F4F3F0] flex flex-col">
      <PanelHeader name={session.user.name ?? ""} />
      <main className="flex-1 p-[2rem]">{children}</main>
    </div>
  );
}
