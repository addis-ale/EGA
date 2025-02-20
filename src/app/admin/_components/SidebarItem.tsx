"use client";

import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export default function SidebarItem({
  label,
  href,
  icon: Icon,
}: SidebarItemProps) {
  // const pathname = usePathname();
  const route = useRouter();
  const onclick = () => {
    route.push(href);
  };
  return (
    <button onClick={onclick}>
      <Icon />

      <div>{label}</div>
    </button>
  );
}
