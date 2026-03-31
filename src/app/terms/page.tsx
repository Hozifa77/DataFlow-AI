import Link from "next/link";
import { BrainCircuit, FileText, CreditCard, AlertTriangle, Scale, Mail, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions – Loro Entry",
  description: "Terms and conditions for using Loro Entry.",
};

export default function TermsPage() {
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
            <Scale className="w-4 h-4 mr-2" />
            Terms & Conditions
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Terms & Conditions</h1>
          <p className="text-gray-500 mt-3 text-lg">Last updated: March 31, 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 md:p-12 space-y-10">
            {/* Section 1 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">1. Acceptance of Terms</h2>
              </div>
              <div className="text-gray-600 space-y-3 leading-relaxed pl-13">
                <p>By accessing or using Loro Entry, you agree to be bound by these Terms & Conditions. If you do not agree, you must not use our service. These terms apply to all users, including visitors, registered users, and paying customers.</p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">2. Acceptable Use</h2>
              </div>
              <div className="text-gray-600 space-y-3 leading-relaxed pl-13">
                <p>You agree to use Loro Entry only for lawful purposes. You must NOT:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Upload documents containing illegal content</li>
                  <li>Attempt to reverse-engineer or extract our AI models</li>
                  <li>Share your account credentials with others</li>
                  <li>Use automated tools to abuse the service or exceed rate limits</li>
                  <li>Resell or redistribute the service without authorization</li>
                  <li>Upload malicious files designed to compromise our systems</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">3. Credits & Payment Policy</h2>
              </div>
              <div className="text-gray-600 space-y-3 leading-relaxed pl-13">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Loro Entry operates on a credit-based system at $0.05 per document extraction</li>
                  <li>Minimum wallet top-up is $5.00</li>
                  <li>Credits are non-refundable once purchased</li>
                  <li>Credits do not expire but may be subject to fair usage policies</li>
                  <li>The Unlimited Plan follows a fair usage policy (reasonable personal/business use)</li>
                  <li>Prices may change with 30 days notice to existing users</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">4. Service Availability</h2>
              </div>
              <div className="text-gray-600 space-y-3 leading-relaxed pl-13">
                <p>Loro Entry is provided on an &quot;as is&quot; and &quot;as available&quot; basis:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We do not guarantee 100% uptime or uninterrupted service</li>
                  <li>Scheduled maintenance may temporarily restrict access</li>
                  <li>We reserve the right to modify, suspend, or discontinue features</li>
                  <li>AI extraction accuracy varies by document quality and type</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <Scale className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">5. Limitation of Liability</h2>
              </div>
              <div className="text-gray-600 space-y-3 leading-relaxed pl-13">
                <p>To the maximum extent permitted by law:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Loro Entry is not liable for any indirect, incidental, or consequential damages</li>
                  <li>We are not responsible for data loss due to user error or system failure</li>
                  <li>Our total liability is limited to the amount you paid in the last 12 months</li>
                  <li>You are responsible for validating extracted data before use in business operations</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">6. Termination</h2>
              </div>
              <div className="text-gray-600 space-y-3 leading-relaxed pl-13">
                <p>We may suspend or terminate your account if you violate these terms. You may delete your account at any time through your Account Settings. Upon termination, your data will be deleted within 30 days.</p>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-[#2E7D32]" />
                Questions?
              </h2>
              <p className="text-gray-600">
                Contact us at:{' '}
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
