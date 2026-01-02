import React from 'react';
import { Link } from 'react-router-dom';
import { Music2, ArrowLeft, Shield, Lock, Eye, Database, CheckCircle, AlertCircle } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
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
              <Shield className="text-indigo-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
              <p className="text-slate-500 text-sm mt-1">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none space-y-8">
            <section>
              <p className="text-slate-700 leading-relaxed text-lg">
                At TourCommand, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
                and safeguard your information when you use our tour management platform. Please read this privacy policy carefully. 
                If you do not agree with the terms of this privacy policy, please do not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Database size={24} className="text-indigo-600" />
                1. Information We Collect
              </h2>
              
              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">1.1 Information You Provide</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li><strong>Account Information:</strong> Name, email address, password, and role (Artist, Manager, or Operator)</li>
                <li><strong>Tour Data:</strong> Tour names, dates, venues, shows, financial information, and routing details</li>
                <li><strong>Venue Information:</strong> Venue names, locations, capacities, and contact information</li>
                <li><strong>Vendor Data:</strong> Vendor names, contact information, roles, and compliance documentation</li>
                <li><strong>Payment Information:</strong> Billing details processed through secure third-party payment processors</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">1.2 Automatically Collected Information</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                When you use TourCommand, we automatically collect certain information, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li><strong>Usage Data:</strong> How you interact with the Service, features used, and time spent</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
                <li><strong>Log Data:</strong> Server logs, error reports, and performance metrics</li>
                <li><strong>Cookies and Tracking:</strong> We use cookies and similar technologies to enhance your experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Eye size={24} className="text-indigo-600" />
                2. How We Use Your Information
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li>Provide, maintain, and improve the Service</li>
                <li>Process transactions and send related information, including confirmations and invoices</li>
                <li>Send technical notices, updates, security alerts, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze trends, usage, and activities in connection with the Service</li>
                <li>Detect, prevent, and address technical issues and fraudulent activity</li>
                <li>Personalize and improve your experience with the Service</li>
                <li>Send you marketing communications (with your consent, where required by law)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Lock size={24} className="text-indigo-600" />
                3. How We Share Your Information
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li><strong>Service Providers:</strong> We may share information with third-party service providers who perform services on our behalf (e.g., hosting, payment processing, analytics)</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid requests by public authorities</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred</li>
                <li><strong>With Your Consent:</strong> We may share information with your explicit consent</li>
                <li><strong>Aggregated Data:</strong> We may share aggregated, anonymized data that cannot identify you individually</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Security</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Secure hosting infrastructure with industry-standard protections</li>
                <li>Employee training on data protection and privacy</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">
                However, no method of transmission over the Internet or electronic storage is 100% secure. 
                While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Retention</h2>
              <p className="text-slate-700 leading-relaxed">
                We retain your personal information for as long as necessary to provide the Service and fulfill the purposes described in this Privacy Policy, 
                unless a longer retention period is required or permitted by law. When you delete your account, we will delete or anonymize your personal information, 
                except where we are required to retain it for legal, regulatory, or business purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Your Rights and Choices</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Objection:</strong> Object to certain processing of your information</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">
                To exercise these rights, please contact us at support@tourcommand.com. We will respond to your request within a reasonable timeframe.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Cookies and Tracking Technologies</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to track activity on our Service and hold certain information. 
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, 
                you may not be able to use some portions of our Service.
              </p>
              <p className="text-slate-700 leading-relaxed">
                We use cookies for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li>Authentication and session management</li>
                <li>Remembering your preferences and settings</li>
                <li>Analyzing usage patterns and improving the Service</li>
                <li>Providing personalized content and features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Children's Privacy</h2>
              <p className="text-slate-700 leading-relaxed">
                TourCommand is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. 
                If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. 
                If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. International Data Transfers</h2>
              <p className="text-slate-700 leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence. 
                These countries may have data protection laws that differ from those in your country. 
                By using the Service, you consent to the transfer of your information to these countries.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-slate-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page 
                and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes. 
                Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Contact Us</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-slate-700 font-medium">TourCommand Privacy Team</p>
                <p className="text-slate-600">Email: privacy@tourcommand.com</p>
                <p className="text-slate-600">Support: support@tourcommand.com</p>
              </div>
            </section>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mt-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-indigo-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-semibold text-indigo-900 mb-1">
                    Your privacy is important to us. We are committed to protecting your personal information and being transparent about how we use it.
                  </p>
                  <p className="text-xs text-indigo-700 mt-2">
                    By using TourCommand, you acknowledge that you have read and understood this Privacy Policy.
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
            I Understand - Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

