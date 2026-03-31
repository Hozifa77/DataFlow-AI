"use client";

import { useState } from "react";
import { 
  Wallet, 
  CreditCard, 
  TrendingUp, 
  Clock, 
  Zap, 
  CheckCircle2, 
  ArrowUpRight,
  Loader2,
  Star,
  Shield,
  Infinity
} from "lucide-react";
import Link from "next/link";
import { useApp } from "@/contexts/AppContext";

const topUpOptions = [
  { amount: 5, label: "$5", desc: "Minimum top-up" },
  { amount: 10, label: "$10", desc: "Starter pack" },
  { amount: 25, label: "$25", desc: "Best value" },
];

export default function CreditsPage() {
  const { credits, showToast, refreshCredits } = useApp();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(10);
  const [customAmount, setCustomAmount] = useState("");
  const [toppingUp, setToppingUp] = useState(false);
  const [activeTab, setActiveTab] = useState<"wallet" | "subscription">("wallet");

  const handleTopUp = async () => {
    const amount = selectedAmount || parseFloat(customAmount);
    if (!amount || amount < 5) {
      showToast("Minimum top-up is $5.00", "error");
      return;
    }

    setToppingUp(true);
    try {
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      if (!res.ok) throw new Error("Top-up failed");

      await refreshCredits();
      showToast(`Successfully added $${amount.toFixed(2)} to your wallet`, "success");
      setSelectedAmount(10);
      setCustomAmount("");
    } catch {
      showToast("Failed to process top-up. Please try again.", "error");
    } finally {
      setToppingUp(false);
    }
  };

  const usageHistory = [
    { id: 1, type: "deduction", desc: "Document extraction - Invoice_2024.pdf", amount: -0.05, date: "Mar 30, 2026" },
    { id: 2, type: "deduction", desc: "Document extraction - Receipt_March.png", amount: -0.05, date: "Mar 29, 2026" },
    { id: 3, type: "topup", desc: "Wallet top-up", amount: 10.00, date: "Mar 28, 2026" },
    { id: 4, type: "deduction", desc: "Document extraction - Contract_v2.pdf", amount: -0.05, date: "Mar 27, 2026" },
    { id: 5, type: "deduction", desc: "Document extraction - Timesheet_Q1.pdf", amount: -0.05, date: "Mar 26, 2026" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Credits & Wallet</h1>
        <p className="text-gray-500 mt-1 font-medium">Manage your balance and view usage history.</p>
      </div>

      {/* Balance Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#E8F5E9] rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-[#2E7D32]" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Balance</span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900">${credits.toFixed(2)}</div>
          <p className="text-xs text-gray-400 mt-2 font-medium">Available for extractions</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cost Per Doc</span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900">$0.05</div>
          <p className="text-xs text-gray-400 mt-2 font-medium">Per document extraction</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Docs Remaining</span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900">{Math.floor(credits / 0.05)}</div>
          <p className="text-xs text-gray-400 mt-2 font-medium">Based on current balance</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab("wallet")}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === "wallet" 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Add Credits
        </button>
        <button
          onClick={() => setActiveTab("subscription")}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === "subscription" 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Subscription
        </button>
      </div>

      {activeTab === "wallet" ? (
        /* Add Credits Section */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-[#2E7D32]" />
            Top Up Your Wallet
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {topUpOptions.map((opt) => (
              <button
                key={opt.amount}
                onClick={() => { setSelectedAmount(opt.amount); setCustomAmount(""); }}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  selectedAmount === opt.amount
                    ? "border-[#2E7D32] bg-[#E8F5E9] shadow-md"
                    : "border-gray-100 hover:border-gray-200 bg-white"
                }`}
              >
                <div className="text-2xl font-extrabold text-gray-900">{opt.label}</div>
                <div className="text-xs text-gray-400 font-medium mt-1">{opt.desc}</div>
                {selectedAmount === opt.amount && (
                  <CheckCircle2 className="w-5 h-5 text-[#2E7D32] mt-3" />
                )}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Custom Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
              <input
                type="number"
                min="5"
                step="0.01"
                placeholder="Enter amount (min $5)"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-[#2E7D32]/5 focus:border-[#2E7D32] outline-none font-bold text-sm"
              />
            </div>
          </div>

          <button
            onClick={handleTopUp}
            disabled={toppingUp || (!selectedAmount && !customAmount)}
            className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {toppingUp ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
            ) : (
              <><Zap className="w-5 h-5 mr-2" /> Add ${selectedAmount || customAmount || "0.00"} to Wallet</>
            )}
          </button>
        </div>
      ) : (
        /* Subscription Section */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <Star className="w-5 h-5 mr-2 text-[#1976D2]" />
            Subscription Plans
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pay As You Go */}
            <div className="p-6 rounded-2xl border-2 border-gray-100 bg-gray-50/50">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Current Plan</div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-1">Pay As You Go</h3>
              <p className="text-sm text-gray-500 mb-6">Credit-based usage. Top up as needed.</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                  $0.05 per document
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                  No commitment
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                  Standard processing
                </li>
              </ul>
              <div className="text-xs font-bold text-[#2E7D32] uppercase tracking-widest">Active</div>
            </div>

            {/* Unlimited Plan */}
            <div className="p-6 rounded-2xl border-2 border-[#1976D2] bg-blue-50/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#1976D2] text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                Recommended
              </div>
              <div className="text-xs font-bold text-[#1976D2] uppercase tracking-widest mb-2">Best Value</div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-1 flex items-center">
                Unlimited Plan
                <Infinity className="w-5 h-5 ml-2 text-[#1976D2]" />
              </h3>
              <p className="text-sm text-gray-500 mb-6">Unlimited documents with fair usage.</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-[#1976D2] mr-3 flex-shrink-0" />
                  <strong>Unlimited</strong>&nbsp;documents
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-[#1976D2] mr-3 flex-shrink-0" />
                  Fair usage policy applies
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-[#1976D2] mr-3 flex-shrink-0" />
                  <Shield className="w-3 h-3 mr-1" /> Priority processing
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-[#1976D2] mr-3 flex-shrink-0" />
                  Priority support
                </li>
              </ul>
              <button className="w-full bg-[#1976D2] hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Upgrade to Unlimited
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Usage History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-gray-400" />
            Transaction History
          </h2>
        </div>

        <div className="divide-y divide-gray-50">
          {usageHistory.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  item.type === "topup" ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-gray-50 text-gray-400"
                }`}>
                  {item.type === "topup" ? <TrendingUp className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5 rotate-90" />}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">{item.desc}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.date}</div>
                </div>
              </div>
              <div className={`text-sm font-extrabold ${item.amount > 0 ? "text-[#2E7D32]" : "text-gray-900"}`}>
                {item.amount > 0 ? "+" : ""}{item.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
