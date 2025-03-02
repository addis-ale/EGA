import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
//import { Toaster } from "@/components/ui/toaster";
import Providers from "./Provider";
import { Toaster } from "@/components/ui/toaster";
//import Providers from "./Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "EGA",
  description: "EGA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className}  overflow-y-auto scrollbar-hide`}>
        {/* Wrap with Providers to pass Redux store */}
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
