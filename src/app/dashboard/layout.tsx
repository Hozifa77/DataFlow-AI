"use client";

import { ReactNode, useEffect, useState } from "react";
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
  CreditCard,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProfile() {
      // For MVP without full Auth complex setup, we assume a 'dummy-user' or use existing sessions if they were there
      // In a real app, this would be supabase.auth.getUser()
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Fallback for demo/dev if not logged in
        setCredits(10.00);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // No profile found, create one with starting $10 credit
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ id: user.id, credits: 10.00, email: user.email }])
          .select()
          .single();
        
        if (!createError) setCredits(10.00);
      } else if (data) {
        setCredits(data.credits);
      }
      setLoading(false);
    }

    getProfile();
  }, []);

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
          <div className="flex items-center md:hidden">
            <BrainCircuit className="w-6 h-6 text-[#2E7D32] mr-2" />
            <span className="font-bold text-lg text-gray-900">DataFlow AI</span>
          </div>
          
          <div className="hidden md:block flex-1">
          </div>

          <div className="flex items-center space-x-5">
            <button className="text-gray-400 hover:text-[#2E7D32] relative p-1 transition-colors">
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              <Bell className="w-5 h-5" />
            </button>
            
            <div className="h-6 w-px bg-gray-200"></div>
            
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="hidden md:block text-right">
                <div className="text-sm font-bold text-gray-900 leading-none mb-1 group-hover:text-[#2E7D32] transition-colors">Account User</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none">Standard Tier</div>
              </div>
              <div className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 border border-gray-200 group-hover:border-[#2E7D32] group-hover:bg-[#E8F5E9] group-hover:text-[#2E7D32] transition-all overflow-hidden shadow-sm">
                <User className="w-5 h-5" />
              </div>
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
