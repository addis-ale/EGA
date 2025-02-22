import { AdminSidebar } from "@/components/dashboard/adminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white">
      <SidebarProvider>
        <AdminSidebar />
        <main>
          <SidebarTrigger />

          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
