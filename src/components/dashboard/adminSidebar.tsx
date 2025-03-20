"use client";
import {
  BarChart,
  Package,
  Home,
  ShoppingCart,
  Settings,
  Users,
  PlusCircle,
} from "lucide-react";

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
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart,
  },
  {
    title: "Customers",
    url: "/admin/customers",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];
export function AdminSidebar() {
  const pathName = usePathname();
  const currentPath = pathName.split("/").slice(0, 2).join("/");
  return (
    <div>
      <Sidebar>
        <SidebarContent className="bg-black text-white">
          <SidebarGroup className="gap-8 px-6 py-8">
            <SidebarGroupLabel className="text-2xl font-bold">
              EGA Store
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-4">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={`${currentPath}/${item.url}`} passHref>
                        <item.icon />
                        <span className="md">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
