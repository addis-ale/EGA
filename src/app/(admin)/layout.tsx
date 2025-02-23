import { AdminSidebar } from "@/components/dashboard/adminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white">
      <SidebarProvider>
        <AdminSidebar />
        <SidebarTrigger />
        <main className="flex items-center justify-center mx-auto my-auto max-w-4xl min-h-screen">
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
