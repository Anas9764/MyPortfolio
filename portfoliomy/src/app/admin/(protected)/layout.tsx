"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Navbar";
import Providers from "@/components/admin/Providers";
import "@/styles/admin.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Providers>
      <div className="admin-theme flex min-h-screen bg-[#030014] text-white">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <div className="flex-1 flex flex-col min-w-0">
          <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

          <main className="p-4 md:p-6 overflow-x-hidden">{children}</main>
        </div>
      </div>
    </Providers>
  );
}
