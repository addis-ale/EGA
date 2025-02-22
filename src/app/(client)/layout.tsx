import type React from "react";
import { NavBar } from "@/components/NavBar";
import { getCurrentUser } from "@/actions/getCurrentUser";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = (await getCurrentUser()) ?? null;
  return (
    <div className="bg-black min-h-screen w-full flex flex-col">
      <NavBar user={user} />
      <main className="flex flex-grow">{children}</main>
    </div>
  );
}
