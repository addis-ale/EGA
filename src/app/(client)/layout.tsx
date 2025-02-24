import type React from "react";
import { NavBar } from "@/components/NavBar";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-black min-h-screen w-full flex flex-col">
      <NavBar />
      <main className="flex flex-grow">{children}</main>
    </div>
  );
}
