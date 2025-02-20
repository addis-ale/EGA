"use client";

import React from "react";
import SidebarItem from "./SidebarItem";

import { Compass, Layout } from "lucide-react";

export default function AdminSidebar() {
  const route = [
    {
      icon: Compass,
      label: "Add Game",
      href: "/admin/actions/addGames",
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
