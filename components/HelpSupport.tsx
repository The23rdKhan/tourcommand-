import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MarketingHeader, MarketingFooter } from './Marketing';
import { Mail, HelpCircle, FileText, ArrowRight, ChevronDown, ChevronUp, Lock, DollarSign, Calendar, Users, Download } from 'lucide-react';

const FAQItem: React.FC<{ question: string; answer: string; id: string }> = ({ question, answer, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const questionId = `faq-question-${id}`;
  const answerId = `faq-answer-${id}`;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={answerId}
        id={questionId}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-900">{question}</span>
        {isOpen ? (
          <ChevronUp className="text-slate-400 shrink-0" size={20} />
        ) : (
          <ChevronDown className="text-slate-400 shrink-0" size={20} />
        )}
      </button>
      {isOpen && (
        <div id={answerId} role="region" aria-labelledby={questionId} className="px-6 pb-4 text-slate-600 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

export const HelpSupport: React.FC = () => {
  const faqs = [
    {
      id: 'create-tour',
      question: "How do I create my first tour?",
      answer: "After signing up and completing onboarding, go to the Tours page and click 'Create Tour'. Fill in the tour details including name, artist, dates, and region. You can add shows to your tour from the tour detail page."
    },
    {
      id: 'tier-difference',
      question: "What's the difference between Free and Pro tiers?",
      answer: "The Free tier includes 1 active tour, route distance tracking, CSV export, and basic venue/vendor management. Pro tier ($29/month) includes unlimited tours, PDF reports, route cost tracking, document uploads, and shareable tour links. See our Pricing page for full details."
    },
    {
      id: 'export-data',
      question: "How do I export my tour data?",
      answer: "Go to any tour detail page and click the 'Export Report' button. Free tier users can export CSV files. Pro and Agency tier users can export both CSV and PDF reports with financial summaries and show details."
    },
    {
      id: 'change-role',
      question: "Can I change my role after signup?",
      answer: "Yes! Go to Settings → Profile tab and select a different role from the dropdown. You'll see a warning before confirming the change. Your role determines which dashboard view and features you see."
    },
    {
      id: 'reset-password',
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password?' on the login page, enter your email, and we'll send you a reset link. Click the link in the email to set a new password. The link expires after 1 hour."
    },
    {
      id: 'add-vendors',
      question: "How do I add vendors and crew members?",
      answer: "Go to the Crew & Vendors page and click 'Onboard Vendor'. Fill in the vendor details including name, role, contact information, and any permit requirements. You can then assign vendors to specific shows."
    },
    {
      id: 'edit-tour',
      question: "Can I edit tour details after creation?",
      answer: "Yes! On any tour detail page, click 'Edit Tour Details' to modify the tour name, dates, region, manager, agent, or currency. Changes are saved immediately."
    },
    {
      id: 'tier-limits',
      question: "What happens if I exceed my tier limits?",
      answer: "Free tier users are limited to 1 active tour. If you try to create another, you'll see an upgrade prompt. Pro tier includes unlimited tours. You can upgrade anytime from Settings → Subscription."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      <MarketingHeader />
      
      <div className="container mx-auto px-6 py-20 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
              <HelpCircle className="text-indigo-600" size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Help & Support
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We're here to help. Find answers to common questions or get in touch with our support team.
            </p>
          </div>

          {/* Contact Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 mb-12">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                <Mail className="text-indigo-600" size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Contact Support</h2>
                <p className="text-slate-600 mb-4">
                  Have a question that's not answered here? Our support team is ready to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:support@tourcommand.app"
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                  >
                    <Mail size={18} />
                    Email Support
                  </a>
                  <p className="text-sm text-slate-500 flex items-center">
                    We typically respond within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <Link
              to="/forgot-password"
              className="p-6 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
            >
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                <Lock className="text-indigo-600" size={20} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Reset Password</h3>
              <p className="text-sm text-slate-600">Forgot your password? Reset it here.</p>
            </Link>
            <Link
              to="/pricing"
              className="p-6 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
            >
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                <DollarSign className="text-indigo-600" size={20} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">View Pricing</h3>
              <p className="text-sm text-slate-600">See our plans and features.</p>
            </Link>
            <Link
              to="/features"
              className="p-6 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
            >
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                <FileText className="text-indigo-600" size={20} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">View Features</h3>
              <p className="text-sm text-slate-600">Learn about all our features.</p>
            </Link>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <FAQItem key={faq.id} id={faq.id} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>

          {/* Documentation Links */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Documentation & Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/features"
                className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group"
              >
                <FileText className="text-indigo-600 group-hover:text-indigo-700" size={20} />
                <div>
                  <div className="font-semibold text-slate-900">Features Guide</div>
                  <div className="text-sm text-slate-600">Learn about all features</div>
                </div>
                <ArrowRight className="ml-auto text-slate-400 group-hover:text-indigo-600" size={18} />
              </Link>
              <Link
                to="/pricing"
                className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group"
              >
                <DollarSign className="text-indigo-600 group-hover:text-indigo-700" size={20} />
                <div>
                  <div className="font-semibold text-slate-900">Pricing Plans</div>
                  <div className="text-sm text-slate-600">Compare tiers and features</div>
                </div>
                <ArrowRight className="ml-auto text-slate-400 group-hover:text-indigo-600" size={18} />
              </Link>
              <Link
                to="/terms"
                className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group"
              >
                <FileText className="text-indigo-600 group-hover:text-indigo-700" size={20} />
                <div>
                  <div className="font-semibold text-slate-900">Terms of Service</div>
                  <div className="text-sm text-slate-600">Read our terms and conditions</div>
                </div>
                <ArrowRight className="ml-auto text-slate-400 group-hover:text-indigo-600" size={18} />
              </Link>
              <Link
                to="/privacy"
                className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group"
              >
                <FileText className="text-indigo-600 group-hover:text-indigo-700" size={20} />
                <div>
                  <div className="font-semibold text-slate-900">Privacy Policy</div>
                  <div className="text-sm text-slate-600">How we protect your data</div>
                </div>
                <ArrowRight className="ml-auto text-slate-400 group-hover:text-indigo-600" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  );
};

