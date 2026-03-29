'use client';

import { useState, useEffect } from 'react';
import { User, MapPin, Package, LogOut, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';

type UserProfile = { id: string; full_name: string; phone_number: string; address: string; role: string; email: string; };

export default function AccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [toast, setToast] = useState<{show: boolean, msg: string, isError: boolean}>({show: false, msg: '', isError: false});

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      const { data, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      
      if (error || !data) {
        router.push('/login'); return;
      }

      if (data.role === 'admin') { router.push('/dashboard'); return; }
      if (data.role === 'delivery') { router.push('/'); return; } 

      setProfile({ 
        id: data.id, 
        full_name: data.full_name || '', 
        phone_number: data.phone_number || '', 
        address: data.address || '',
        role: data.role, 
        email: session.user.email || '' 
      });
      setEditName(data.full_name || '');
      setEditPhone(data.phone_number || '');
      setEditAddress(data.address || '');
      setLoading(false);
    };
    fetchProfile();
  }, [router]);

  const showToast = (msg: string, isError = false) => {
    setToast({ show: true, msg, isError });
    setTimeout(() => setToast({ show: false, msg: '', isError: false }), 4000);
  };

  const handleUpdate = async () => {
    if (!profile) return;
    
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: editName, phone_number: editPhone, address: editAddress })
      .eq('id', profile.id);
    
    if (error) {
      console.error("Supabase Update Error:", error);
      showToast(`Error: ${error.message}`, true);
    } else {
      setProfile({ ...profile, full_name: editName, phone_number: editPhone, address: editAddress });
      setIsEditing(false);
      showToast('Profile updated successfully!');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex flex-col items-center justify-center text-[#F57C00]">
        <Loader2 size={40} className="animate-spin mb-4" />
        <p className="font-black tracking-widest uppercase text-sm">Verifying Account...</p>
      </div>
    );
  }
  if (!profile) return null;

  return (
    <main className="min-h-screen bg-[#FAFAF7] py-12 px-4 font-sans relative">
      <div className={`fixed top-24 right-4 z-[100] transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className={`${toast.isError ? 'bg-[#D32F2F]' : 'bg-[#2E7D32]'} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-bold max-w-sm`}>
          <CheckCircle2 size={20} className="shrink-0" /> 
          <span className="text-sm leading-tight">{toast.msg}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        
        <aside className="w-full md:w-72 shrink-0 space-y-2">
          <div className="bg-white p-6 rounded-2xl border border-[#EFEBE1] shadow-sm mb-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#8E1C1C] text-white rounded-full flex items-center justify-center font-black text-xl uppercase shrink-0">
              {profile.full_name ? profile.full_name[0] : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="font-black text-[#3E2723] truncate">{profile.full_name || 'Customer'}</p>
              <p className="text-xs font-bold text-[#8D6E63] capitalize">{profile.role}</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-3 p-4 bg-[#FFF8E1] text-[#F57C00] rounded-xl font-bold transition"><User size={20}/> Profile Details</button>
          <button onClick={() => router.push('/orders')} className="w-full flex items-center gap-3 p-4 text-[#5D4037] hover:bg-white hover:text-[#F57C00] rounded-xl font-bold transition"><Package size={20}/> Order History</button>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 p-4 text-[#D32F2F] hover:bg-[#D32F2F]/10 rounded-xl font-bold transition mt-8"><LogOut size={20}/> Sign Out</button>
        </aside>

        <div className="flex-1 bg-white p-8 md:p-10 rounded-[2rem] border border-[#EFEBE1] shadow-sm h-fit">
          <h2 className="text-2xl font-black text-[#3E2723] mb-6 border-b border-[#EFEBE1] pb-4">Personal Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-xl">
            <div>
              <label className="block text-xs font-bold text-[#8D6E63] uppercase tracking-widest mb-2">Full Name</label>
              <input 
                type="text" disabled={!isEditing} value={isEditing ? editName : profile.full_name} onChange={(e) => setEditName(e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 font-bold transition-all outline-none ${isEditing ? 'bg-white border-[#F57C00] text-[#3E2723] shadow-[0_0_0_4px_rgba(245,124,0,0.1)]' : 'bg-[#F5F2E9] border-transparent text-[#3E2723] opacity-70'}`} 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#8D6E63] uppercase tracking-widest mb-2">Phone Number</label>
              <input 
                type="text" disabled={!isEditing} value={isEditing ? editPhone : profile.phone_number} onChange={(e) => setEditPhone(e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 font-bold transition-all outline-none ${isEditing ? 'bg-white border-[#F57C00] text-[#3E2723] shadow-[0_0_0_4px_rgba(245,124,0,0.1)]' : 'bg-[#F5F2E9] border-transparent text-[#3E2723] opacity-70'}`} 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#8D6E63] uppercase tracking-widest mb-2">Delivery Address</label>
              <textarea 
                disabled={!isEditing} value={isEditing ? editAddress : profile.address} onChange={(e) => setEditAddress(e.target.value)} rows={3}
                className={`w-full border rounded-xl px-4 py-3 font-bold transition-all outline-none resize-none ${isEditing ? 'bg-white border-[#F57C00] text-[#3E2723] shadow-[0_0_0_4px_rgba(245,124,0,0.1)]' : 'bg-[#F5F2E9] border-transparent text-[#3E2723] opacity-70'}`} 
                placeholder="Enter your complete delivery address..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#8D6E63] uppercase tracking-widest mb-2">Email Address (Read Only)</label>
              <input type="email" disabled value={profile.email} className="w-full bg-[#F5F2E9] border border-transparent rounded-xl px-4 py-3 font-bold text-[#3E2723] opacity-50 cursor-not-allowed" />
            </div>
          </div>
          
          <div className="mt-8 flex gap-4">
            {isEditing ? (
              <>
                <button onClick={handleUpdate} className="bg-[#F57C00] text-white font-black px-8 py-3 rounded-xl hover:bg-[#E65100] transition active:scale-95 shadow-md">Save Changes</button>
                <button onClick={() => { setIsEditing(false); setEditName(profile.full_name); setEditPhone(profile.phone_number); setEditAddress(profile.address); }} className="bg-white border-2 border-[#EFEBE1] text-[#5D4037] font-black px-6 py-3 rounded-xl hover:bg-[#F5F2E9] transition">Cancel</button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="bg-white border-2 border-[#EFEBE1] text-[#5D4037] font-black px-6 py-3 rounded-xl hover:border-[#F57C00] hover:text-[#F57C00] transition">Edit Details</button>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}