import Link from "next/link";
import { BrainCircuit, Shield, AlertTriangle, CheckCircle2, FileText, Mail, UserCheck } from "lucide-react";

export const metadata = {
  title: "User Agreement – Loro Entry",
  description: "User agreement and consent terms for Loro Entry.",
};

export default function AgreementPage() {
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
            <UserCheck className="w-4 h-4 mr-2" />
            User Agreement
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">User Agreement</h1>
          <p className="text-gray-500 mt-3 text-lg">Last updated: March 31, 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 md:p-12 space-y-10">
            {/* Intro */}
            <section className="bg-[#E8F5E9] rounded-xl p-6 border border-[#2E7D32]/10">
              <p className="text-gray-700 leading-relaxed">
                This User Agreement outlines your responsibilities when using Loro Entry. By using our service, you acknowledge and agree to the terms below.
              </p>
            </section>

            {/* Section 1 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">1. User Responsibility</h2>
              </div>
              <div className="text-gray-600 space-y-3 leading-relaxed pl-13">
                <p>As a user of Loro Entry, you are responsible for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Providing accurate information during registration</li>
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Ensuring you have the right to upload and process any documents</li>
                  <li>Compliance with all applicable laws and regulations</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">2. AI Accuracy Disclaimer</h2>
              </div>
              <div className="text-gray-600 space-y-3 leading-relaxed pl-13">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-yellow-800 font-bold text-sm">
                    Important: AI extraction is not 100% accurate.
                  </p>
                </div>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Loro Entry uses AI models that may produce errors or misinterpretations</li>
                  <li>Accuracy depends on document quality, format, and complexity</li>
                  <li>The confidence score is an estimate, not a guarantee</li>
                  <li>You are solely responsible for verifying extracted data before use</li>
                  <li>We are not liable for any losses caused by inaccurate extractions</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">3. Validation Required</h2>
              </div>
              <div className="text-gray-600 space-y-3 leading-relaxed pl-13">
                <p>Loro Entry includes a human-in-the-loop validation step. You agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Review all extracted data before finalizing exports</li>
                  <li>Correct any errors identified during the review process</li>
                  <li>Not hold Loro Entry accountable for unvalidated data</li>
                  <li>Use the validation interface as intended for quality assurance</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">4. Consent to Data Processing</h2>
              </div>
              <div className="text-gray-600 space-y-3 leading-relaxed pl-13">
                <p>By using Loro Entry, you consent to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Processing of your uploaded documents by our AI systems</li>
                  <li>Temporary storage of documents for extraction and validation</li>
                  <li>Collection of usage data for service improvement</li>
                  <li>Processing in accordance with our Privacy Policy</li>
                </ul>
                <div className="bg-[#E8F5E9] border border-[#2E7D32]/20 rounded-xl p-4 mt-4">
                  <p className="text-[#2E7D32] font-bold text-sm flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Your documents are never used to train AI models.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">5. Changes to This Agreement</h2>
              </div>
              <div className="text-gray-600 space-y-3 leading-relaxed pl-13">
                <p>We may update this agreement from time to time. Continued use of Loro Entry after changes constitutes acceptance of the updated agreement. We will notify users of significant changes via email or in-app notification.</p>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-[#2E7D32]" />
                Contact Us
              </h2>
              <p className="text-gray-600">
                For questions about this agreement, contact us at:{' '}
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
