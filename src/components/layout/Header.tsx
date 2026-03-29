'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { 
  ShoppingCart, Search, User, Heart, Menu, 
  X, ChevronDown, Package 
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore'; 

type UserProfile = { full_name: string; role: string } | null;

export default function Header() {
  const [isPromoVisible, setIsPromoVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<UserProfile>(null);
  
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.from('profiles').select('full_name, role').eq('id', session.user.id).single();
        setUser(data);
      }
    };
    checkAuth();
  }, []);

  const categories = [
    "Vegetarian Pickles", "Non-Vegetarian Pickles", 
    "Powders & Masalas", "Traditional Sweets", "Combos", "Offers"
  ];

  const accountLink = user ? (user.role === 'admin' ? '/dashboard' : '/account') : '/login';
  const accountText = user ? (user.full_name ? user.full_name.split(' ')[0] : 'Profile') : 'Login';

  return (
    <header className={`sticky top-0 z-50 w-full bg-white transition-all duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm border-b border-[#EFEBE1]'}`}>
      
      {isPromoVisible && (
        <div className="bg-[#8E1C1C] text-[#FFF3E0] text-[11px] font-bold uppercase tracking-widest text-center py-2 relative flex justify-center items-center">
          <span>Free Delivery above ₹499 | Limited Batch Avakaya Available Today</span>
          <button onClick={() => setIsPromoVisible(false)} className="absolute right-4 hover:text-white transition p-1">
            <X size={14} />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 md:gap-8">
        <button className="md:hidden p-2 text-[#5D4037]" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>

        <Link href="/" className="shrink-0 transition-transform hover:scale-[1.02] active:scale-95">
          <img 
            src="/pnp.png" 
            alt="PNP Logo" 
            className="h-10 md:h-14 w-auto object-contain" 
          />
        </Link>

        <div className="hidden md:flex flex-1 max-w-2xl relative group">
          <input 
            type="text" 
            placeholder="Search for pickles, masalas, sweets..." 
            className="w-full bg-[#F5F2E9] border border-[#EFEBE1] rounded-full py-2.5 pl-12 pr-4 focus:bg-white focus:border-[#F57C00] focus:ring-4 focus:ring-[#F57C00]/10 transition-all outline-none text-sm font-medium placeholder:text-[#8D6E63]"
          />
          <Search className="absolute left-4 top-2.5 text-[#8D6E63] group-focus-within:text-[#F57C00] transition-colors" size={20} />
        </div>

        <div className="flex items-center gap-3 md:gap-6 shrink-0">
          <Link href={accountLink} className="hidden lg:flex flex-col items-center text-[#5D4037] hover:text-[#F57C00] transition">
            <User size={22} /> <span className="text-[10px] font-bold mt-1 truncate max-w-[60px]">{accountText}</span>
          </Link>
          <Link href="/orders" className="hidden lg:flex flex-col items-center text-[#5D4037] hover:text-[#F57C00] transition">
            <Package size={22} /> <span className="text-[10px] font-bold mt-1">Orders</span>
          </Link>
          
          {/* RESTORED WISHLIST LINK */}
          <Link href="/wishlist" className="hidden sm:flex flex-col items-center text-[#5D4037] hover:text-[#F57C00] transition">
            <Heart size={22} /> <span className="text-[10px] font-bold mt-1">Wishlist</span>
          </Link>
          
          <Link href="/cart" className="relative flex flex-col items-center text-[#5D4037] hover:text-[#F57C00] transition group">
            <div className="relative">
              <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D32F2F] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold mt-1 hidden md:block">Cart</span>
          </Link>
        </div>
      </div>

      <nav className="hidden md:block border-t border-[#EFEBE1] bg-white">
        <div className="max-w-7xl mx-auto px-6 flex justify-center gap-8 py-3">
          {categories.map((cat, idx) => (
            <Link 
              key={idx} 
              href={`/category/${cat.toLowerCase().replace(/ /g, '-')}`}
              className={`text-sm font-bold flex items-center gap-1 transition-colors ${cat === 'Offers' ? 'text-[#D32F2F]' : 'text-[#5D4037] hover:text-[#F57C00]'}`}
            >
              {cat} {cat !== 'Offers' && <ChevronDown size={14} className="opacity-50" />}
            </Link>
          ))}
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="p-4 border-b border-[#EFEBE1] flex justify-between items-center bg-[#FAFAF7]">
              <img src="/pnp.png" alt="PNP Logo" className="h-8 w-auto object-contain" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-[#5D4037] hover:bg-[#EFEBE1] rounded-full transition"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <p className="text-xs font-bold text-[#8D6E63] uppercase tracking-widest mb-2">Categories</p>
              {categories.map((cat, idx) => (
                <Link key={idx} href={`/category/${cat.toLowerCase().replace(/ /g, '-')}`} onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-[#3E2723] font-bold border-b border-[#EFEBE1] last:border-0">{cat}</Link>
              ))}
            </div>
            <div className="p-4 bg-[#FAFAF7] border-t border-[#EFEBE1] grid grid-cols-2 gap-4">
               <Link href={accountLink} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 font-bold text-[#5D4037]"><User size={18}/> {accountText}</Link>
               <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 font-bold text-[#5D4037]"><Package size={18}/> Orders</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}