import React from 'react';
import { Link } from 'react-router-dom';
import { Music2, ArrowLeft, FileText, Shield, AlertCircle, CheckCircle } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Music2 size={24} />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">TourCommand</span>
          </Link>
          <Link 
            to="/signup" 
            className="px-5 py-2.5 text-sm font-medium bg-slate-900 text-white rounded-full hover:bg-indigo-600 transition-all"
          >
            Sign up
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <Link 
          to="/signup" 
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-8 font-medium"
        >
          <ArrowLeft size={18} />
          Back to Sign Up
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <FileText className="text-indigo-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Terms of Service</h1>
              <p className="text-slate-500 text-sm mt-1">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Shield size={24} className="text-indigo-600" />
                1. Acceptance of Terms
              </h2>
              <p className="text-slate-700 leading-relaxed">
                By accessing and using TourCommand ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Use License</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Permission is granted to temporarily use TourCommand for personal and commercial tour management purposes. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li>Modify or copy the materials or software</li>
                <li>Use the materials for any commercial purpose or for any public display without explicit permission</li>
                <li>Attempt to reverse engineer, decompile, or disassemble any software contained in TourCommand</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Account Registration</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                To access certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your registration information to keep it accurate, current, and complete</li>
                <li>Maintain the security of your password and identification</li>
                <li>Accept all responsibility for activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Subscription and Payment</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                TourCommand offers both free and paid subscription tiers. For paid subscriptions:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li>Subscription fees are billed in advance on a monthly or annual basis</li>
                <li>All fees are non-refundable except as required by law</li>
                <li>We reserve the right to change our pricing with 30 days notice</li>
                <li>Your subscription will automatically renew unless cancelled before the renewal date</li>
                <li>You may cancel your subscription at any time, and cancellation will take effect at the end of the current billing period</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. User Content and Data</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                You retain ownership of all data and content you upload to TourCommand. By using the Service, you grant us:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li>A license to store, process, and display your content solely for the purpose of providing the Service</li>
                <li>Permission to use aggregated, anonymized data for service improvement and analytics</li>
                <li>You are solely responsible for the accuracy and legality of all content you upload</li>
                <li>We reserve the right to remove any content that violates these terms or applicable laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <AlertCircle size={24} className="text-amber-600" />
                6. Prohibited Uses
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                You may not use TourCommand:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
                <li>To impersonate or attempt to impersonate the company, a company employee, another user, or any other person or entity</li>
                <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Service Availability</h2>
              <p className="text-slate-700 leading-relaxed">
                We strive to maintain high availability of the Service but do not guarantee uninterrupted access. 
                We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time with or without notice. 
                We shall not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-slate-700 leading-relaxed">
                To the fullest extent permitted by applicable law, TourCommand shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, 
                use, goodwill, or other intangible losses resulting from your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Indemnification</h2>
              <p className="text-slate-700 leading-relaxed">
                You agree to defend, indemnify, and hold harmless TourCommand and its officers, directors, employees, and agents from and against 
                any claims, liabilities, damages, losses, and expenses, including without limitation reasonable attorney's fees and costs, 
                arising out of or in any way connected with your access to or use of the Service, your violation of these Terms, or your violation 
                of any third party right, including without limitation any intellectual property right.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Termination</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, 
                including without limitation if you breach the Terms. Upon termination:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li>Your right to use the Service will immediately cease</li>
                <li>We may delete your account and all associated data after a reasonable retention period</li>
                <li>You may export your data before termination if you wish to retain it</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Changes to Terms</h2>
              <p className="text-slate-700 leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, 
                we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be 
                determined at our sole discretion. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Governing Law</h2>
              <p className="text-slate-700 leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. 
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Contact Information</h2>
              <p className="text-slate-700 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-slate-50 p-4 rounded-lg mt-4">
                <p className="text-slate-700 font-medium">TourCommand Support</p>
                <p className="text-slate-600">Email: support@tourcommand.com</p>
              </div>
            </section>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mt-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-indigo-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-semibold text-indigo-900 mb-1">By using TourCommand, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
                  <p className="text-xs text-indigo-700 mt-2">
                    If you do not agree to these terms, please do not use our Service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link 
            to="/signup" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all"
          >
            I Agree - Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

