import React from 'react';
import { Link } from 'react-router-dom';
import { Music2, TrendingUp, Calendar, DollarSign, CheckCircle, ArrowRight, Star, BarChart3, PieChart, Users, Map, Briefcase, Building2, Bot, Sparkles, MessageSquare, Zap, Globe, Shield, Truck, FileText } from 'lucide-react';

const MarketingHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 transition-transform group-hover:scale-105">
            <Music2 size={24} />
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">TourCommand</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Home</Link>
          <Link to="/features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</Link>
          <Link to="/pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Pricing</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Log in</Link>
          <Link to="/signup" className="px-5 py-2.5 text-sm font-medium bg-slate-900 text-white rounded-full hover:bg-indigo-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">Sign up</Link>
        </div>
      </div>
    </header>
  );
};

const MarketingFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-950 py-12 border-t border-slate-900">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                    <Music2 size={16} />
                </div>
                <span className="text-lg font-bold text-slate-200">TourCommand</span>
            </div>
            
            <nav className="flex flex-wrap justify-center gap-8 text-sm font-medium text-slate-400">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <Link to="/features" className="hover:text-white transition-colors">Features</Link>
                <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                <Link to="/login" className="hover:text-white transition-colors">Login</Link>
                <Link to="/signup" className="hover:text-white transition-colors">Get Started</Link>
            </nav>
        </div>
        
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
            <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-center md:text-left">
                <span>&copy; {currentYear} TourCommand™. All rights reserved.</span>
                <span>TourCommand is a registered trademark of TourCommand, Inc.</span>
            </div>
            <div className="flex gap-6">
                <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 flex flex-col">
      <MarketingHeader />
      
      {/* --- HERO SECTION --- */}
      <section className="pt-24 pb-32 px-6 overflow-hidden">
        <div className="container mx-auto text-center max-w-5xl relative">
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-50 rounded-full blur-3xl -z-10 opacity-60"></div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wide mb-8 animate-fade-in">
            <Shield size={12} className="fill-indigo-700" /> New: Crew Management & Vendor Compliance
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1] animate-fade-in">
            Master your tour.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Automate the busy work.</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in delay-100">
            The first data-driven platform that connects your routing, your sales, your crew, and your wallet. Stop guessing your profit—start engineering it.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-200">
            <Link to="/signup" className="px-8 py-4 bg-indigo-600 text-white rounded-full font-semibold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 transform hover:-translate-y-1 flex items-center gap-2">
              Start Free Trial <ArrowRight size={20} />
            </Link>
            <Link to="/features" className="px-8 py-4 bg-white text-slate-700 rounded-full font-semibold text-lg hover:bg-slate-50 transition-all border border-slate-200 shadow-sm hover:shadow-md">
              See How It Works
            </Link>
          </div>
          
          {/* App Preview */}
          <div className="mt-24 relative mx-auto max-w-5xl animate-fade-in delay-300">
             <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 h-full w-full pointer-events-none"></div>
             <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 ring-1 ring-slate-900/5">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900">
                   <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                   </div>
                </div>
                <div className="p-6 grid grid-cols-3 gap-6 bg-slate-900 aspect-[16/9]">
                   <div className="hidden md:block col-span-1 bg-slate-800 rounded-lg p-4 space-y-3 opacity-50">
                      <div className="h-8 bg-slate-700 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                      <div className="mt-8 space-y-2">
                         <div className="h-10 bg-slate-700 rounded w-full"></div>
                         <div className="h-10 bg-slate-700/50 rounded w-full"></div>
                      </div>
                   </div>
                   <div className="col-span-3 md:col-span-2 space-y-6">
                      <div className="flex gap-4">
                         <div className="flex-1 bg-slate-800 p-4 rounded-lg border-l-4 border-emerald-500">
                            <div className="h-4 bg-slate-700 w-1/2 mb-2 rounded"></div>
                            <div className="h-8 bg-slate-600 w-3/4 rounded"></div>
                         </div>
                         <div className="flex-1 bg-slate-800 p-4 rounded-lg border-l-4 border-indigo-500">
                            <div className="h-4 bg-slate-700 w-1/2 mb-2 rounded"></div>
                            <div className="h-8 bg-slate-600 w-3/4 rounded"></div>
                         </div>
                      </div>
                      <div className="bg-slate-800 h-64 rounded-lg p-4 flex items-end justify-between gap-2">
                          {[40, 65, 45, 80, 55, 70, 90, 60].map((h, i) => (
                              <div key={i} className="w-full bg-indigo-500/20 rounded-t hover:bg-indigo-500 transition-colors" style={{ height: `${h}%` }}></div>
                          ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- NEW: USER JOURNEYS SECTION --- */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Tailored workflows for every role</h2>
                <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                    Whether you're on stage, backstage, or running the venue, TourCommand adapts to your specific needs.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Artist Persona */}
                <div className="group relative p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-200 transition-all hover:shadow-xl hover:-translate-y-1">
                    <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform">
                        <Music2 size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">The Artist</h3>
                    <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4">Focus: Logistics & Performance</div>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                        Forget the spreadsheets. Build your route visually, calculate gas costs automatically, and access your day sheets from your phone.
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle size={16} className="text-emerald-500"/> Smart Routing Engine</li>
                        <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle size={16} className="text-emerald-500"/> Automated Day Sheets</li>
                        <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle size={16} className="text-emerald-500"/> Mobile Itinerary</li>
                    </ul>
                </div>

                {/* Manager Persona */}
                <div className="group relative p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-200 transition-all hover:shadow-xl hover:-translate-y-1">
                    <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 transition-transform">
                        <Users size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">The Manager</h3>
                    <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-4">Focus: Financials & Strategy</div>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                        See the big picture. Track revenue, manage contracts, and onboard crew members efficiently.
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle size={16} className="text-emerald-500"/> Roster-wide P&L</li>
                        <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle size={16} className="text-emerald-500"/> Contract Tracking</li>
                        <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle size={16} className="text-emerald-500"/> <strong>New:</strong> Vendor Onboarding</li>
                    </ul>
                </div>

                {/* Operator Persona */}
                <div className="group relative p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-200 transition-all hover:shadow-xl hover:-translate-y-1">
                    <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-amber-600 group-hover:scale-110 transition-transform">
                        <Building2 size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">The Operator</h3>
                    <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-4">Focus: Pipeline & Utilization</div>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                        Fill your room. Manage holds, challenges, and confirmed dates in a unified calendar. Stop double-booking and start optimizing.
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle size={16} className="text-emerald-500"/> Venue Utilization Heatmaps</li>
                        <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle size={16} className="text-emerald-500"/> Hold/Challenge Pipeline</li>
                        <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle size={16} className="text-emerald-500"/> Multi-venue Calendar</li>
                    </ul>
                </div>
            </div>
        </div>
      </section>

      {/* --- NEW: DATA DRIVEN VALUE PROP SECTION --- */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1 space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wide">
                        <BarChart3 size={14} /> Data-Driven Decisions
                    </div>
                    <h2 className="text-4xl font-extrabold text-white leading-tight">
                        Stop guessing.<br />Start knowing.
                    </h2>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        Most tour "management" is just digital paper pushing. TourCommand is an intelligence engine. We use data to find you more money and save you time.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                            <Zap className="text-amber-400 mb-3" size={24} />
                            <h4 className="font-bold text-white mb-2">Predictive Logistics</h4>
                            <p className="text-sm text-slate-400">Our routing engine calculates drive times, impossible travel days, and gas costs instantly.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                            <PieChart className="text-emerald-400 mb-3" size={24} />
                            <h4 className="font-bold text-white mb-2">Real-Time P&L</h4>
                            <p className="text-sm text-slate-400">Know your break-even point before you confirm the date. Track net profit, not just gross revenue.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                            <Truck className="text-sky-400 mb-3" size={24} />
                            <h4 className="font-bold text-white mb-2">Crew Portal</h4>
                            <p className="text-sm text-slate-400">Centralized vendor database. Track contacts, roles, and permit requirements for every show.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                            <Shield className="text-rose-400 mb-3" size={24} />
                            <h4 className="font-bold text-white mb-2">Compliance Tracking</h4>
                            <p className="text-sm text-slate-400">Never miss a permit deadline. Track security, pyro, and insurance requirements.</p>
                        </div>
                    </div>
                </div>
                
                {/* Abstract Data Visualization Graphic */}
                <div className="flex-1 w-full flex items-center justify-center">
                    <div className="relative w-full max-w-md aspect-square">
                        <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-[80px]"></div>
                        <div className="relative z-10 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-200">Profit Forecast</h3>
                                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">+24% vs Last Tour</span>
                            </div>
                            <div className="space-y-4">
                                {/* Mock Charts */}
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-[70%]"></div>
                                </div>
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[55%]"></div>
                                </div>
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 w-[85%]"></div>
                                </div>
                            </div>
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="bg-slate-900 p-3 rounded-lg text-center">
                                    <div className="text-xs text-slate-500 uppercase">Est. Gas</div>
                                    <div className="text-xl font-bold text-white">$4,200</div>
                                </div>
                                <div className="bg-slate-900 p-3 rounded-lg text-center">
                                    <div className="text-xs text-slate-500 uppercase">Net Profit</div>
                                    <div className="text-xl font-bold text-emerald-400">$18,500</div>
                                </div>
                            </div>
                        </div>
                        {/* Floating Cards */}
                        <div className="absolute -right-4 top-10 bg-slate-800 border border-slate-700 p-3 rounded-xl shadow-xl z-20 animate-bounce delay-700">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                <span className="text-xs font-bold text-slate-200">Gas Alert: High Cost</span>
                            </div>
                        </div>
                        <div className="absolute -left-4 bottom-20 bg-slate-800 border border-slate-700 p-3 rounded-xl shadow-xl z-20 animate-bounce">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                <span className="text-xs font-bold text-slate-200">Security Vendor Added</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* AI Agent Feature Highlight (Existing) */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1 space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wide">
                        <Bot size={14} /> AI Action Agent
                    </div>
                    <h2 className="text-4xl font-extrabold text-slate-900">Talk to your tour. <br/>It talks back.</h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Don't click around. Just tell TourCommand what to do. Our new Agentic AI can build routes, calculate profits, and add shows to your calendar instantly.
                    </p>
                    
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Natural Language Commands</h4>
                                <p className="text-slate-600 text-sm">"Add a show in Austin next Friday for $500." Done.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Instant Profit Analysis</h4>
                                <p className="text-slate-600 text-sm">"How much profit if we sell 70% of tickets?" Calculated.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Chat UI Mockup */}
                <div className="flex-1 w-full max-w-md mx-auto">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                            <span className="text-xs text-slate-400 font-medium ml-2">TourCommand AI Agent</span>
                        </div>
                        <div className="p-6 space-y-4 bg-slate-50/50">
                            <div className="flex justify-end">
                                <div className="bg-indigo-600 text-white rounded-2xl rounded-br-sm px-4 py-2 text-sm max-w-[85%] shadow-sm">
                                    Add a show in Las Vegas on Oct 20th.
                                </div>
                            </div>
                            <div className="flex justify-start">
                                <div className="bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-2 text-sm max-w-[85%] shadow-sm">
                                    <div className="flex items-center gap-2 mb-1 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                                        <CheckCircle size={12} /> Action Executed
                                    </div>
                                    I've added a draft show at <strong>TBD Venue</strong> in <strong>Las Vegas, NV</strong> for Oct 20th.
                                    <div className="mt-2 text-xs text-slate-400 border-t border-slate-100 pt-2 flex items-center gap-1">
                                         <Map size={10} /> 4.5 hr drive from previous show
                                    </div>
                                </div>
                            </div>
                             <div className="flex justify-end">
                                <div className="bg-indigo-600 text-white rounded-2xl rounded-br-sm px-4 py-2 text-sm max-w-[85%] shadow-sm">
                                    What's the gas cost?
                                </div>
                            </div>
                             <div className="flex justify-start">
                                <div className="bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-2 text-sm max-w-[85%] shadow-sm flex items-center gap-2">
                                     <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div> Thinking...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>
      
      {/* Testimonial / Social Proof */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-6 text-center">
              <div className="flex justify-center gap-1 mb-6">
                  {[1,2,3,4,5].map(i => <Star key={i} className="fill-amber-400 text-amber-400" size={20} />)}
              </div>
              <h3 className="text-2xl font-medium text-slate-900 italic max-w-3xl mx-auto leading-relaxed mb-8">
                  "TourCommand changed how we tour. We went from losing money on random routing to profitable runs every single time. It's essential."
              </h3>
              <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                  </div>
                  <div className="text-left">
                      <div className="font-bold text-slate-900">Alex Rivera</div>
                      <div className="text-sm text-slate-500">Tour Manager, The Midnight Echo</div>
                  </div>
              </div>
          </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="container mx-auto px-6 text-center relative z-10">
              <h2 className="text-4xl font-bold mb-6">Ready to professionalize your touring?</h2>
              <p className="text-slate-300 mb-10 max-w-2xl mx-auto">Join thousands of artists and managers who are touring smarter today.</p>
              <Link to="/signup" className="px-10 py-5 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-indigo-50 transition-colors shadow-lg">
                  Get Started for Free
              </Link>
          </div>
      </section>

      <MarketingFooter />
    </div>
  );
};

export const Features: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      <MarketingHeader />
      <div className="container mx-auto px-6 py-20 flex-1">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 text-center mb-16 tracking-tight">Features built for the road</h1>
        
        <div className="space-y-32">
            
            {/* Feature Block 1: Routing (Artist) */}
            <div className="flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1 space-y-6">
                    <div className="inline-block p-3 rounded-lg bg-indigo-100 text-indigo-700 mb-2">
                        <Map size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">Adaptive Routing & Logistics</h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Routing a tour shouldn't feel like solving a puzzle. Our drag-and-drop timeline adapts to your needs, whether you're routing one band or twenty.
                    </p>
                    <ul className="space-y-4 pt-4">
                        <li className="flex items-center gap-3 text-slate-700 font-medium">
                            <CheckCircle className="text-indigo-600" size={20} /> 
                            <strong>Smart Routing:</strong> Automatic distance calculations, drive times, and gas cost estimates.
                        </li>
                        <li className="flex items-center gap-3 text-slate-700 font-medium">
                            <CheckCircle className="text-indigo-600" size={20} /> 
                            <strong>City Suggestions:</strong> AI-powered suggestions for profitable stops between major markets.
                        </li>
                        <li className="flex items-center gap-3 text-slate-700 font-medium">
                            <CheckCircle className="text-indigo-600" size={20} /> 
                            <strong>Conflict Detection:</strong> Instant alerts for impossible drives, double bookings, or venue restrictions.
                        </li>
                    </ul>
                </div>
                <div className="flex-1 bg-slate-900 h-80 rounded-2xl border border-slate-200 shadow-2xl shadow-indigo-200/50 flex items-center justify-center text-slate-500 relative overflow-hidden group">
                     {/* UI Abstract */}
                     <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
                     <div className="relative z-10 w-3/4 h-3/4 bg-slate-800 rounded-lg border border-slate-700 p-4 space-y-3 group-hover:-translate-y-2 transition-transform duration-500">
                        <div className="h-6 w-1/3 bg-slate-700 rounded mb-4"></div>
                        <div className="flex gap-2"><div className="w-8 h-8 rounded bg-indigo-500/20"></div><div className="h-8 flex-1 bg-slate-700 rounded"></div></div>
                        <div className="flex gap-2"><div className="w-8 h-8 rounded bg-indigo-500/20"></div><div className="h-8 flex-1 bg-slate-700 rounded"></div></div>
                        <div className="flex gap-2"><div className="w-8 h-8 rounded bg-indigo-500/20"></div><div className="h-8 flex-1 bg-slate-700 rounded"></div></div>
                     </div>
                </div>
            </div>

            {/* Feature Block 2: Financials (Manager/Artist) */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-16">
                <div className="flex-1 space-y-6">
                    <div className="inline-block p-3 rounded-lg bg-emerald-100 text-emerald-700 mb-2">
                        <DollarSign size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">Financial Command</h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Stop flying blind with spreadsheets. See projected vs actual revenue for guarantees, tickets, and merchandise in real-time.
                    </p>
                    <ul className="space-y-4 pt-4">
                        <li className="flex items-center gap-3 text-slate-700 font-medium">
                            <CheckCircle className="text-emerald-600" size={20} /> 
                            <strong>Real-time P&L:</strong> Know your break-even point instantly before you even confirm the show.
                        </li>
                        <li className="flex items-center gap-3 text-slate-700 font-medium">
                            <CheckCircle className="text-emerald-600" size={20} /> 
                            <strong>Deal Calculators:</strong> Built-in support for Door Splits, Guarantees, Versus deals, and Bonuses.
                        </li>
                        <li className="flex items-center gap-3 text-slate-700 font-medium">
                            <CheckCircle className="text-emerald-600" size={20} /> 
                            <strong>Roster Analytics:</strong> (Pro) Compare profitability across multiple artists to see who is performing best.
                        </li>
                    </ul>
                </div>
                <div className="flex-1 bg-slate-900 h-80 rounded-2xl border border-slate-200 shadow-2xl shadow-emerald-200/50 flex items-center justify-center text-slate-500 relative overflow-hidden group">
                     {/* UI Abstract */}
                     <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
                     <div className="relative z-10 w-3/4 h-3/4 bg-slate-800 rounded-lg border border-slate-700 p-4 flex items-end justify-around gap-2 group-hover:-translate-y-2 transition-transform duration-500">
                        <div className="w-full bg-emerald-500/20 rounded-t h-[40%]"></div>
                        <div className="w-full bg-emerald-500/40 rounded-t h-[60%]"></div>
                        <div className="w-full bg-emerald-500/60 rounded-t h-[80%]"></div>
                        <div className="w-full bg-emerald-500 rounded-t h-[50%]"></div>
                     </div>
                </div>
            </div>

            {/* Feature Block 3: Crew & Vendors - NEW */}
            <div className="flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1 space-y-6">
                    <div className="inline-block p-3 rounded-lg bg-rose-100 text-rose-700 mb-2">
                        <Users size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">Crew & Vendor Management</h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                         Manage your human resources as effectively as your finances. Onboard security, sound, and lighting teams and track their compliance.
                    </p>
                    <ul className="space-y-4 pt-4">
                        <li className="flex items-center gap-3 text-slate-700 font-medium">
                            <CheckCircle className="text-rose-600" size={20} /> 
                            <strong>Vendor Database:</strong> Centralize contacts for security, pyro, runners, and stylists.
                        </li>
                        <li className="flex items-center gap-3 text-slate-700 font-medium">
                            <CheckCircle className="text-rose-600" size={20} /> 
                            <strong>Compliance Tracking:</strong> Track permits, insurance certificates, and license requirements.
                        </li>
                        <li className="flex items-center gap-3 text-slate-700 font-medium">
                            <CheckCircle className="text-rose-600" size={20} /> 
                            <strong>Role Assignment:</strong> Assign specific POCs to tours and specific dates.
                        </li>
                    </ul>
                </div>
                <div className="flex-1 bg-slate-900 h-80 rounded-2xl border border-slate-200 shadow-2xl shadow-rose-200/50 flex items-center justify-center text-slate-500 relative overflow-hidden group">
                     {/* UI Abstract */}
                     <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
                     <div className="relative z-10 w-3/4 h-3/4 bg-slate-800 rounded-lg border border-slate-700 p-4 space-y-3 group-hover:-translate-y-2 transition-transform duration-500">
                        <div className="flex items-center gap-3 p-2 bg-slate-700/50 rounded-lg">
                            <div className="w-8 h-8 bg-rose-500/20 rounded-full flex items-center justify-center"><Shield size={14} className="text-rose-400"/></div>
                            <div className="flex-1"><div className="h-2 bg-slate-600 w-1/2 rounded"></div></div>
                            <div className="w-4 h-4 bg-emerald-500/20 rounded-full"></div>
                        </div>
                        <div className="flex items-center gap-3 p-2 bg-slate-700/50 rounded-lg">
                            <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center"><Zap size={14} className="text-amber-400"/></div>
                            <div className="flex-1"><div className="h-2 bg-slate-600 w-2/3 rounded"></div></div>
                            <div className="w-4 h-4 bg-amber-500/20 rounded-full border border-amber-500/50"></div>
                        </div>
                         <div className="flex items-center gap-3 p-2 bg-slate-700/50 rounded-lg">
                            <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center"><Truck size={14} className="text-purple-400"/></div>
                            <div className="flex-1"><div className="h-2 bg-slate-600 w-1/2 rounded"></div></div>
                            <div className="w-4 h-4 bg-emerald-500/20 rounded-full"></div>
                        </div>
                     </div>
                </div>
            </div>

            {/* Feature Block 4: Operations (Operator) */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-16">
                <div className="flex-1 space-y-6">
                    <div className="inline-block p-3 rounded-lg bg-amber-100 text-amber-700 mb-2">
                        <Building2 size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">Venue & Booking Operations</h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        For promoters and venue operators, manage your entire calendar from holds to settlement in one unified pipeline.
                    </p>
                    <ul className="space-y-4 pt-4">
                        <li className="flex items-center gap-3 text-slate-700 font-medium">
                            <CheckCircle className="text-amber-600" size={20} /> 
                            <strong>Pipeline View:</strong> Visualize Holds, Challenges, and Confirmed dates across all your venues.
                        </li>
                        <li className="flex items-center gap-3 text-slate-700 font-medium">
                            <CheckCircle className="text-amber-600" size={20} /> 
                            <strong>Utilization Tracking:</strong> Spot vacancy gaps in your calendar and fill them faster.
                        </li>
                        <li className="flex items-center gap-3 text-slate-700 font-medium">
                            <CheckCircle className="text-amber-600" size={20} /> 
                            <strong>Bulk Actions:</strong> (Pro) Send availabilities and hold requests to agents in bulk.
                        </li>
                    </ul>
                </div>
                <div className="flex-1 bg-slate-900 h-80 rounded-2xl border border-slate-200 shadow-2xl shadow-amber-200/50 flex items-center justify-center text-slate-500 relative overflow-hidden group">
                     {/* UI Abstract */}
                     <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
                     <div className="relative z-10 w-3/4 h-3/4 bg-slate-800 rounded-lg border border-slate-700 p-4 grid grid-cols-2 gap-2 group-hover:-translate-y-2 transition-transform duration-500">
                        <div className="bg-amber-500/10 rounded border border-amber-500/30"></div>
                        <div className="bg-slate-700/50 rounded"></div>
                        <div className="bg-slate-700/50 rounded"></div>
                        <div className="bg-emerald-500/10 rounded border border-emerald-500/30"></div>
                     </div>
                </div>
            </div>

        </div>
      </div>
      <MarketingFooter />
    </div>
  );
};

export const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      <MarketingHeader />
      <div className="container mx-auto px-6 py-20 flex-1">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 text-center mb-6 tracking-tight">Simple, transparent pricing</h1>
        <p className="text-xl text-slate-600 text-center max-w-2xl mx-auto mb-16">
          Start for free, upgrade when you need more power. No credit card required to start.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="border border-slate-200 rounded-2xl p-8 bg-slate-50 flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Free</h3>
            <p className="text-slate-600 mb-6 text-sm">For solo artists just getting started.</p>
            <div className="text-4xl font-extrabold text-slate-900 mb-6">$0<span className="text-lg font-normal text-slate-500">/mo</span></div>
            <Link to="/signup" className="w-full py-3 px-4 bg-white border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors mb-8 text-center">
              Start for Free
            </Link>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle className="text-emerald-500 shrink-0" size={18} />
                <span>1 Active Tour</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle className="text-emerald-500 shrink-0" size={18} />
                <span>Basic Routing</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle className="text-emerald-500 shrink-0" size={18} />
                <span>Day Sheets</span>
              </li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="border-2 border-indigo-600 rounded-2xl p-8 bg-white shadow-xl relative flex flex-col transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Most Popular</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Pro</h3>
            <p className="text-slate-600 mb-6 text-sm">For touring professionals and managers.</p>
            <div className="text-4xl font-extrabold text-slate-900 mb-6">$29<span className="text-lg font-normal text-slate-500">/mo</span></div>
            <Link to="/signup" className="w-full py-3 px-4 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-colors mb-8 text-center shadow-lg shadow-indigo-200">
              Get Started
            </Link>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle className="text-indigo-600 shrink-0" size={18} />
                <span>Unlimited Tours</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle className="text-indigo-600 shrink-0" size={18} />
                <span>Smart Routing Engine</span>
              </li>
               <li className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle className="text-indigo-600 shrink-0" size={18} />
                <span>Financial Forecasts</span>
              </li>
               <li className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle className="text-indigo-600 shrink-0" size={18} />
                <span>Vendor Compliance Tools</span>
              </li>
            </ul>
          </div>

          {/* Agency Plan */}
          <div className="border border-slate-200 rounded-2xl p-8 bg-slate-50 flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Agency</h3>
            <p className="text-slate-600 mb-6 text-sm">For booking agencies and large rosters.</p>
            <div className="text-4xl font-extrabold text-slate-900 mb-6">$99<span className="text-lg font-normal text-slate-500">/mo</span></div>
            <Link to="/signup" className="w-full py-3 px-4 bg-white border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors mb-8 text-center">
              Contact Sales
            </Link>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle className="text-emerald-500 shrink-0" size={18} />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle className="text-emerald-500 shrink-0" size={18} />
                <span>Multi-User Access</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle className="text-emerald-500 shrink-0" size={18} />
                <span>API Access</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle className="text-emerald-500 shrink-0" size={18} />
                <span>White-label Reports</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <MarketingFooter />
    </div>
  );
};