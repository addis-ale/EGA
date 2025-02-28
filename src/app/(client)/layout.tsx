import type React from "react";
import { NavBar } from "@/components/NavBar";
import Footer from "@/components/clientComponents/footer";
import Container from "@/components/container";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-black min-h-screen w-full flex flex-col">
      <NavBar />
      <main className="flex flex-grow">{children}</main>
      <div className="bg-[#3b4032]">
        <Container>
          <div className="w-full">
            <Footer />
          </div>
        </Container>
      </div>
    </div>
  );
}
