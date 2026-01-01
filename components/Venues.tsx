import React, { useState } from 'react';
import { useTour } from '../context/TourContext';
import { MapPin, Mail, Plus } from 'lucide-react';
import { Venue } from '../types';
import { Link } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import { trackEvent } from '../utils/analytics';

const Venues: React.FC = () => {
  const { venues, addVenue } = useTour();
  const [isAdding, setIsAdding] = useState(false);
  const [newVenue, setNewVenue] = useState<Partial<Venue>>({});

  const handleAdd = async () => {
    if (newVenue.name && newVenue.city) {
        try {
            await addVenue({
                name: newVenue.name,
                city: newVenue.city,
                capacity: newVenue.capacity || 0,
                contactName: newVenue.contactName || '',
                contactEmail: newVenue.contactEmail || '',
                notes: newVenue.notes || ''
            });
            trackEvent('venue_created', { city: newVenue.city });
            setIsAdding(false);
            setNewVenue({});
        } catch (error) {
            console.error('Error creating venue:', error);
        }
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Venues' }]} />
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Venue Database</h2>
        <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
            <Plus size={16} /> Add Venue
        </button>
      </div>

      {isAdding && (
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl mb-6 animate-fade-in">
              <h3 className="text-white font-medium mb-4">Add New Venue</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                  <input placeholder="Venue Name" className="bg-slate-900 border border-slate-700 p-2 rounded text-white" value={newVenue.name || ''} onChange={e => setNewVenue({...newVenue, name: e.target.value})} />
                  <input placeholder="City" className="bg-slate-900 border border-slate-700 p-2 rounded text-white" value={newVenue.city || ''} onChange={e => setNewVenue({...newVenue, city: e.target.value})} />
                  <input placeholder="Capacity" type="number" className="bg-slate-900 border border-slate-700 p-2 rounded text-white" value={newVenue.capacity || ''} onChange={e => setNewVenue({...newVenue, capacity: parseInt(e.target.value)})} />
                  <input placeholder="Contact Email" className="bg-slate-900 border border-slate-700 p-2 rounded text-white" value={newVenue.contactEmail || ''} onChange={e => setNewVenue({...newVenue, contactEmail: e.target.value})} />
              </div>
              <div className="flex gap-2">
                  <button onClick={handleAdd} className="bg-emerald-600 text-white px-4 py-2 rounded">Save Venue</button>
                  <button onClick={() => setIsAdding(false)} className="text-slate-400 px-4">Cancel</button>
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {venues.map(venue => (
            <Link key={venue.id} to={`/app/venues/${venue.id}`} className="block bg-slate-800 border border-slate-700 p-5 rounded-xl hover:border-indigo-500/50 transition-all hover:shadow-lg">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white text-lg">{venue.name}</h3>
                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">{venue.capacity} cap</span>
                </div>
                <div className="text-slate-400 flex items-center gap-2 text-sm mb-4">
                    <MapPin size={14} /> {venue.city}
                </div>
                <div className="border-t border-slate-700 pt-3 text-sm text-slate-400 space-y-1">
                    <div className="flex items-center gap-2"><Mail size={14} className="text-indigo-400"/> {venue.contactEmail || 'No email'}</div>
                </div>
            </Link>
        ))}
      </div>
    </div>
  );
};

export default Venues;
