"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrainCircuit, Check, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function validate(): string | null {
    if (!fullName || !email || !password || !confirmPassword) {
      return "Please fill in all fields.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters.";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    if (!agreeTerms) {
      return "You must agree to the Terms & Conditions.";
    }
    return null;
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.toLowerCase().includes("already registered") ||
            signUpError.message.toLowerCase().includes("already exists") ||
            signUpError.message.toLowerCase().includes("user already")) {
          setError("An account with this email already exists.");
        } else if (signUpError.message.toLowerCase().includes("password")) {
          setError("Password is too weak. Use at least 8 characters.");
        } else {
          setError(signUpError.message);
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  const passwordChecks = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Passwords match", met: password.length > 0 && password === confirmPassword },
    { label: "Terms accepted", met: agreeTerms },
  ];

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
            Start your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-[#81C784]">free trial today</span>
          </h1>
          <p className="text-lg text-gray-400 font-light max-w-md leading-relaxed">
            Get $10 in free credits to experience AI-powered document extraction. No credit card required.
          </p>

          <div className="space-y-4 pt-4">
            {[
              { icon: "1", text: "Create your free account" },
              { icon: "2", text: "Receive $10 in credits instantly" },
              { icon: "3", text: "Upload documents and extract data" },
            ].map((step, idx) => (
              <div key={idx} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-[#2E7D32]/20 rounded-full flex items-center justify-center text-[#4CAF50] text-sm font-bold flex-shrink-0">
                  {step.icon}
                </div>
                <span className="text-gray-300 text-sm">{step.text}</span>
              </div>
            ))}
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
            <h2 className="text-3xl font-extrabold text-gray-900">Create account</h2>
            <p className="text-gray-500 mt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-[#2E7D32] hover:text-[#1B5E20] font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in duration-200">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-sm font-bold text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all text-sm"
                  autoComplete="name"
                />
              </div>
            </div>

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
                  placeholder="Minimum 8 characters"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all text-sm"
                  autoComplete="new-password"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all text-sm"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms Acceptance */}
            <div className="flex items-start space-x-3 pt-1">
              <button
                type="button"
                onClick={() => setAgreeTerms(!agreeTerms)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                  agreeTerms
                    ? "bg-[#2E7D32] border-[#2E7D32]"
                    : "border-gray-300 hover:border-[#2E7D32]"
                }`}
              >
                {agreeTerms && <Check className="w-3 h-3 text-white" />}
              </button>
              <span className="text-sm text-gray-600 leading-snug">
                I agree to the{" "}
                <Link href="/terms" target="_blank" className="text-[#2E7D32] hover:underline font-medium">
                  Terms &amp; Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" target="_blank" className="text-[#2E7D32] hover:underline font-medium">
                  Privacy Policy
                </Link>
              </span>
            </div>

            {/* Password Requirements */}
            {(password.length > 0 || confirmPassword.length > 0 || !agreeTerms) && (
              <div className="bg-gray-50 rounded-xl p-3 space-y-2 animate-in fade-in duration-200">
                {passwordChecks.map((check, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                      check.met ? "bg-[#2E7D32]" : "bg-gray-200"
                    }`}>
                      {check.met && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className={`text-xs font-medium ${check.met ? "text-[#2E7D32]" : "text-gray-500"}`}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !agreeTerms}
              className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400">
            By creating an account, you&apos;ll receive <span className="font-bold text-[#2E7D32]">$10 in free credits</span> to get started.
          </p>
        </div>
      </div>
    </div>
  );
}
