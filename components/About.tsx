import React from 'react';
import { Link } from 'react-router-dom';
import { MarketingHeader, MarketingFooter } from './Marketing';
import { Music2, Target, Zap, Shield, ArrowRight, CheckCircle, Users, Building2, Calendar } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      <MarketingHeader />
      
      <div className="container mx-auto px-6 py-20 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
              <Music2 className="text-indigo-600" size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              About TourCommand
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Professional tour management for artists, managers, and venues. Built to simplify the complex world of touring.
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Target className="text-indigo-600" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Our Mission</h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                Touring is complex. Managing multiple shows, tracking finances, coordinating crew, and optimizing routes shouldn't require a team of specialists. TourCommand exists to make professional tour management accessible to everyone.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                We believe in data-driven decisions. Instead of guessing your profit margins or manually calculating route costs, TourCommand gives you real-time insights that help you make better decisions, faster.
              </p>
            </div>
          </div>

          {/* Product Story */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Zap className="text-emerald-600" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Built for the Road</h2>
            </div>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              TourCommand was designed from the ground up for the touring industry. We understand the unique challenges of managing tours, whether you're a solo artist, a tour manager handling multiple acts, or a venue operator booking shows.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Music2 className="text-indigo-600" size={20} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">For Artists</h3>
                <p className="text-sm text-slate-600">
                  Track your tour progress, manage finances, and stay organized on the road.
                </p>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-emerald-600" size={20} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">For Managers</h3>
                <p className="text-sm text-slate-600">
                  Oversee multiple artists, compare performance, and manage your entire roster.
                </p>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="text-amber-600" size={20} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">For Operators</h3>
                <p className="text-sm text-slate-600">
                  Manage your venue pipeline, track bookings, and optimize utilization.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                <Shield className="text-rose-600" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Our Values</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="text-indigo-600" size={20} />
                  Simple & Transparent
                </h3>
                <p className="text-slate-600">
                  No hidden fees, no complicated pricing tiers. What you see is what you get. Start free, upgrade when you need more.
                </p>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="text-indigo-600" size={20} />
                  Data-Driven
                </h3>
                <p className="text-slate-600">
                  Make decisions based on real numbers, not guesswork. Track every dollar, optimize every route, maximize every opportunity.
                </p>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="text-indigo-600" size={20} />
                  User-Focused
                </h3>
                <p className="text-slate-600">
                  Built by people who understand touring. Every feature is designed to solve real problems faced by artists, managers, and venues.
                </p>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="text-indigo-600" size={20} />
                  Always Improving
                </h3>
                <p className="text-slate-600">
                  We're constantly adding new features based on user feedback. Your success is our success.
                </p>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">What Makes Us Different</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                  <Calendar className="text-indigo-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Unified Platform</h3>
                  <p className="text-slate-600">
                    Everything you need in one place: tours, shows, finances, venues, vendors, and analytics. No more switching between spreadsheets and apps.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                  <Zap className="text-emerald-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Real-Time Insights</h3>
                  <p className="text-slate-600">
                    Know your break-even point before you confirm a show. Track profit margins in real-time. Make data-driven decisions instantly.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="text-amber-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Role-Based Experience</h3>
                  <p className="text-slate-600">
                    Customized dashboards and workflows for Artists, Managers, and Operators. See what matters most to your role.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center shrink-0">
                  <Shield className="text-rose-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Secure & Reliable</h3>
                  <p className="text-slate-600">
                    Your data is encrypted, backed up, and secure. Built on enterprise-grade infrastructure you can trust.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join artists, managers, and venues who are already using TourCommand to streamline their touring operations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Get Started Free
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/features"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all"
              >
                View Features
              </Link>
            </div>
          </div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  );
};

