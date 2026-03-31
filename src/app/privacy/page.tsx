import Link from "next/link";
import { BrainCircuit, Shield, Lock, Trash2, Mail, FileText, Eye, Database } from "lucide-react";

export const metadata = {
  title: "Privacy Policy – Loro Entry",
  description: "Learn how Loro Entry protects your data and privacy.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-[#2E7D32] p-1.5 rounded-lg flex items-center justify-center">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">Loro Entry</span>
            </Link>
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <div className="inline-flex items-center bg-[#E8F5E9] text-[#2E7D32] px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Privacy Policy
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Privacy Policy</h1>
          <p className="text-gray-500 mt-3 text-lg">Last updated: March 31, 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 md:p-12 space-y-10">
            {/* Section 1 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">1. Data Collection</h2>
              </div>
              <div className="text-gray-600 space-y-3 leading-relaxed pl-13">
                <p>Loro Entry collects only the minimum data necessary to provide our document processing service:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account information:</strong> Email address and name for account management</li>
                  <li><strong>Documents:</strong> Files you upload for AI-powered data extraction</li>
                  <li><strong>Usage data:</strong> Processing history and credit transactions</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Database className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">2. How We Use Your Data</h2>
              </div>
              <div className="text-gray-600 space-y-3 leading-relaxed pl-13">
                <p>Your data is used exclusively for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Processing your documents and extracting structured data</li>
                  <li>Managing your account and credit balance</li>
                  <li>Sending service notifications (processing complete, low balance)</li>
                </ul>
                <div className="bg-[#E8F5E9] border border-[#2E7D32]/20 rounded-xl p-4 mt-4">
                  <p className="text-[#2E7D32] font-bold text-sm flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Your data is NEVER used for AI training or shared with third parties.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">3. Data Security</h2>
              </div>
              <div className="text-gray-600 space-y-3 leading-relaxed pl-13">
                <p>We implement industry-standard security measures:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>End-to-end encryption for all data in transit and at rest</li>
                  <li>Secure infrastructure hosted on trusted cloud providers</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Access controls limiting who can view your data</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-yellow-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">4. Data Retention & Deletion</h2>
              </div>
              <div className="text-gray-600 space-y-3 leading-relaxed pl-13">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Processed files may be automatically deleted after 30 days (configurable in Settings)</li>
                  <li>You can delete your documents at any time from your dashboard</li>
                  <li>Account deletion removes all associated data permanently</li>
                  <li>You can export your data at any time before deletion</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">5. Your Rights</h2>
              </div>
              <div className="text-gray-600 space-y-3 leading-relaxed pl-13">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access all personal data we hold about you</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your account and data</li>
                  <li>Export your data in a portable format</li>
                  <li>Withdraw consent for data processing</li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-[#2E7D32]" />
                Contact Us
              </h2>
              <p className="text-gray-600">
                For privacy-related questions or data requests, contact us at:{' '}
                <a href="mailto:support@loroentry.com" className="text-[#2E7D32] font-bold hover:underline">
                  support@loroentry.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b0f19] text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <BrainCircuit className="w-6 h-6 text-gray-500" />
            <span className="font-bold text-lg text-gray-200">Loro Entry</span>
          </div>
          <div className="flex space-x-6">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="/agreement" className="hover:text-white transition-colors">Agreement</a>
          </div>
          <p className="text-sm mt-4 md:mt-0">&copy; 2026 Loro Entry. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
