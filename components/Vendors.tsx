import React, { useState } from 'react';
import { useTour } from '../context/TourContext';
import { Users, Shield, Zap, Scissors, Truck, Mic2, Plus, Phone, Mail, FileText, AlertTriangle, Trash2, MapPin, Search } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import { Vendor, VendorRole } from '../types';
import { trackEvent } from '../utils/analytics';

const Vendors: React.FC = () => {
  const { vendors, addVendor, deleteVendor } = useTour();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Form State
  const [newVendor, setNewVendor] = useState<Partial<Vendor>>({
      role: 'Other',
      requiresPermits: false
  });

  const handleSave = async () => {
      if (newVendor.name && newVendor.role) {
          try {
              await addVendor({
                  name: newVendor.name,
                  role: newVendor.role as VendorRole,
                  city: newVendor.city || '',
                  pocName: newVendor.pocName || '',
                  pocEmail: newVendor.pocEmail || '',
                  pocPhone: newVendor.pocPhone || '',
                  requiresPermits: newVendor.requiresPermits || false,
                  notes: newVendor.notes || ''
              });
              trackEvent('vendor_onboarded', { role: newVendor.role });
              setIsModalOpen(false);
              setNewVendor({ role: 'Other', requiresPermits: false });
          } catch (error) {
              console.error('Error creating vendor:', error);
          }
      }
  };

  const getRoleIcon = (role: VendorRole) => {
      switch(role) {
          case 'Security': return <Shield size={18} />;
          case 'Pyrotechnics': return <Zap size={18} />;
          case 'Makeup/Stylist': return <Scissors size={18} />;
          case 'Runner': return <Truck size={18} />;
          case 'Sound/Audio': return <Mic2 size={18} />;
          default: return <Users size={18} />;
      }
  };

  const getRoleColor = (role: VendorRole) => {
      switch(role) {
          case 'Security': return 'text-rose-400 bg-rose-500/20';
          case 'Pyrotechnics': return 'text-amber-400 bg-amber-500/20';
          case 'Makeup/Stylist': return 'text-purple-400 bg-purple-500/20';
          case 'Sound/Audio': return 'text-sky-400 bg-sky-500/20';
          default: return 'text-slate-400 bg-slate-500/20';
      }
  };

  const filteredVendors = vendors.filter(v => 
      v.name.toLowerCase().includes(search.toLowerCase()) || 
      v.role.toLowerCase().includes(search.toLowerCase()) ||
      v.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Crew & Vendors' }]} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-white">Crew & Third Parties</h1>
            <p className="text-slate-400 mt-1">Manage external contractors, security, and styling teams.</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-indigo-900/20"
        >
            <Plus size={18} /> Onboard Vendor
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
          <input 
            type="text" 
            placeholder="Search vendors by name, role, or city..." 
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 text-slate-500" size={18} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.length > 0 ? filteredVendors.map(vendor => (
              <div key={vendor.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 group hover:border-slate-600 transition-all">
                  <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-lg ${getRoleColor(vendor.role)}`}>
                          {getRoleIcon(vendor.role)}
                      </div>
                      <div className="flex gap-2">
                          {vendor.requiresPermits && (
                              <div className="px-2 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase rounded border border-amber-500/20 flex items-center gap-1" title="Permits Required">
                                  <FileText size={10} /> Permits
                              </div>
                          )}
                          <button onClick={() => deleteVendor(vendor.id)} className="text-slate-600 hover:text-rose-400 transition-colors">
                              <Trash2 size={16} />
                          </button>
                      </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-1">{vendor.name}</h3>
                  <div className="text-sm text-slate-400 mb-4 flex items-center gap-1">
                      <MapPin size={12} /> {vendor.city || 'No HQ Listed'}
                  </div>

                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-2 mb-4">
                      <div className="text-xs font-bold text-slate-500 uppercase">Primary Contact</div>
                      <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
                          <Users size={14} className="text-indigo-400"/> {vendor.pocName || 'N/A'}
                      </div>
                      {(vendor.pocEmail || vendor.pocPhone) && (
                          <div className="flex flex-col gap-1 text-xs text-slate-400 pl-6">
                              {vendor.pocEmail && <span>{vendor.pocEmail}</span>}
                              {vendor.pocPhone && <span>{vendor.pocPhone}</span>}
                          </div>
                      )}
                  </div>
                  
                  {vendor.requiresPermits ? (
                       <div className="p-3 border border-dashed border-slate-700 rounded-lg text-center">
                           <p className="text-xs text-slate-500 mb-2">Permit documentation needed</p>
                           <span className="text-xs bg-slate-700 text-slate-400 px-2 py-1 rounded inline-block cursor-not-allowed opacity-70">
                               Upload Coming Soon
                           </span>
                       </div>
                  ) : (
                      <div className="p-3 text-center">
                          <span className="text-xs text-emerald-500 flex items-center justify-center gap-1">
                              <Shield size={12} /> Standard Compliance
                          </span>
                      </div>
                  )}
              </div>
          )) : (
              <div className="col-span-full text-center py-12 text-slate-500">
                  <p>No vendors found matching your search.</p>
              </div>
          )}
      </div>

      {/* Onboarding Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
              <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg p-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
                  <h2 className="text-xl font-bold text-white mb-1">Onboard New Vendor</h2>
                  <p className="text-slate-400 text-sm mb-6">Add details for crew, security, or third-party services.</p>
                  
                  <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                              <label className="block text-xs text-slate-400 uppercase mb-1">Company / Entity Name</label>
                              <input 
                                type="text" 
                                autoFocus
                                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white outline-none focus:border-indigo-500"
                                value={newVendor.name || ''}
                                onChange={e => setNewVendor({...newVendor, name: e.target.value})}
                              />
                          </div>
                          <div>
                              <label className="block text-xs text-slate-400 uppercase mb-1">Role / Type</label>
                              <select 
                                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white outline-none focus:border-indigo-500"
                                value={newVendor.role}
                                onChange={e => setNewVendor({...newVendor, role: e.target.value as VendorRole})}
                              >
                                  <option value="Security">Security</option>
                                  <option value="Sound/Audio">Sound/Audio</option>
                                  <option value="Pyrotechnics">Pyrotechnics</option>
                                  <option value="Runner">Runner</option>
                                  <option value="Makeup/Stylist">Makeup/Stylist</option>
                                  <option value="Catering">Catering</option>
                                  <option value="Other">Other</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs text-slate-400 uppercase mb-1">Base City</label>
                              <input 
                                type="text" 
                                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white outline-none focus:border-indigo-500"
                                placeholder="e.g. London"
                                value={newVendor.city || ''}
                                onChange={e => setNewVendor({...newVendor, city: e.target.value})}
                              />
                          </div>
                      </div>

                      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                          <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                              <Users size={16} /> Point of Contact
                          </h3>
                          <div className="space-y-3">
                              <input 
                                type="text" 
                                placeholder="Contact Name"
                                className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm"
                                value={newVendor.pocName || ''}
                                onChange={e => setNewVendor({...newVendor, pocName: e.target.value})}
                              />
                              <div className="grid grid-cols-2 gap-3">
                                  <input 
                                    type="email" 
                                    placeholder="Email"
                                    className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm"
                                    value={newVendor.pocEmail || ''}
                                    onChange={e => setNewVendor({...newVendor, pocEmail: e.target.value})}
                                  />
                                  <input 
                                    type="tel" 
                                    placeholder="Phone"
                                    className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm"
                                    value={newVendor.pocPhone || ''}
                                    onChange={e => setNewVendor({...newVendor, pocPhone: e.target.value})}
                                  />
                              </div>
                          </div>
                      </div>

                      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                           <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                              <FileText size={16} /> Compliance & Logistics
                          </h3>
                          <div className="flex items-start gap-3 mb-3">
                              <input 
                                type="checkbox" 
                                id="permits" 
                                className="mt-1"
                                checked={newVendor.requiresPermits}
                                onChange={e => setNewVendor({...newVendor, requiresPermits: e.target.checked})}
                              />
                              <label htmlFor="permits" className="text-sm text-slate-400 cursor-pointer">
                                  <span className="text-white font-medium block">Requires Permits / Special Licensing</span>
                                  Use for pyrotechnics, firearms, or specialized security needs.
                              </label>
                          </div>
                          
                          {newVendor.requiresPermits && (
                              <div className="ml-6 p-2 bg-amber-500/10 text-amber-200 text-xs rounded border border-amber-500/20 flex items-start gap-2">
                                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                  <span>You will need to upload Fire Marshal / Local Authority permits for this vendor before the show date.</span>
                              </div>
                          )}

                          <div className="mt-4 pt-4 border-t border-slate-700 opacity-60">
                               <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                                   <span className="font-bold uppercase tracking-wider">Advanced Integrations (Coming Soon)</span>
                               </div>
                               <div className="grid grid-cols-2 gap-2">
                                   <div className="bg-slate-800 p-2 rounded text-xs text-slate-500 border border-slate-700">Background Checks</div>
                                   <div className="bg-slate-800 p-2 rounded text-xs text-slate-500 border border-slate-700">Insurance Cert Sync</div>
                               </div>
                          </div>
                      </div>
                  </div>

                  <div className="flex gap-3 pt-6">
                      <button 
                          onClick={() => setIsModalOpen(false)}
                          className="flex-1 py-3 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors font-medium"
                      >
                          Cancel
                      </button>
                      <button 
                          onClick={handleSave}
                          disabled={!newVendor.name}
                          className="flex-[2] bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      >
                          Complete Onboarding
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Vendors;
