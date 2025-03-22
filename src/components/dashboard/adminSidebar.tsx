"use client";
import { Package, Home, ShoppingCart, PlusCircle, LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SignoutModal } from "./signout-modal";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Create Post",
    url: "/dashboard/createpost",
    icon: PlusCircle,
  },
  {
    title: "Products",
    url: "/dashboard/products",
    icon: Package,
  },

  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: ShoppingCart,
  },
];
export function AdminSidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathName = usePathname();
  const currentPath = pathName.split("/").slice(0, 2).join("/");
  const handleSignoutClick = () => {
    setIsModalOpen(true); // Open the sign-out modal
  };

  return (
    <div className="flex flex-col h-full">
      <Sidebar>
        <SidebarContent className="bg-black text-white flex flex-col h-full">
          <SidebarGroup className="gap-8 px-6 py-8 flex flex-col h-full">
            <SidebarGroupLabel className="text-2xl font-bold">
              EGA Store
            </SidebarGroupLabel>

            <SidebarGroupContent className="flex flex-col flex-1">
              <SidebarMenu className="gap-4 flex-1">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={`${currentPath}/${item.url}`}
                        passHref
                        className="flex items-center gap-3"
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="hidden md:inline">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>

              <div
                className="flex gap-2 cursor-pointer"
                onClick={handleSignoutClick}
              >
                <LogOut />
                <span>Exit</span>
                {isModalOpen && (
                  <SignoutModal onClose={() => setIsModalOpen(false)} />
                )}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
