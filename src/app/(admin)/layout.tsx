'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Truck, Users } from 'lucide-react';
import AdminHeader from '../../components/layout/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Inventory Vault', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Orders Hub', path: '/admin-orders', icon: Package },
    { name: 'Customers & Roles', path: '/customers', icon: Users },
    { name: 'Dispatch & Delivery', path: '#', icon: Truck },
  ];

  return (
    <div className="flex h-screen bg-[#FAFAF7] overflow-hidden font-sans text-[#3E2723]">
      
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#3E2723] text-[#D7CCC8] flex flex-col z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} border-r border-[#2D1B15]`}>
        
        {/* BRAND AREA WITH LOGO IMAGE */}
        <div className="h-20 flex flex-col items-center justify-center border-b border-[#5D4037]/50 bg-[#2D1B15] shrink-0 px-4">
          <Link href="/dashboard" className="transition-transform hover:scale-105 active:scale-95">
            <img src="/pnp.png" alt="PNP Logo" className="h-10 w-auto object-contain brightness-0 invert" />
          </Link>
          <span className="text-[#F57C00] text-[8px] font-black tracking-[0.3em] uppercase mt-1">Admin Panel</span>
        </div>
        
        {/* Navigation Links */}
        <div className="p-4 flex-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-[#8D6E63] mb-4 tracking-widest uppercase px-2">Core Systems</p>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname.includes(item.path);
              return (
                <Link 
                  key={item.name} 
                  href={item.path} 
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors text-xs font-black ${isActive ? 'bg-[#F57C00] text-white shadow-md' : 'hover:bg-[#5D4037] hover:text-white'}`}
                >
                  <item.icon size={16}/> {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <AdminHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}