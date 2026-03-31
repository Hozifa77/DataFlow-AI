"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  CreditCard,
  Loader2,
  ChevronDown,
  UserCircle,
  Shield,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  Check
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { credits, notifications, unreadCount, loading, markNotificationRead, markAllRead } = useApp();
  
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Upload & Extract", icon: UploadIcon, href: "/dashboard/upload" },
    { label: "Documents", icon: Files, href: "/dashboard/documents" },
    { label: "Credits", icon: Wallet, href: "/dashboard/credits" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  const userMenuItems = [
    { label: "Profile", icon: UserCircle, href: "/dashboard/account-settings" },
    { label: "Account Settings", icon: Shield, href: "/dashboard/account-settings" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
    { label: "Billing / Credits", icon: CreditCard, href: "/dashboard/credits" },
  ];

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "error": return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getNotifBg = (type: string) => {
    switch (type) {
      case "success": return "bg-green-50";
      case "warning": return "bg-yellow-50";
      case "error": return "bg-red-50";
      default: return "bg-blue-50";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <Link href="/" className="h-16 flex items-center px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
          <BrainCircuit className="w-6 h-6 text-[#2E7D32] mr-2" />
          <span className="font-bold text-lg text-gray-900 tracking-tight">Loro Entry</span>
        </Link>
        
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
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              <CreditCard className="w-3.5 h-3.5 mr-2" />
              Your Balance
            </div>
            <div className="text-2xl font-bold text-[#2E7D32] mb-3 flex items-center">
              {loading ? <Loader2 className="w-5 h-5 animate-spin text-gray-300" /> : `$${credits?.toFixed(2)}`}
            </div>
            <Link href="/dashboard/credits" className="block text-center text-xs font-bold bg-[#E8F5E9] text-[#2E7D32] py-2.5 rounded-md hover:bg-[#C8E6C9] transition-colors">
              Manage Wallet
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
          <Link href="/" className="flex items-center md:hidden hover:opacity-80 transition-opacity">
            <BrainCircuit className="w-6 h-6 text-[#2E7D32] mr-2" />
            <span className="font-bold text-lg text-gray-900">Loro Entry</span>
          </Link>
          
          <div className="hidden md:block flex-1">
          </div>

          <div className="flex items-center space-x-5">
            {/* Notifications Bell */}
            <div className="relative" ref={notifDropdownRef}>
              <button 
                onClick={() => { setNotifDropdownOpen(!notifDropdownOpen); setUserDropdownOpen(false); }}
                className="text-gray-400 hover:text-[#2E7D32] relative p-1 transition-colors"
              >
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
                <Bell className="w-5 h-5" />
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllRead}
                        className="text-xs font-bold text-[#2E7D32] hover:text-[#1B5E20] flex items-center"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`flex items-start space-x-3 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0 ${
                          !notif.read ? "bg-blue-50/30" : ""
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${getNotifBg(notif.type)}`}>
                          {getNotifIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-900">{notif.title}</span>
                            {!notif.read && <div className="w-2 h-2 bg-[#1976D2] rounded-full flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="py-12 text-center">
                        <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                        <p className="text-sm text-gray-400 font-medium">No notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="h-6 w-px bg-gray-200"></div>
            
            {/* User Account Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button 
                onClick={() => { setUserDropdownOpen(!userDropdownOpen); setNotifDropdownOpen(false); }}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <div className="hidden md:block text-right">
                  <div className="text-sm font-bold text-gray-900 leading-none mb-1 group-hover:text-[#2E7D32] transition-colors">Account User</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none">Standard Tier</div>
                </div>
                <div className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 border border-gray-200 group-hover:border-[#2E7D32] group-hover:bg-[#E8F5E9] group-hover:text-[#2E7D32] transition-all overflow-hidden shadow-sm">
                  <User className="w-5 h-5" />
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform hidden md:block ${userDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/30">
                    <div className="text-sm font-bold text-gray-900">Account User</div>
                    <div className="text-xs text-gray-400 mt-0.5">user@example.com</div>
                  </div>
                  <div className="py-2">
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-3 px-5 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-700 hover:text-gray-900"
                      >
                        <item.icon className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-gray-50 py-2">
                    <button 
                      onClick={() => { setUserDropdownOpen(false); router.push("/"); }}
                      className="flex items-center space-x-3 px-5 py-3 hover:bg-red-50 transition-colors text-sm text-red-600 w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto w-full scroll-smooth">
          <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
