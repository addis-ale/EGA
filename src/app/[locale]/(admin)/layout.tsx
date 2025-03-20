import { AdminSidebar } from "@/components/dashboard/adminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white">
      <SidebarProvider className="bg-black">
        <AdminSidebar />
        <SidebarTrigger className="text-teal" />
        <main className="flex items-center justify-center mx-auto my-auto w-full min-h-screen bg-black">
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
