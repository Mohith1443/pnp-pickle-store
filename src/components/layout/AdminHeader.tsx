'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, Plus, Menu, User, Settings, LogOut, Package, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

type AdminProfile = { full_name: string; email: string };

export default function AdminHeader({ toggleSidebar }: { toggleSidebar: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Dynamic Page Title Generator
  const getPageTitle = () => {
    if (pathname.includes('/admin-orders')) return 'Order Management';
    if (pathname.includes('/dashboard')) return 'Inventory Vault';
    if (pathname.includes('/customers')) return 'User Management';
    return 'Admin Control Panel';
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.from('profiles').select('full_name').eq('id', session.user.id).single();
        setProfile({ full_name: data?.full_name || 'Admin', email: session.user.email || '' });
      }
    };
    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-[#EFEBE1] flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 shrink-0">
      
      {/* Left: Mobile Toggle, Logo & Title */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="lg:hidden p-2 text-[#5D4037] hover:bg-[#F5F2E9] rounded-lg transition">
          <Menu size={20} />
        </button>

        {/* Mobile-only Logo */}
        <Link href="/dashboard" className="lg:hidden block shrink-0">
          <img src="/pnp.png" alt="Logo" className="h-8 w-auto object-contain" />
        </Link>

        <h1 className="text-lg font-black text-[#3E2723] hidden sm:block border-l-2 border-[#EFEBE1] pl-4 ml-2">
          {getPageTitle()}
        </h1>
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Global Search..." 
            className="w-full bg-[#F5F2E9] border border-transparent rounded-xl py-2 pl-10 pr-4 text-xs font-bold outline-none focus:bg-white focus:border-[#F57C00] focus:ring-2 focus:ring-[#F57C00]/10 transition-all text-[#3E2723]"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-[#8D6E63] group-focus-within:text-[#F57C00]" />
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        
        {/* Quick Create Button */}
        <div className="hidden sm:flex relative group">
          <button className="flex items-center gap-1.5 bg-[#FFF8E1] text-[#F57C00] hover:bg-[#F57C00] hover:text-white px-3 py-1.5 rounded-lg transition text-xs font-black uppercase tracking-widest border border-[#FFE082]">
            <Plus size={14} /> Create
          </button>
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-[#EFEBE1] rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0">
            <div className="p-1">
              <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#5D4037] hover:bg-[#F5F2E9] rounded-lg"><Package size={14}/> New Product</Link>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative p-2 text-[#5D4037] hover:bg-[#F5F2E9] rounded-lg transition"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#D32F2F] rounded-full border-2 border-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-[#EFEBE1] rounded-2xl shadow-xl overflow-hidden origin-top-right animate-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-[#EFEBE1] bg-[#FAFAF7] flex justify-between items-center">
                <span className="font-black text-[#3E2723] text-sm">Notifications</span>
                <span className="text-[10px] font-bold text-[#F57C00] uppercase tracking-widest cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <div className="p-4 border-b border-[#EFEBE1] hover:bg-[#FAFAF7] transition cursor-pointer flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0"><AlertCircle size={16}/></div>
                  <div>
                    <p className="text-xs font-bold text-[#3E2723]">Low Stock Alert: Mango Pickle</p>
                    <p className="text-[10px] text-[#8D6E63] mt-0.5">Only 3 jars remaining in inventory.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-2 p-1 pl-2 pr-3 border border-[#EFEBE1] hover:border-[#F57C00] rounded-xl transition bg-[#FAFAF7]"
          >
            <div className="w-6 h-6 rounded-full bg-[#8E1C1C] flex items-center justify-center text-white font-black text-xs uppercase">
              {profile?.full_name ? profile.full_name[0] : 'A'}
            </div>
            <span className="text-xs font-black text-[#3E2723] hidden sm:block">{profile?.full_name?.split(' ')[0]}</span>
          </button>

          {showProfile && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-[#EFEBE1] rounded-2xl shadow-xl overflow-hidden origin-top-right animate-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-[#EFEBE1] bg-[#FAFAF7]">
                <p className="font-black text-[#3E2723] text-sm truncate">{profile?.full_name}</p>
                <p className="text-[10px] font-bold text-[#8D6E63] truncate mt-0.5">{profile?.email}</p>
                <span className="inline-block mt-2 px-2 py-0.5 bg-[#8E1C1C] text-white text-[9px] font-black uppercase tracking-widest rounded">Super Admin</span>
              </div>
              <div className="p-2 space-y-1">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#5D4037] hover:bg-[#F5F2E9] rounded-lg transition"><User size={14}/> Edit Profile</button>
                <div className="h-px bg-[#EFEBE1] my-1 mx-2"></div>
                <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#D32F2F] hover:bg-red-50 rounded-lg transition"><LogOut size={14}/> Sign Out</button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}