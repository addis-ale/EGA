import Sidebar from "./_components/SideBar";
//
// import { authOptions } from "../api/auth/[...nextauth]";
// import Denied from "./_components/Denied";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //   const session = await getServerSession(authOptions);

  //   if (session.user.role !== "admin" || !session) {
  //     return <div>access denied</div>;
  //   }
  return (
    <div className="flex min-h-screen">
      <div className="w-64">
        <Sidebar />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
