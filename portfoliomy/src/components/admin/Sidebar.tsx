"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Code,
  Briefcase,
  GraduationCap,
  FolderSearch,
  Mail,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const menuItems = [
  { title: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { title: "Bio", path: "/admin/bio", icon: User },
  { title: "Skills", path: "/admin/skills", icon: Code },
  { title: "Experience", path: "/admin/experience", icon: Briefcase },
  { title: "Education", path: "/admin/education", icon: GraduationCap },
  { title: "Projects", path: "/admin/projects", icon: FolderSearch },
  { title: "Messages", path: "/admin/messages", icon: Mail },
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) =>
    path === "/admin" ? pathname === "/admin" : pathname.startsWith(path);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-[#171721] border-r border-white/10 
        flex flex-col pt-8 z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="px-6 mb-10 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Anas Portfolio
            </h1>
            <p className="text-xs text-gray-500">Admin Control Panel</p>
          </div>
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto pb-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${
                  active
                    ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }
              `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
