'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { Search, Users, ShieldAlert, Loader2 } from 'lucide-react';

type UserRole = 'admin' | 'customer' | 'delivery';

type Profile = {
  id: string;
  full_name: string;
  phone_number: string;
  role: UserRole;
  created_at: string;
};

export default function AdminCustomersDashboard() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push('/login');
      
      const { data: currentUser } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      if (currentUser?.role !== 'admin') return router.push('/');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) setProfiles(data as Profile[]);
      setLoading(false);
    };
    fetchProfiles();
  }, [router]);

  const updateRole = async (userId: string, newRole: UserRole) => {
    const confirmUpdate = window.confirm(`Are you sure you want to make this user a(n) ${newRole.toUpperCase()}?`);
    if (!confirmUpdate) return;

    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    
    if (!error) {
      setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole } : p));
      alert("User role updated successfully.");
    } else {
      alert("Failed to update role: " + error.message);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    if (role === 'admin') return <span className="bg-[#8E1C1C] text-white px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">Admin</span>;
    if (role === 'delivery') return <span className="bg-[#1976D2] text-white px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">Delivery</span>;
    return <span className="bg-[#EFEBE1] text-[#5D4037] px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">Customer</span>;
  };

  const filteredProfiles = profiles.filter(p => 
    p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.phone_number?.includes(searchQuery)
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#F57C00]" size={32}/></div>;

  return (
    <main className="min-h-screen bg-[#FAFAF7] py-8 px-4 font-sans">
      <div className="w-full xl:max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-[#3E2723]">User Management</h1>
            <p className="text-[#8D6E63] text-xs font-bold mt-1">Manage customers and assign admin/delivery roles.</p>
          </div>
          
          <div className="relative w-full sm:w-64">
            <input 
              type="text" placeholder="Search Name or Phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#EFEBE1] rounded-xl py-2 pl-9 pr-3 text-xs font-bold outline-none focus:border-[#F57C00] shadow-sm"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-[#8D6E63]"/>
          </div>
        </div>

        <div className="bg-white border border-[#EFEBE1] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F2E9] border-b border-[#EFEBE1] text-[#8D6E63] text-[10px] uppercase tracking-widest">
                  <th className="px-5 py-3 font-black">User Details</th>
                  <th className="px-5 py-3 font-black">Phone Number</th>
                  <th className="px-5 py-3 font-black">Current Role</th>
                  <th className="px-5 py-3 font-black text-right">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEBE1] text-xs font-bold text-[#3E2723]">
                {filteredProfiles.map(user => (
                  <tr key={user.id} className="hover:bg-[#FAFAF7] transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#FFF8E1] text-[#F57C00] flex items-center justify-center font-black text-xs uppercase border border-[#FFE082]">
                          {user.full_name ? user.full_name[0] : <Users size={14}/>}
                        </div>
                        <div>
                          <div className="font-black text-[#3E2723]">{user.full_name || 'Guest User'}</div>
                          <div className="text-[9px] text-[#8D6E63] mt-0.5">Joined: {new Date(user.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">{user.phone_number || 'N/A'}</td>
                    <td className="px-5 py-4">{getRoleBadge(user.role)}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <ShieldAlert size={14} className="text-[#8D6E63]"/>
                        <select 
                          value={user.role}
                          onChange={(e) => updateRole(user.id, e.target.value as UserRole)}
                          className="bg-[#FAFAF7] border border-[#EFEBE1] rounded-lg px-2 py-1 text-[10px] font-bold outline-none cursor-pointer hover:border-[#F57C00] transition"
                        >
                          <option value="customer">Customer</option>
                          <option value="delivery">Delivery</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}