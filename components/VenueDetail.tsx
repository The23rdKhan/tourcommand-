import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTour } from '../context/TourContext';
import Breadcrumbs from './Breadcrumbs';
import { MapPin, Mail, User, Info, Calendar, Edit2, X, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ShowStatus, Venue } from '../types';
import { useToast } from './Toast';

const VenueDetail: React.FC = () => {
  const { venueId } = useParams();
  const { venues, tours, updateVenue } = useTour();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Venue>>({});
  
  // Try to find by ID first, then by exact name match (decoded from URL)
  const venue = venues.find(v => v.id === venueId || v.name === venueId);

  if (!venue) return <div className="p-8">Venue not found</div>;

  // Find all shows at this venue
  const relatedShows = tours.flatMap(tour => 
    tour.shows
        .filter(show => show.venueId === venue.id || show.venue === venue.name)
        .map(show => ({ ...show, tourName: tour.name, tourId: tour.id }))
  ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Newest first

  return (
    <div className="space-y-8 animate-fade-in">
      <Breadcrumbs items={[
        { label: 'Venues', to: '/app/venues' },
        { label: venue.name }
      ]} />

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
         <div className="p-6 md:p-8 border-b border-slate-700 bg-slate-800">
             <div className="flex justify-between items-start">
                 <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{venue.name}</h1>
                    <div className="flex items-center gap-2 text-slate-400">
                        <MapPin size={18} /> {venue.city}
                        <span className="mx-2">•</span>
                        <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-sm">{venue.capacity} Capacity</span>
                    </div>
                 </div>
                 <button 
                   onClick={() => {
                     if (isEditing) {
                       setIsEditing(false);
                       setEditData({});
                     } else {
                       setIsEditing(true);
                       setEditData({
                         name: venue.name,
                         city: venue.city,
                         capacity: venue.capacity,
                         contactName: venue.contactName,
                         contactEmail: venue.contactEmail,
                         notes: venue.notes
                       });
                     }
                   }}
                   className="text-slate-400 hover:text-white text-sm font-medium flex items-center gap-2"
                 >
                   {isEditing ? <X size={16} /> : <Edit2 size={16} />}
                   {isEditing ? 'Cancel' : 'Edit Venue'}
                 </button>
             </div>
         </div>
         <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
                 <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Contact Info</h3>
                 {isEditing ? (
                     <div className="space-y-4">
                         <div>
                             <label className="block text-xs text-slate-400 mb-1">Contact Name</label>
                             <input
                                 type="text"
                                 value={editData.contactName || ''}
                                 onChange={(e) => setEditData({ ...editData, contactName: e.target.value })}
                                 className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm"
                                 placeholder="Contact name"
                             />
                         </div>
                         <div>
                             <label className="block text-xs text-slate-400 mb-1">Contact Email</label>
                             <input
                                 type="email"
                                 value={editData.contactEmail || ''}
                                 onChange={(e) => setEditData({ ...editData, contactEmail: e.target.value })}
                                 className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm"
                                 placeholder="contact@venue.com"
                             />
                         </div>
                         <div>
                             <label className="block text-xs text-slate-400 mb-1">Capacity</label>
                             <input
                                 type="number"
                                 value={editData.capacity || 0}
                                 onChange={(e) => setEditData({ ...editData, capacity: parseInt(e.target.value) || 0 })}
                                 className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm"
                                 placeholder="0"
                             />
                         </div>
                         <button
                             onClick={async () => {
                                 if (venue) {
                                     await updateVenue({ ...venue, ...editData } as Venue);
                                     setIsEditing(false);
                                     setEditData({});
                                     addToast('Venue updated', 'success');
                                 }
                             }}
                             className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                         >
                             <Save size={16} /> Save Changes
                         </button>
                     </div>
                 ) : (
                     <div className="space-y-4">
                         <div className="flex items-center gap-3">
                             <User className="text-indigo-400" size={20} />
                             <div>
                                 <p className="text-slate-300 font-medium">{venue.contactName || 'No contact name'}</p>
                                 <p className="text-xs text-slate-500">Promoter / Buyer</p>
                             </div>
                         </div>
                         <div className="flex items-center gap-3">
                             <Mail className="text-indigo-400" size={20} />
                             <div>
                                 <p className="text-slate-300 font-medium">{venue.contactEmail || 'No email'}</p>
                                 <p className="text-xs text-slate-500">Email</p>
                             </div>
                         </div>
                     </div>
                 )}
             </div>
             <div>
                 <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Notes</h3>
                 {isEditing ? (
                     <div>
                         <textarea
                             value={editData.notes || ''}
                             onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                             className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white text-sm min-h-[100px]"
                             placeholder="Add notes about this venue..."
                         />
                     </div>
                 ) : (
                     <div className="flex items-start gap-3 p-4 bg-slate-900 rounded-lg">
                         <Info className="text-slate-400 shrink-0 mt-1" size={18} />
                         <p className="text-slate-300 text-sm leading-relaxed">{venue.notes || "No notes added for this venue yet."}</p>
                     </div>
                 )}
             </div>
         </div>
      </div>

      <div>
          <h2 className="text-xl font-bold text-white mb-4">Show History</h2>
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              {relatedShows.length > 0 ? (
                  <div className="divide-y divide-slate-700">
                      {relatedShows.map(show => (
                          <Link 
                            key={show.id} 
                            to={`/app/tours/${show.tourId}/shows/${show.id}`}
                            className="flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors"
                          >
                              <div className="flex items-center gap-4">
                                  <div className="text-center w-14">
                                      <div className="text-xs text-slate-500 uppercase">{new Date(show.date).toLocaleString('default', { month: 'short' })}</div>
                                      <div className="text-xl font-bold text-white">{new Date(show.date).getDate()}</div>
                                  </div>
                                  <div>
                                      <h4 className="font-semibold text-white">{show.city}</h4>
                                      <div className="text-sm text-slate-400 flex items-center gap-2">
                                          <Calendar size={12} /> {show.tourName}
                                      </div>
                                  </div>
                              </div>
                              <div className="flex items-center gap-4">
                                   <span className={`px-2 py-1 rounded text-xs ${
                                      show.status === ShowStatus.CONFIRMED ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                                   }`}>
                                       {show.status}
                                   </span>
                              </div>
                          </Link>
                      ))}
                  </div>
              ) : (
                  <div className="p-8 text-center text-slate-500">
                      No shows recorded at this venue.
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default VenueDetail;