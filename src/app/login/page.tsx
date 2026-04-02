"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrainCircuit, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#111827] relative overflow-hidden flex-col justify-between p-12">
        <div>
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-[#2E7D32] p-2 rounded-lg">
              <BrainCircuit className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-2xl text-white tracking-tight">Loro Entry</span>
          </Link>
        </div>

        <div className="space-y-8">
          <h1 className="text-4xl font-extrabold text-white leading-tight">
            Welcome back to<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-[#81C784]">intelligent data entry</span>
          </h1>
          <p className="text-lg text-gray-400 font-light max-w-md leading-relaxed">
            Automate document processing with AI-powered extraction and human-in-the-loop validation.
          </p>

          <div className="flex items-center space-x-8 pt-4">
            <div>
              <div className="text-3xl font-extrabold text-white">10K+</div>
              <div className="text-sm text-gray-500">Documents processed</div>
            </div>
            <div className="w-px h-10 bg-gray-700"></div>
            <div>
              <div className="text-3xl font-extrabold text-white">99.2%</div>
              <div className="text-sm text-gray-500">Accuracy rate</div>
            </div>
            <div className="w-px h-10 bg-gray-700"></div>
            <div>
              <div className="text-3xl font-extrabold text-white">$0.05</div>
              <div className="text-sm text-gray-500">Per page</div>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600">
          &copy; 2026 Loro Entry. All rights reserved.
        </p>

        {/* Decorative circles */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#2E7D32]/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#1976D2]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
            <div className="bg-[#2E7D32] p-2 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">Loro Entry</span>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Sign in</h2>
            <p className="text-gray-500 mt-2">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#2E7D32] hover:text-[#1B5E20] font-semibold transition-colors">
                Create one
              </Link>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in duration-200">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all text-sm"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all text-sm"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#2E7D32] focus:ring-[#2E7D32]"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] disabled:bg-[#2E7D32]/60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-[#2E7D32] hover:underline">Terms &amp; Conditions</Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#2E7D32] hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
