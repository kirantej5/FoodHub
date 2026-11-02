import { useState } from 'react';
import { User, MapPin, Camera } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.updateProfile(formData);
      updateUser(res.data.data.user);
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="page-enter py-12">
      <div className="container-custom max-w-4xl">
        <h1 className="text-3xl font-black mb-8">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="col-span-1">
            <div className="card p-6 text-center bg-zinc-900/50">
              <div className="relative w-32 h-32 mx-auto mb-4 group cursor-pointer">
                <div className="w-full h-full rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl"
                  style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white mb-1" size={20} />
                  <span className="text-xs font-medium text-white">Change</span>
                </div>
              </div>
              <h2 className="text-xl font-bold mb-1">{user.name}</h2>
              <p className="text-gray-400 text-sm mb-4">{user.email}</p>
              
              <div className="flex flex-col gap-2 pt-4 border-t border-zinc-800 text-left">
                <div className="flex items-center gap-3 text-sm text-gray-300 p-2 rounded-lg bg-zinc-800">
                  <User size={16} className="text-orange-500" /> Account Settings
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer">
                  <MapPin size={16} /> Saved Addresses
                </div>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <form onSubmit={handleUpdate} className="card p-6 bg-zinc-900/50">
              <h3 className="text-lg font-bold mb-6">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email Address (Cannot change)</label>
                  <input type="email" value={user.email} disabled className="input-field opacity-50 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="input-field" />
                </div>
              </div>
              
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>

            <div className="card p-6 bg-zinc-900/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Saved Addresses</h3>
                <button className="text-sm text-orange-500 hover:underline">Add New</button>
              </div>
              
              {user.addresses?.length > 0 ? (
                <div className="space-y-4">
                  {user.addresses.map((addr, idx) => (
                    <div key={idx} className="p-4 border border-zinc-700 rounded-xl relative">
                      {addr.isDefault && <span className="absolute top-4 right-4 badge badge-orange text-[10px]">Default</span>}
                      <p className="font-medium mb-1">{addr.label || 'Home'}</p>
                      <p className="text-sm text-gray-400">{addr.street}, {addr.city}, {addr.state} {addr.zipCode}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No addresses saved yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
