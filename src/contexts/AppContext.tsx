"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

interface Notification {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

interface AppContextType {
  user: any;
  credits: number;
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  refreshCredits: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  addNotification: (n: Omit<Notification, "id" | "read" | "created_at">) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<number>(10.0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  const refreshCredits = useCallback(async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return;

    const { data } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", currentUser.id)
      .single();

    if (data) setCredits(data.credits);
  }, []);

  const refreshNotifications = useCallback(async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) {
      setNotifications([
        { id: "1", type: "success", title: "Welcome", message: "Your account is ready. You have $10.00 in credits.", read: false, created_at: new Date().toISOString() },
        { id: "2", type: "info", title: "Getting Started", message: "Upload your first document to begin extracting data.", read: false, created_at: new Date().toISOString() },
      ]);
      return;
    }

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) setNotifications(data);
  }, []);

  const markNotificationRead = useCallback(async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await supabase.from("notifications").update({ read: true }).eq("id", id);
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser) {
      await supabase.from("notifications").update({ read: true }).eq("user_id", currentUser.id).eq("read", false);
    }
  }, []);

  const addNotification = useCallback((n: Omit<Notification, "id" | "read" | "created_at">) => {
    const newNotif: Notification = {
      ...n,
      id: Date.now().toString(),
      read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => {
    async function init() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      if (currentUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("credits")
          .eq("id", currentUser.id)
          .single();

        if (profile) setCredits(profile.credits);

        const { data: notifs } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false })
          .limit(20);

        if (notifs) setNotifications(notifs);
      } else {
        setCredits(10.0);
        setNotifications([
          { id: "1", type: "success", title: "Welcome", message: "Your account is ready. You have $10.00 in credits.", read: false, created_at: new Date().toISOString() },
          { id: "2", type: "info", title: "Getting Started", message: "Upload your first document to begin extracting data.", read: false, created_at: new Date().toISOString() },
        ]);
      }

      setLoading(false);
    }

    init();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      user,
      credits,
      notifications,
      unreadCount,
      loading,
      refreshCredits,
      refreshNotifications,
      markNotificationRead,
      markAllRead,
      addNotification,
      showToast,
    }}>
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className={`px-6 py-4 rounded-xl shadow-2xl font-bold text-sm flex items-center space-x-3 ${
            toast.type === "success" ? "bg-[#2E7D32] text-white" :
            toast.type === "error" ? "bg-red-600 text-white" :
            "bg-[#1976D2] text-white"
          }`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
