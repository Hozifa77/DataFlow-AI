"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrainCircuit, Check, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
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
          emailRedirectTo: `${window.location.origin}/auth/callback`,
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
        if (data.session) {
          router.push("/dashboard");
          router.refresh();
        } else {
          // If email confirmations are enabled in Supabase, session will be null
          setError("Success! Please check your email to verify your account.");
          setFullName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        }
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch {
      setError("Failed to sign up with Google.");
      setLoading(false);
    }
  }

  const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      <path d="M1 1h22v22H1z" fill="none" />
    </svg>
  );

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

            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GoogleIcon />
              Sign up with Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or sign up with email</span>
              </div>
            </div>

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
