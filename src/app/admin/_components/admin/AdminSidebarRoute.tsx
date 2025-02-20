"use client";

import React from "react";
import SidebarItem from "./Sidebaritem";

import { Compass, Layout } from "lucide-react";

export default function AdminSidebar() {
  const route = [
    {
      icon: Compass,
      label: "search",
      href: "/admin/search",
    },
    {
      icon: Layout,

      label: "dashboard",
      href: "/admin",
    },
  ];

  return (
    <nav>
      {route.map((route) => (
        <SidebarItem
          key={route.label}
          label={route.label}
          href={route.href}
          icon={route.icon}
        />
      ))}
    </nav>
  );
}
