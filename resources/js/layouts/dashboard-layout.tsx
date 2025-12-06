import Sidebar from "@/components/frontend/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
          {/* <TopNav /> */}
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
    </div>
  );
}
