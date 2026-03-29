'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Camera, Globe, PlayCircle, ChevronDown } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const FooterAccordion = ({ title, id, children }: { title: string, id: string, children: React.ReactNode }) => (
    <div className="border-b border-white/10 md:border-none py-4 md:py-0">
      <button onClick={() => toggleSection(id)} className="flex justify-between items-center w-full md:cursor-default md:pointer-events-none text-left">
        <h4 className="text-white font-bold tracking-wide uppercase text-sm">{title}</h4>
        <ChevronDown size={18} className={`md:hidden transition-transform ${openSection === id ? 'rotate-180 text-[#F57C00]' : 'text-gray-400'}`} />
      </button>
      <div className={`mt-4 space-y-2 md:block ${openSection === id ? 'block' : 'hidden'}`}>
        {children}
      </div>
    </div>
  );

  return (
    <footer className="bg-[#2D1B15] text-[#D7CCC8] pt-16 pb-8 border-t-[6px] border-[#8E1C1C]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block group">
              <img 
                src="/pnp.png" 
                alt="PNP Logo" 
                className="h-12 md:h-16 w-auto object-contain brightness-0 invert transition-opacity group-hover:opacity-80" 
              />
              <p className="text-[10px] text-[#F57C00] font-black uppercase tracking-[0.2em] mt-2">
                Pachadlu and Pindivantalu
              </p>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm">
              Authentic homemade pickles, masalas, and sweets crafted using traditional Andhra recipes. Bringing the warmth of a grandmother's kitchen to your dining table.
            </p>
            <div className="flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-widest">
              <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[#FFCC80]">100% Homemade</span>
              <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[#FFCC80]">No Preservatives</span>
            </div>
          </div>

          <FooterAccordion title="Quick Links" id="quick">
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-[#F57C00] transition">Home</Link></li>
              <li><Link href="/shop" className="hover:text-[#F57C00] transition">Shop All</Link></li>
              <li><Link href="/about" className="hover:text-[#F57C00] transition">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-[#F57C00] transition">Contact Us</Link></li>
            </ul>
          </FooterAccordion>

          <FooterAccordion title="Support" id="support">
            <ul className="space-y-2 text-sm">
              <li><Link href="/track-order" className="hover:text-[#F57C00] transition">Track Order</Link></li>
              <li><Link href="/shipping" className="hover:text-[#F57C00] transition">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-[#F57C00] transition">Returns & Refunds</Link></li>
              <li><Link href="/privacy" className="hover:text-[#F57C00] transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#F57C00] transition">Terms of Use</Link></li>
            </ul>
          </FooterAccordion>

          <div className="space-y-6">
            <h4 className="text-white font-bold tracking-wide uppercase text-sm">Get in Touch</h4>
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-3"><Mail size={16} className="text-[#F57C00]"/> support@pnpfoods.com</p>
              <p className="flex items-center gap-3"><Phone size={16} className="text-[#F57C00]"/> +91 98765 43210</p>
              <p className="flex items-start gap-3"><MapPin size={16} className="text-[#F57C00] shrink-0 mt-1"/> Guntur, Andhra Pradesh, India</p>
            </div>

            <div className="pt-4">
              <h4 className="text-white font-bold text-xs mb-3 uppercase tracking-widest">Subscribe</h4>
              {subscribed ? (
                <div className="bg-[#4CAF50]/20 text-[#81C784] p-3 rounded-lg text-xs font-bold border border-[#4CAF50]/30 text-center">Subscribed!</div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex relative">
                  <input type="email" placeholder="Email address" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-4 pr-16 text-xs text-white focus:outline-none focus:border-[#F57C00] transition" />
                  <button type="submit" className="absolute right-1 top-1 bottom-1 bg-[#F57C00] hover:bg-[#E65100] text-white font-bold px-3 rounded-lg text-[10px] transition uppercase">Join</button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-white/50">© {new Date().getFullYear()} PNP - Pachadlu and Pindivantalu. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#F57C00] transition-colors"><Camera size={16} /></a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D32F2F] transition-colors"><PlayCircle size={16} /></a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#1976D2] transition-colors"><Globe size={16} /></a>
          </div>
        </div>

      </div>
    </footer>
  );
}