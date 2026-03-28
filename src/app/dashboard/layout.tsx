"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Upload as UploadIcon, 
  Files, 
  Wallet, 
  Settings, 
  BrainCircuit,
  Bell,
  LogOut,
  User,
  CreditCard
} from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Upload & Extract", icon: UploadIcon, href: "/dashboard/upload" },
    { label: "Documents", icon: Files, href: "/dashboard/documents" },
    { label: "Credits", icon: Wallet, href: "/dashboard/credits" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <BrainCircuit className="w-6 h-6 text-[#2E7D32] mr-2" />
          <span className="font-bold text-lg text-gray-900 tracking-tight">DataFlow AI</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors ${
                  isActive 
                  ? "bg-[#E8F5E9] text-[#2E7D32] font-semibold" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center text-sm font-medium text-gray-900 mb-2">
              <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
              Credit Balance
            </div>
            <div className="text-2xl font-bold text-[#2E7D32] mb-3">$42.50</div>
            <Link href="/dashboard/credits" className="block text-center text-xs font-semibold bg-white border border-gray-300 text-gray-700 py-2 rounded shadow-sm hover:bg-gray-50">
              Recharge
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center md:hidden">
            <BrainCircuit className="w-6 h-6 text-[#2E7D32] mr-2" />
            <span className="font-bold text-lg text-gray-900">DataFlow AI</span>
          </div>
          
          <div className="hidden md:block flex-1">
            {/* Can add search here later */}
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-gray-600 relative p-1">
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              <Bell className="w-5 h-5" />
            </button>
            
            <div className="h-6 w-px bg-gray-200 mx-2"></div>
            
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium text-gray-900 leading-none mb-1">Jane Doe</div>
                <div className="text-xs text-gray-500 leading-none">Admin</div>
              </div>
              <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-gray-200 border border-gray-200 transition-colors">
                <User className="w-5 h-5" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto w-full">
          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
