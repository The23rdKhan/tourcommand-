import React, { useState } from 'react';
import { useTour } from '../context/TourContext';
import { Tour } from '../types';
import { X, ArrowRight, ArrowLeft, Calendar, Globe, Music2, CheckCircle, User, Briefcase, DollarSign, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '../utils/analytics';

interface CreateTourWizardProps {
  onClose: () => void;
}

const STEPS = [
  { id: 1, title: 'Tour Basics', icon: Music2 },
  { id: 2, title: 'Timeline & Region', icon: Calendar },
  { id: 3, title: 'Review', icon: CheckCircle },
];

const CreateTourWizard: React.FC<CreateTourWizardProps> = ({ onClose }) => {
  const { addTour } = useTour();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    artist: '', 
    startDate: '',
    endDate: '',
    region: 'North America',
    tourManager: '',
    bookingAgent: '',
    currency: 'USD'
  });

  const handleNext = () => {
    if (step < STEPS.length) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    try {
      const newTour = await addTour({
        name: formData.name,
        artist: formData.artist,
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        endDate: formData.endDate || new Date().toISOString().split('T')[0],
        region: formData.region,
        shows: [], // Empty initially, shows are added separately
        tourManager: formData.tourManager,
        bookingAgent: formData.bookingAgent,
        currency: formData.currency
      });

      trackEvent('tour_created_wizard', { region: formData.region, currency: formData.currency });
      onClose();
      // Navigate to the new tour to add the first show immediately
      navigate(`/app/tours/${newTour.id}`);
    } catch (error) {
      console.error('Error creating tour:', error);
    }
  };

  const isStepValid = () => {
    if (step === 1) return formData.name.length > 0 && formData.artist.length > 0;
    if (step === 2) return formData.startDate && formData.endDate && formData.region;
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold text-white">Create New Tour</h2>
            <p className="text-sm text-slate-400">Step {step} of {STEPS.length}: {STEPS[step-1].title}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-700 h-1">
          <div 
            className="bg-indigo-500 h-1 transition-all duration-300 ease-out"
            style={{ width: `${(step / STEPS.length) * 100}%` }}
          ></div>
        </div>

        {/* Body */}
        <div className="p-8 flex-1 overflow-y-auto">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300">Tour Name *</label>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="e.g. West Coast Summer Run 2025"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none text-lg placeholder:text-slate-600"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  onKeyDown={e => e.key === 'Enter' && isStepValid() && handleNext()}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-300">Artist / Band Name *</label>
                    <div className="relative">
                        <input 
                        type="text" 
                        placeholder="e.g. Neon Horizon"
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.artist}
                        onChange={e => setFormData({...formData, artist: e.target.value})}
                        />
                        <Music2 className="absolute left-3 top-3.5 text-slate-500" size={18} />
                    </div>
                </div>
                
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-300">Currency</label>
                    <div className="relative">
                        <select
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                            value={formData.currency}
                            onChange={e => setFormData({...formData, currency: e.target.value})}
                        >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="CAD">CAD ($)</option>
                        </select>
                        <DollarSign className="absolute left-3 top-3.5 text-slate-500" size={18} />
                    </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-700/50">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-300">Tour Manager <span className="text-slate-500 font-normal">(Optional)</span></label>
                    <div className="relative">
                        <input 
                        type="text" 
                        placeholder="Name"
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.tourManager}
                        onChange={e => setFormData({...formData, tourManager: e.target.value})}
                        />
                        <User className="absolute left-3 top-3.5 text-slate-500" size={18} />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-300">Booking Agent <span className="text-slate-500 font-normal">(Optional)</span></label>
                    <div className="relative">
                        <input 
                        type="text" 
                        placeholder="Name"
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.bookingAgent}
                        onChange={e => setFormData({...formData, bookingAgent: e.target.value})}
                        />
                        <Briefcase className="absolute left-3 top-3.5 text-slate-500" size={18} />
                    </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-300">Start Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none [color-scheme:dark]"
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-300">End Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none [color-scheme:dark]"
                    value={formData.endDate}
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300">Primary Region</label>
                <div className="relative group">
                    <select
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-10 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer hover:border-indigo-500/50 transition-colors"
                        value={formData.region}
                        onChange={e => setFormData({...formData, region: e.target.value})}
                    >
                        <option value="North America">North America</option>
                        <option value="Europe">Europe</option>
                        <option value="UK">UK & Ireland</option>
                        <option value="Australia">Australia & NZ</option>
                        <option value="Asia">Asia</option>
                        <option value="South America">South America</option>
                        <option value="Africa">Africa</option>
                    </select>
                    <Globe className="absolute left-3 top-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" size={18} />
                    <ChevronDown className="absolute right-3 top-3.5 text-slate-500 pointer-events-none group-hover:text-indigo-400 transition-colors" size={18} />
                </div>
                <p className="text-xs text-slate-500 pt-1">This sets default currencies and map coordinates for the routing engine.</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in text-center py-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white">Ready to launch!</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                We're creating <strong>{formData.name}</strong> for <strong>{formData.artist}</strong> in <strong>{formData.region}</strong>.
              </p>
              
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700 max-w-sm mx-auto text-sm text-left space-y-2">
                 <div className="flex justify-between">
                    <span className="text-slate-500">Dates:</span>
                    <span className="text-slate-300">{formData.startDate} to {formData.endDate}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-slate-500">Region:</span>
                    <span className="text-slate-300">{formData.region}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-slate-500">Currency:</span>
                    <span className="text-slate-300">{formData.currency}</span>
                 </div>
                 {formData.tourManager && (
                     <div className="flex justify-between">
                        <span className="text-slate-500">TM:</span>
                        <span className="text-slate-300">{formData.tourManager}</span>
                     </div>
                 )}
                 {formData.bookingAgent && (
                     <div className="flex justify-between">
                        <span className="text-slate-500">Agent:</span>
                        <span className="text-slate-300">{formData.bookingAgent}</span>
                     </div>
                 )}
              </div>

              <p className="text-slate-500 text-sm pt-4">
                Clicking "Create & Start Booking" will take you to the tour dashboard where you can add your first show.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 bg-slate-900/50 flex justify-between items-center">
            {step > 1 ? (
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 text-slate-400 hover:text-white px-4 py-2 rounded-lg transition-colors"
              >
                <ArrowLeft size={18} /> Back
              </button>
            ) : (
              <div></div> // Spacer
            )}
            
            <button 
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                isStepValid() 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20' 
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              {step === 3 ? 'Create & Start Booking' : 'Next Step'} 
              {step !== 3 && <ArrowRight size={18} />}
            </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTourWizard;