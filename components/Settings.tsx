import React, { useState, useEffect } from 'react';
import { User, CreditCard, Layers, Crown, CheckCircle, Zap, X, AlertTriangle } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { useTour } from '../context/TourContext';
import { SubscriptionTier } from '../types';

const Settings: React.FC = () => {
  const { user, upgradeTier, updateUser } = useTour();
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'integrations'>('profile');
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: (user?.role || 'Manager') as 'Artist' | 'Manager' | 'Operator'
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [showRoleWarning, setShowRoleWarning] = useState(false);
  const [pendingRole, setPendingRole] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize profile data from user prop
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        role: (user.role || 'Manager') as 'Artist' | 'Manager' | 'Operator'
      });
      setHasChanges(false);
    }
  }, [user]);

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    trackEvent('settings_tab_changed', { tab });
  };

  const handleUpgrade = async (tier: SubscriptionTier) => {
      try {
          await upgradeTier(tier);
          trackEvent('subscription_upgraded', { tier });
      } catch (error) {
          console.error('Error upgrading tier:', error);
      }
  };

  // Handle profile field changes
  const handleProfileChange = (field: 'name' | 'email' | 'role', value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Handle role change - show warning if different from current
  const handleRoleChange = (newRole: string) => {
    handleProfileChange('role', newRole);
  };

  // Handle save - check if role changed
  const handleSave = async () => {
    if (!hasChanges) return;

    const roleChanged = profileData.role !== user?.role;
    
    if (roleChanged) {
      setPendingRole(profileData.role);
      setShowRoleWarning(true);
    } else {
      await saveProfile();
    }
  };

  // Save profile without role change
  const saveProfile = async () => {
    setIsSaving(true);
    try {
      await updateUser({
        name: profileData.name,
        email: profileData.email,
        role: profileData.role
      });
      setHasChanges(false);
      trackEvent('profile_updated', { 
        fields: ['name', 'email'].filter(f => profileData[f as keyof typeof profileData] !== user?.[f as keyof typeof user])
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle role change confirmation
  const handleRoleChangeConfirm = async () => {
    if (!pendingRole) return;

    setIsSaving(true);
    try {
      const oldRole = user?.role;
      await updateUser({
        name: profileData.name,
        email: profileData.email,
        role: pendingRole as 'Artist' | 'Manager' | 'Operator'
      });
      
      trackEvent('role_changed', { 
        oldRole: oldRole || 'Unknown',
        newRole: pendingRole
      });
      
      setShowRoleWarning(false);
      setPendingRole(null);
      setHasChanges(false);
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle role change cancellation
  const handleRoleChangeCancel = () => {
    setShowRoleWarning(false);
    setPendingRole(null);
    // Restore original role
    if (user) {
      setProfileData(prev => ({ ...prev, role: user.role as 'Artist' | 'Manager' | 'Operator' }));
    }
  };

  // Personalized copy for upsells
  const getProFeaturesText = () => {
      if (user?.role === 'Artist') return 'Unlock Smart Routing & unlimited tours.';
      if (user?.role === 'Manager') return 'Unlock Team Roles & Artist Rosters.';
      if (user?.role === 'Operator') return 'Unlock Bulk Tools & Venue CRM.';
      return 'Unlock advanced tools.';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>

      {/* Tabs */}
      <div className="flex border-b border-slate-700 space-x-6 mb-6">
        {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
            { id: 'integrations', label: 'Integrations', icon: Layers },
        ].map(tab => (
            <button 
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
                    activeTab === tab.id 
                    ? 'border-indigo-500 text-indigo-400' 
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
            >
                <tab.icon size={16} /> {tab.label}
            </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {activeTab === 'profile' && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            value={profileData.name}
                            onChange={(e) => handleProfileChange('name', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Email</label>
                        <input 
                            type="email" 
                            value={profileData.email}
                            onChange={(e) => handleProfileChange('email', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Role</label>
                        <select 
                            value={profileData.role} 
                            onChange={(e) => handleRoleChange(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        >
                            <option value="Artist">Artist / Musician</option>
                            <option value="Manager">Artist Manager</option>
                            <option value="Operator">Venue Operator / Promoter</option>
                        </select>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-700 flex justify-end">
                    <button 
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <Zap size={16} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </div>
        )}

        {/* Role Change Warning Modal */}
        {showRoleWarning && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
                <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md p-6 shadow-2xl animate-fade-in">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="text-amber-400" size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">Change Your Role?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Changing your role will update your dashboard experience. Your existing data (tours/venues) will remain accessible but may be filtered based on your new role. You can change this again anytime.
                            </p>
                            <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                                <div className="text-sm text-slate-300">
                                    <span className="text-slate-400">Current:</span> <span className="font-medium">{user?.role}</span>
                                    <span className="mx-2 text-slate-600">→</span>
                                    <span className="text-slate-400">New:</span> <span className="font-medium text-indigo-400">{pendingRole}</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={handleRoleChangeCancel}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={handleRoleChangeCancel}
                            className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleRoleChangeConfirm}
                            disabled={isSaving}
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <Zap size={16} className="animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Confirm Change'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'integrations' && (
             <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-2">Integrations</h2>
                <p className="text-slate-400 text-sm mb-6">Connect your favorite tools to streamline your workflow.</p>
                <div className="space-y-4">
                    {/* Eventbrite - Coming Soon */}
                    <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg opacity-75">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded flex items-center justify-center font-bold text-slate-900">EB</div>
                            <div>
                                <div className="text-white font-medium">Eventbrite</div>
                                <div className="text-xs text-slate-500">Sync ticket counts automatically</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">Coming Soon</span>
                        </div>
                    </div>

                    {/* Square - Coming Soon */}
                    <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg opacity-75">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-sky-500 rounded flex items-center justify-center font-bold text-white">SQ</div>
                            <div>
                                <div className="text-white font-medium">Square</div>
                                <div className="text-xs text-slate-500">Import merch sales data</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">Coming Soon</span>
                        </div>
                    </div>

                    {/* QuickBooks - Coming Soon */}
                    <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg opacity-75">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center font-bold text-white">QB</div>
                            <div>
                                <div className="text-white font-medium">QuickBooks</div>
                                <div className="text-xs text-slate-500">Sync expenses to accounting</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">Coming Soon</span>
                        </div>
                    </div>

                    {/* Slack - Coming Soon */}
                    <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg opacity-75">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-600 rounded flex items-center justify-center font-bold text-white">SL</div>
                            <div>
                                <div className="text-white font-medium">Slack</div>
                                <div className="text-xs text-slate-500">Daily tour reports to channel</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">Coming Soon</span>
                        </div>
                    </div>
                </div>
                <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                    <p className="text-indigo-300 text-sm">
                        <strong>Want an integration?</strong> We're actively building new integrations. Email us at <a href="mailto:support@tourcommand.app" className="underline hover:text-indigo-200">support@tourcommand.app</a> with your requests.
                    </p>
                </div>
             </div>
        )}

        {activeTab === 'billing' && (
            <div className="space-y-6">
                {/* Current Plan Card */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Subscription Plan</h2>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg border border-slate-700">
                        <div>
                            <div className="text-slate-400 text-sm mb-1">Current Tier</div>
                            <div className="text-2xl font-bold text-white flex items-center gap-2">
                                {user?.tier} Plan
                                {user?.tier !== 'Free' && <CheckCircle className="text-emerald-500" size={20} />}
                            </div>
                        </div>
                        {user?.tier === 'Free' && (
                            <button onClick={() => handleUpgrade('Pro')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 shadow-lg font-medium">
                                Upgrade to Pro
                            </button>
                        )}
                    </div>
                </div>

                {/* Plan Options */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Available Plans</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['Free', 'Pro', 'Agency'].map((tierName) => (
                            <div 
                                key={tierName} 
                                onClick={() => handleUpgrade(tierName as SubscriptionTier)}
                                className={`
                                    border rounded-xl p-5 cursor-pointer transition-all relative
                                    ${user?.tier === tierName 
                                        ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500' 
                                        : 'border-slate-700 bg-slate-900 hover:border-slate-500'
                                    }
                                `}
                            >
                                {tierName === 'Pro' && <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl">POPULAR</div>}
                                
                                <h4 className="font-bold text-white text-lg mb-1">{tierName}</h4>
                                <div className="text-slate-400 text-sm h-10 mb-4">
                                    {tierName === 'Free' ? 'Essentials.' : tierName === 'Pro' ? getProFeaturesText() : 'Multi-user access & API.'}
                                </div>
                                <div className="text-xl font-bold text-white mb-4">
                                    {tierName === 'Free' ? '$0' : tierName === 'Pro' ? '$29' : '$99'}<span className="text-sm font-normal text-slate-500">/mo</span>
                                </div>
                                
                                <button className={`w-full py-2 rounded text-sm font-medium ${
                                    user?.tier === tierName 
                                    ? 'bg-indigo-600 text-white cursor-default' 
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}>
                                    {user?.tier === tierName ? 'Current Plan' : 'Select Plan'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Billing History</h3>
                    <p className="text-slate-400 italic text-sm">No invoices found.</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Settings;