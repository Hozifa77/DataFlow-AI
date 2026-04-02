"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

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
  initialCredits: number;
  creditsUsed: number;
  usagePercent: number;
  usageColor: "green" | "yellow" | "red";
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  showUpgradePrompt: boolean;
  operationCount: number;
  deductionAnimation: { amount: number; key: number } | null;
  refreshCredits: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  addNotification: (n: Omit<Notification, "id" | "read" | "created_at">) => void;
  showToast: (message: string, type?: "success" | "error" | "info" | "celebration") => void;
  dismissUpgradePrompt: () => void;
  recordOperation: () => void;
  logout: () => Promise<void>;
}

const INITIAL_CREDITS = 10.0;
const COST_PER_DOC = 0.05;

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<number>(INITIAL_CREDITS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [operationCount, setOperationCount] = useState(0);
  const [deductionAnimation, setDeductionAnimation] = useState<{ amount: number; key: number } | null>(null);
  const upgradeDismissed = useRef(false);

  const creditsUsed = Math.max(0, INITIAL_CREDITS - credits);
  const usagePercent = Math.min(100, (creditsUsed / INITIAL_CREDITS) * 100);

  const usageColor: "green" | "yellow" | "red" =
    usagePercent < 50 ? "green" :
    usagePercent < 80 ? "yellow" : "red";

  const checkUpgradePrompt = useCallback((currentCredits: number, ops: number) => {
    if (upgradeDismissed.current) return;
    const percentUsed = ((INITIAL_CREDITS - currentCredits) / INITIAL_CREDITS) * 100;
    if (percentUsed >= 50 || ops >= 3) {
      setShowUpgradePrompt(true);
    }
  }, []);

  const refreshCredits = useCallback(async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return;

    const { data } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", currentUser.id)
      .single();

    if (data) {
      const prevCredits = credits;
      setCredits(data.credits);
      const deducted = prevCredits - data.credits;
      if (deducted > 0) {
        setDeductionAnimation({ amount: deducted, key: Date.now() });
        setTimeout(() => setDeductionAnimation(null), 2500);
      }
      checkUpgradePrompt(data.credits, operationCount);
    } else {
      const { data: newProfile } = await supabase
        .from("profiles")
        .insert({ id: currentUser.id, email: currentUser.email, credits: 10.00 })
        .select("credits")
        .single();
      if (newProfile) setCredits(newProfile.credits);
    }
  }, [credits, operationCount, checkUpgradePrompt]);

  const recordOperation = useCallback(() => {
    setOperationCount(prev => {
      const newCount = prev + 1;
      checkUpgradePrompt(credits, newCount);
      return newCount;
    });
  }, [credits, checkUpgradePrompt]);

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

  const showToast = useCallback((message: string, type: "success" | "error" | "info" | "celebration" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const dismissUpgradePrompt = useCallback(() => {
    setShowUpgradePrompt(false);
    upgradeDismissed.current = true;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCredits(INITIAL_CREDITS);
    setNotifications([]);
    window.location.href = "/login";
  }, []);

  const loadUserData = useCallback(async (currentUser: any) => {
    setUser(currentUser);

    if (currentUser) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", currentUser.id)
        .single();

      if (profile) {
        setCredits(profile.credits);
      } else {
        const { data: newProfile } = await supabase
          .from("profiles")
          .insert({ id: currentUser.id, email: currentUser.email, credits: 10.00 })
          .select("credits")
          .single();
        if (newProfile) setCredits(newProfile.credits);
      }

      const { data: notifs } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (notifs) setNotifications(notifs);
    } else {
      setCredits(INITIAL_CREDITS);
      setNotifications([
        { id: "1", type: "success", title: "Welcome", message: "Your account is ready. You have $10.00 in credits.", read: false, created_at: new Date().toISOString() },
        { id: "2", type: "info", title: "Getting Started", message: "Upload your first document to begin extracting data.", read: false, created_at: new Date().toISOString() },
      ]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    async function init() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      await loadUserData(currentUser);

      if (currentUser && (window.location.pathname === '/login' || window.location.pathname === '/signup' || window.location.pathname === '/')) {
        window.location.href = '/dashboard';
      }
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (_event === "SIGNED_OUT") {
          setUser(null);
          setCredits(INITIAL_CREDITS);
          setNotifications([]);
          setLoading(false);
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        } else if (_event === "SIGNED_IN" && session?.user) {
          await loadUserData(session.user);
          if (window.location.pathname === '/login' || window.location.pathname === '/signup' || window.location.pathname === '/' || window.location.pathname.startsWith('/auth')) {
            window.location.href = '/dashboard';
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUserData]);

  useEffect(() => {
    if (window.location.pathname === '/example-user' || window.location.pathname === '/user' || window.location.pathname.startsWith('/auth/callback')) {
      return;
    }
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      user,
      credits,
      initialCredits: INITIAL_CREDITS,
      creditsUsed,
      usagePercent,
      usageColor,
      notifications,
      unreadCount,
      loading,
      showUpgradePrompt,
      operationCount,
      deductionAnimation,
      refreshCredits,
      refreshNotifications,
      markNotificationRead,
      markAllRead,
      addNotification,
      showToast,
      dismissUpgradePrompt,
      recordOperation,
      logout,
    }}>
      {children}

      {/* Deduction Animation */}
      {deductionAnimation && (
        <div className="fixed bottom-20 right-6 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl shadow-lg font-bold text-sm flex items-center space-x-2">
            <span>- ${deductionAnimation.amount.toFixed(2)} deducted</span>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className={`px-6 py-4 rounded-xl shadow-2xl font-bold text-sm flex items-center space-x-3 ${
            toast.type === "success" ? "bg-[#2E7D32] text-white" :
            toast.type === "error" ? "bg-red-600 text-white" :
            toast.type === "celebration" ? "bg-[#2E7D32] text-white" :
            "bg-[#1976D2] text-white"
          }`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Upgrade Prompt Modal */}
      {showUpgradePrompt && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-12 h-1 bg-[#1976D2] rounded-full mx-auto mb-6"></div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2 text-center">Upgrade for More</h2>
            <p className="text-gray-500 text-center mb-6">
              Upgrade now for uninterrupted usage and faster processing.
            </p>
            <div className="space-y-3 mb-6">
              <a
                href="/dashboard/credits"
                className="block w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white py-3.5 rounded-xl font-bold transition-all text-center"
              >
                Buy Credits
              </a>
              <a
                href="/dashboard/credits"
                className="block w-full bg-[#1976D2] hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all text-center"
              >
                Go Unlimited
              </a>
              <button
                onClick={dismissUpgradePrompt}
                className="block w-full text-gray-400 hover:text-gray-600 py-2 text-sm font-medium transition-colors"
              >
                Maybe later
              </button>
            </div>
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
