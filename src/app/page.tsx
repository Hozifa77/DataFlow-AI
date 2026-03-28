"use client";

import Link from "next/link";
import { ArrowRight, BrainCircuit, CheckCircle2, Database, FileSpreadsheet, Fingerprint, Lock, ShieldCheck, Upload } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 selection:bg-green-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-[#2E7D32] p-1.5 rounded-lg flex items-center justify-center">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">DataFlow AI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
              <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="hidden md:block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-5 py-2.5 rounded-md text-sm font-medium transition-all shadow-sm hover:shadow-md"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-20 pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center bg-[#E8F5E9] text-[#2E7D32] px-4 py-1.5 rounded-full text-sm font-semibold mb-2">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Enterprise-Grade AI Extraction
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Automate Data Entry with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] to-[#1976D2]">AI Accuracy</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
              Transform unstructured documents into perfectly structured data in seconds. Human-in-the-loop AI extraction with uncompromising enterprise privacy guarantees.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-8 py-4 rounded-md text-lg font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-md text-lg font-medium transition-all shadow-sm"
              >
                See How It Works
              </a>
            </div>
            
            <p className="text-sm text-gray-500 mt-6 flex items-center justify-center">
              <Lock className="w-4 h-4 mr-1.5" /> No credit card required. Data auto-deleted.
            </p>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-white py-24 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Unmatched Precision & Privacy</h2>
              <p className="text-lg text-gray-600">Our self-hosted AI models guarantee your data never leaves your environment or trains foreign algorithms.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: BrainCircuit, title: 'AI Extraction', desc: 'Process invoices, receipts, and complex forms utilizing advanced multimodal models.', color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: CheckCircle2, title: 'Smart Validation', desc: 'Auto-flags low confidence fields for lightning-fast human review and approval.', color: 'text-green-600', bg: 'bg-green-50' },
                { icon: Database, title: 'Multi-Format Export', desc: 'Export instantly to Excel, CSV, JSON or push directly to APIs and Databases.', color: 'text-purple-600', bg: 'bg-purple-50' },
                { icon: Fingerprint, title: 'Secure Processing', desc: 'End-to-end encryption. Zero-retention policies. Compliance-ready infrastructure.', color: 'text-red-600', bg: 'bg-red-50' },
              ].map((f, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${f.bg} ${f.color}`}>
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">From Chaos to Structure in 3 Steps</h2>
              <p className="text-lg text-gray-600">The fastest path to structured data entry imaginable.</p>
            </div>

            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 hidden md:block -translate-y-1/2"></div>
              <div className="grid md:grid-cols-3 gap-12 relative z-10">
                {[
                  { step: '01', title: 'Upload Files', desc: 'Drag and drop PDFs, images, or scanned documents. Fast, bulk-upload ready.', icon: Upload },
                  { step: '02', title: 'AI OCR & Validate', desc: 'Our AI extracts the data. You review the highlighted fields to ensure 100% accuracy.', icon: ShieldCheck },
                  { step: '03', title: 'Export & Automate', desc: 'Download as an Excel sheet or seamlessly send data to your ERP with one click.', icon: FileSpreadsheet },
                ].map((s, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl relative text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#2E7D32] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-6 ring-4 ring-white">
                      {s.step}
                    </div>
                    <s.icon className="w-10 h-10 text-gray-400 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                    <p className="text-gray-600">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="bg-white py-24 border-y border-gray-200">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Pay as you process</h2>
              <p className="text-lg text-gray-600">Flexible credit-based system. Transparent, scalable pricing for teams of any size.</p>
            </div>

            <div className="max-w-lg mx-auto bg-gray-50 rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Credit System</h3>
              <p className="text-gray-600 mb-6">Recharge credits whenever you need. Minimum $5 top-up.</p>
              
              <div className="flex items-center justify-center text-4xl font-extrabold text-gray-900 mb-8">
                $0.05 <span className="text-lg text-gray-500 font-medium ml-2">/ page</span>
              </div>

              <ul className="space-y-4 mb-8 text-left max-w-xs mx-auto">
                <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-green-600 mr-3" /> <span className="text-gray-700">All data extraction features</span></li>
                <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-green-600 mr-3" /> <span className="text-gray-700">Wallet system & history</span></li>
                <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-green-600 mr-3" /> <span className="text-gray-700">Unlimited users</span></li>
              </ul>

              <Link
                href="/dashboard"
                className="block w-full bg-[#1976D2] hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-medium transition-colors"
               >
                View Credit Wallet
              </Link>
            </div>
           </div>
        </section>

        {/* About / Final CTA */}
        <section className="bg-[#111827] text-white py-24 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <BrainCircuit className="w-16 h-16 text-[#4CAF50] mx-auto mb-8" />
            <h2 className="text-4xl font-bold mb-6">Scale your operations securely</h2>
            <p className="text-xl text-gray-400 font-light mb-10 leading-relaxed">
              We envisioned a world where data entry doesn't consume human potential. By merging world-class private AI with an elegant human validation layer, our tools ensure accurate data processing that you can trust completely.
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-[#4CAF50] hover:bg-[#388E3C] text-white px-8 py-4 rounded-md text-lg font-bold transition-transform hover:-translate-y-1 shadow-lg"
            >
              Start Automating Today
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#0b0f19] text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <BrainCircuit className="w-6 h-6 text-gray-500" />
            <span className="font-bold text-lg text-gray-200">DataFlow AI</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-sm mt-4 md:mt-0">© 2026 DataFlow AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
