import React, { useState } from 'react';
import { useTour } from '../context/TourContext';
import { Calendar, ChevronRight, Plus, Crown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CreateTourWizard from './CreateTourWizard';

const TourList: React.FC = () => {
  const { tours, user } = useTour();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateClick = () => {
      // Upsell Check: Free tier limited to 1 tour
      if (user?.tier === 'Free' && tours.length >= 1) {
          const confirmUpgrade = window.confirm("The Free plan is limited to 1 active tour. Upgrade to Pro for unlimited tours?");
          if (confirmUpgrade) {
              navigate('/app/settings'); // Direct to billing
          }
      } else {
          setIsWizardOpen(true);
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Your Tours</h2>
        <button 
            onClick={handleCreateClick}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-lg shadow-indigo-900/20"
        >
            <Plus size={16} /> Create Tour
        </button>
      </div>

      {isWizardOpen && <CreateTourWizard onClose={() => setIsWizardOpen(false)} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map(tour => (
            <Link key={tour.id} to={`/app/tours/${tour.id}`} className="group bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center">
                        <Calendar size={20} />
                    </div>
                    <span className="text-xs font-medium bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                        {tour.shows.length} Shows
                    </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{tour.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{tour.region} • {new Date(tour.startDate).getFullYear()}</p>
                
                <div className="pt-4 border-t border-slate-700 flex justify-between items-center text-sm text-slate-500">
                    <span>{tour.artist}</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">Manage <ChevronRight size={14} /></span>
                </div>
            </Link>
        ))}
        
        {/* Upsell Card for Free Users who might see empty slots */}
        {user?.tier === 'Free' && tours.length < 3 && (
            <div onClick={() => navigate('/app/settings')} className="group border border-slate-700 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800/50 transition-colors">
                <div className="w-12 h-12 bg-indigo-900/50 text-indigo-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Crown size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Upgrade to Pro</h3>
                <p className="text-slate-400 text-sm mb-4 max-w-[200px]">Unlock unlimited tours, advanced analytics, and branded reports.</p>
                <span className="text-indigo-400 text-sm font-bold group-hover:underline">View Plans</span>
            </div>
        )}
      </div>
    </div>
  );
};

export default TourList;