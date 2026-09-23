import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#FFF9F5]">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Admin Content */}
      <main className="lg:ml-[277px] pt-16 min-h-screen">
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}