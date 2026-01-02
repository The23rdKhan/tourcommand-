import React, { useEffect } from 'react';
import { useTour } from '../context/TourContext';
import FinancialCard from './FinancialCard';
import { ShowStatus } from '../types';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertTriangle, Lock, Users, Calendar, Music2, TrendingUp, MapPin } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

const Dashboard: React.FC = () => {
  const { tours, user } = useTour();
  
  useEffect(() => {
    trackEvent('nav_dashboard', { userRole: user?.role });
  }, [user]);
  
  // Aggregate data logic remains similar but usage changes based on role
  let totalRevenue = 0;
  let totalExpenses = 0;
  let activeTourCount = 0;
  
  // For Managers: Aggregate by Artist
  const artistStats: Record<string, { revenue: number, shows: number }> = {};
  
  tours.forEach(tour => {
    activeTourCount++;
    if (!artistStats[tour.artist]) artistStats[tour.artist] = { revenue: 0, shows: 0 };

    tour.shows.forEach(show => {
       if (show.status === ShowStatus.CONFIRMED) {
         const expenses = (Object.values(show.financials.expenses) as number[]).reduce((a, b) => a + b, 0);
         const revenue = show.financials.guarantee + (show.financials.ticketPrice * show.financials.soldCount) + show.financials.merchSales;
         totalRevenue += revenue;
         totalExpenses += expenses;
         artistStats[tour.artist].revenue += revenue;
         artistStats[tour.artist].shows += 1;
       }
    });
  });

  const netProfit = totalRevenue - totalExpenses;
  
  // Shared: Upcoming Shows
  const upcomingShows = tours
    .flatMap(t => t.shows.map(s => ({ ...s, tourName: t.name, tourId: t.id, artist: t.artist })))
    .filter(s => new Date(s.date) >= new Date())
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  // Shared: Action Items
  const actionItems = tours
    .flatMap(t => t.shows.map(s => ({ ...s, tourName: t.name, tourId: t.id, artist: t.artist })))
    .filter(s => s.status === ShowStatus.HOLD)
    .slice(0, 3);

  // Calculate show counts for progress
  const getShowProgress = (tour: typeof tours[0]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pastShows = tour.shows.filter(s => new Date(s.date) < today).length;
    const futureShows = tour.shows.filter(s => new Date(s.date) >= today).length;
    const totalShows = tour.shows.length;
    const progressPercent = totalShows > 0 ? Math.round((pastShows / totalShows) * 100) : 0;
    return { pastShows, futureShows, totalShows, progressPercent };
  };

  // --- PERSONA: ARTIST VIEW ---
  if (user?.role === 'Artist') {
      // Empty state for artists with no tours
      if (tours.length === 0) {
        return (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome, {user?.name.split(' ')[0]}!</h1>
              <p className="text-slate-400">Get started by creating your first tour.</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar size={32} className="text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Tours Yet</h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">Create your first tour to start tracking shows, finances, and logistics all in one place.</p>
              <Link to="/app/tours" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                Create Your First Tour <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        );
      }

      const activeTour = tours[0];
      const progress = getShowProgress(activeTour);

      return (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name.split(' ')[0]}!</h1>
            <p className="text-slate-400">
              {netProfit > 0 
                ? <>Your tour is generating <span className="text-emerald-400 font-medium">${netProfit.toLocaleString()}</span> in net profit.</>
                : 'Track your tour progress and financials here.'
              }
            </p>
            {user?.tier === 'Free' && (
                <div className="mt-4 p-3 bg-indigo-600/10 border border-indigo-600/20 rounded-lg inline-flex items-center gap-2 text-indigo-300 text-sm">
                    <span>Unlock <strong>route cost tracking</strong> and unlimited tours.</span>
                    <Link to="/app/settings" className="font-bold hover:underline">Upgrade to Pro</Link>
                </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FinancialCard title="Tour Revenue" amount={totalRevenue} type="revenue" />
            <FinancialCard title="Net Profit" amount={netProfit} type="profit" subtitle="Revenue minus expenses" />
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                 <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wide">Next Show</h3>
                 {upcomingShows[0] ? (
                     <div>
                         <div className="text-lg font-bold text-white mt-1">{upcomingShows[0].city}</div>
                         <div className="text-sm text-slate-500">{upcomingShows[0].venue} • {new Date(upcomingShows[0].date).toLocaleDateString(undefined, {weekday:'short', month:'short', day:'numeric'})}</div>
                     </div>
                 ) : (
                     <div className="text-slate-500 text-sm mt-2">No upcoming shows scheduled.</div>
                 )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                 <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Your Active Tour</h3>
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                         <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-white text-lg">{activeTour.name}</h4>
                                <p className="text-slate-400 text-sm">{new Date(activeTour.startDate).toLocaleDateString()} - {new Date(activeTour.endDate).toLocaleDateString()}</p>
                            </div>
                            <Link to={`/app/tours/${activeTour.id}`} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Manage Tour</Link>
                         </div>
                         {progress.totalShows > 0 ? (
                           <>
                             <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                 <div className="bg-emerald-500 h-full transition-all" style={{width: `${progress.progressPercent}%`}}></div>
                             </div>
                             <div className="flex justify-between text-xs text-slate-500 mt-2">
                                 <span>{progress.pastShows} shows completed</span>
                                 <span>{progress.futureShows} shows remaining</span>
                             </div>
                           </>
                         ) : (
                           <p className="text-slate-500 text-sm">No shows added yet. <Link to={`/app/tours/${activeTour.id}`} className="text-indigo-400 hover:underline">Add your first show</Link></p>
                         )}
                    </div>
                </div>
            </div>
            <div className="lg:col-span-1">
                 <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Upcoming Shows</h3>
                    <div className="space-y-4">
                        {upcomingShows.slice(0,4).map(show => (
                             <div key={show.id} className="flex items-center gap-3 pb-3 border-b border-slate-700 last:border-0 last:pb-0">
                                 <div className="bg-slate-700 w-12 text-center rounded py-1">
                                     <div className="text-[10px] uppercase text-slate-400">{new Date(show.date).toLocaleString('default', {month:'short'})}</div>
                                     <div className="font-bold text-white text-sm">{new Date(show.date).getDate()}</div>
                                 </div>
                                 <div>
                                     <div className="text-white text-sm font-medium">{show.city}</div>
                                     <div className="text-xs text-slate-500">{show.venue}</div>
                                 </div>
                             </div>
                        ))}
                    </div>
                 </div>
            </div>
          </div>
        </div>
      );
  }

  // --- PERSONA: MANAGER VIEW ---
  if (user?.role === 'Manager') {
      return (
        <div className="space-y-8 animate-fade-in">
           <div>
            <h1 className="text-3xl font-bold text-white mb-2">Roster Overview</h1>
            <p className="text-slate-400">You have <span className="text-white font-bold">{actionItems.length} items</span> needing attention across your roster.</p>
             {user?.tier === 'Free' && (
                <div className="mt-4 p-3 bg-indigo-600/10 border border-indigo-600/20 rounded-lg inline-flex items-center gap-2 text-indigo-300 text-sm">
                    <span>Manage multiple artists? <strong>Unlock unlimited tours</strong> and PDF reports.</span>
                    <Link to="/app/settings" className="font-bold hover:underline">Upgrade to Pro</Link>
                </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                 <div className="flex items-center gap-2 mb-2">
                     <Users size={16} className="text-indigo-400" />
                     <h3 className="text-slate-400 text-sm font-medium uppercase">Total Revenue (Roster)</h3>
                 </div>
                 <div className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
             </div>
             <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                 <div className="flex items-center gap-2 mb-2">
                     <AlertTriangle size={16} className="text-amber-400" />
                     <h3 className="text-slate-400 text-sm font-medium uppercase">Pending Contracts</h3>
                 </div>
                 <div className="text-2xl font-bold text-white">{actionItems.length}</div>
             </div>
             <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                 <div className="flex items-center gap-2 mb-2">
                     <Calendar size={16} className="text-emerald-400" />
                     <h3 className="text-slate-400 text-sm font-medium uppercase">Active Tours</h3>
                 </div>
                 <div className="text-2xl font-bold text-white">{activeTourCount}</div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                 <h3 className="text-lg font-semibold text-white mb-4">Artist Performance</h3>
                 <div className="space-y-4">
                     {Object.entries(artistStats).map(([artist, stats]) => (
                         <div key={artist} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                             <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                                     {artist.substring(0,2).toUpperCase()}
                                 </div>
                                 <div>
                                     <div className="text-white font-medium">{artist}</div>
                                     <div className="text-xs text-slate-500">{stats.shows} shows</div>
                                 </div>
                             </div>
                             <div className="text-right">
                                 <div className="text-white font-bold">${stats.revenue.toLocaleString()}</div>
                                 <div className="text-xs text-emerald-400">Revenue</div>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
             
             <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                 <h3 className="text-lg font-semibold text-white mb-4">Urgent Action Items</h3>
                 <div className="space-y-3">
                     {actionItems.length > 0 ? actionItems.map(show => (
                         <Link key={show.id} to={`/app/tours/${show.tourId}/shows/${show.id}`} className="block p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-colors">
                             <div className="flex justify-between">
                                 <span className="text-amber-200 text-sm font-medium">{show.artist}</span>
                                 <span className="text-amber-400 text-xs font-bold uppercase">{show.status}</span>
                             </div>
                             <div className="text-white font-medium mt-1">Confirm {show.venue}</div>
                             <div className="text-xs text-slate-400">{new Date(show.date).toLocaleDateString()} • {show.city}</div>
                         </Link>
                     )) : (
                         <div className="text-slate-500 text-center py-4">No urgent items. Great job!</div>
                     )}
                 </div>
             </div>
          </div>
        </div>
      );
  }

  // --- PERSONA: OPERATOR VIEW ---
  // Default fall-through for Operator or others
  const confirmedShows = tours.flatMap(t => t.shows).filter(s => s.status === ShowStatus.CONFIRMED).length;
  const holdShows = tours.flatMap(t => t.shows).filter(s => s.status === ShowStatus.HOLD).length;
  const draftShows = tours.flatMap(t => t.shows).filter(s => s.status === ShowStatus.DRAFT).length;
  const totalShows = tours.flatMap(t => t.shows).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Venue & Event Pipeline</h1>
        <p className="text-slate-400">Overview of booking activity and venue utilization.</p>
        {user?.tier === 'Free' && (
            <div className="mt-4 p-3 bg-indigo-600/10 border border-indigo-600/20 rounded-lg inline-flex items-center gap-2 text-indigo-300 text-sm">
                <span>Manage multiple venues? <strong>Upgrade to Pro</strong> for advanced features.</span>
                <Link to="/app/settings" className="font-bold hover:underline">View Plans</Link>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <h3 className="text-slate-400 text-xs uppercase font-bold mb-1">Confirmed Shows</h3>
            <div className="text-2xl font-bold text-emerald-400">{confirmedShows}</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <h3 className="text-slate-400 text-xs uppercase font-bold mb-1">On Hold</h3>
            <div className="text-2xl font-bold text-amber-400">{holdShows}</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
             <h3 className="text-slate-400 text-xs uppercase font-bold mb-1">Draft Shows</h3>
             <div className="text-2xl font-bold text-white">{draftShows}</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
             <h3 className="text-slate-400 text-xs uppercase font-bold mb-1">Total Shows</h3>
             <div className="text-2xl font-bold text-white">{totalShows}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
               <h3 className="text-lg font-semibold text-white mb-4">Recent Bookings</h3>
               <div className="space-y-4">
                   {upcomingShows.slice(0, 5).map(show => (
                       <Link key={show.id} to={`/app/tours/${show.tourId}/shows/${show.id}`} className="flex items-center justify-between p-3 hover:bg-slate-700/50 rounded transition-colors">
                           <div className="flex items-center gap-3">
                               <div className="bg-slate-700 w-10 h-10 flex items-center justify-center rounded text-slate-300">
                                   <Music2 size={18} />
                               </div>
                               <div>
                                   <div className="text-white font-medium">{show.artist}</div>
                                   <div className="text-xs text-slate-500">{show.venue}</div>
                               </div>
                           </div>
                           <div className="text-right">
                               <div className="text-slate-300 text-sm">{new Date(show.date).toLocaleDateString()}</div>
                               <div className={`text-xs font-bold uppercase ${show.status === ShowStatus.CONFIRMED ? 'text-emerald-500' : 'text-amber-500'}`}>{show.status}</div>
                           </div>
                       </Link>
                   ))}
               </div>
          </div>
          
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 relative overflow-hidden">
               <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-white">Venue Utilization</h3>
                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">Last 30 Days</span>
               </div>
               {/* Mock Chart for Operators */}
               <div className="flex items-end gap-2 h-48 w-full px-2">
                   {[60, 40, 80, 45, 90, 30, 70, 50, 85, 60, 75, 50].map((h, i) => (
                       <div key={i} className="flex-1 bg-indigo-500/20 rounded-t relative group hover:bg-indigo-500/30 transition-colors">
                            <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t" style={{height: `${h}%`}}></div>
                       </div>
                   ))}
               </div>
               <div className="mt-4 flex gap-4 text-xs text-slate-400 justify-center">
                   <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Occupancy</div>
                   <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-600"></div> Vacancy</div>
               </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;