'use client';

import { Send, MessageCircle } from 'lucide-react';
import ContactInfo from '../../../components/shared/ContactInfo';
import { businessConfig } from '../../../config/business';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent! Our family will get back to you shortly.");
  };

  const handleWhatsApp = () => {
    const waNumber = businessConfig.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${waNumber}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-[#FAFAF7] py-6 md:py-10 px-4 lg:px-0 font-sans">
      <div className="w-full lg:w-[80%] xl:max-w-5xl mx-auto">
        
        <div className="text-center mb-8">
          <h1 className="text-xl md:text-2xl font-black text-[#3E2723] mb-2">We'd love to hear from you</h1>
          <p className="text-[#8D6E63] text-xs md:text-sm font-medium max-w-lg mx-auto">Whether you have a question about our recipes, shipping, or bulk orders, our family is here to help.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 md:gap-6">
          
          {/* Left Side: Dynamic Shared Component */}
          <div className="lg:col-span-1 space-y-4">
            <ContactInfo />
            
            <button onClick={handleWhatsApp} className="w-full bg-[#25D366] hover:bg-[#1EBE55] text-white font-black py-3 rounded-xl transition shadow-sm flex items-center justify-center gap-2 active:scale-95">
              <MessageCircle size={18} className="fill-white"/>
              <span className="text-xs md:text-sm">Chat on WhatsApp</span>
            </button>
          </div>

          {/* Right Side: Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-[#EFEBE1]">
            <h2 className="text-lg md:text-xl font-black text-[#3E2723] mb-4">Send a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-[#5D4037] mb-1.5 uppercase tracking-widest">Full Name</label>
                  <input type="text" required className="w-full bg-[#F5F2E9] border border-transparent focus:bg-white focus:border-[#F57C00] focus:ring-2 focus:ring-[#F57C00]/10 rounded-xl px-3 py-2 outline-none transition text-xs md:text-sm text-[#3E2723] font-bold" placeholder="Ramesh Kumar"/>
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-[#5D4037] mb-1.5 uppercase tracking-widest">Email Address</label>
                  <input type="email" required className="w-full bg-[#F5F2E9] border border-transparent focus:bg-white focus:border-[#F57C00] focus:ring-2 focus:ring-[#F57C00]/10 rounded-xl px-3 py-2 outline-none transition text-xs md:text-sm text-[#3E2723] font-bold" placeholder="ramesh@example.com"/>
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] md:text-xs font-bold text-[#5D4037] mb-1.5 uppercase tracking-widest">Subject</label>
                <select className="w-full bg-[#F5F2E9] border border-transparent focus:bg-white focus:border-[#F57C00] focus:ring-2 focus:ring-[#F57C00]/10 rounded-xl px-3 py-2 outline-none transition text-xs md:text-sm text-[#5D4037] font-bold cursor-pointer">
                  <option>Where is my order?</option>
                  <option>Product Inquiry</option>
                  <option>Bulk / Corporate Order</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] md:text-xs font-bold text-[#5D4037] mb-1.5 uppercase tracking-widest">Your Message</label>
                <textarea required rows={4} className="w-full bg-[#F5F2E9] border border-transparent focus:bg-white focus:border-[#F57C00] focus:ring-2 focus:ring-[#F57C00]/10 rounded-xl px-3 py-2 outline-none transition resize-none text-xs md:text-sm text-[#3E2723] font-bold" placeholder="How can we help you today?"></textarea>
              </div>
              
              <button type="submit" className="bg-[#8E1C1C] hover:bg-[#B71C1C] text-white text-xs md:text-sm font-black px-6 py-2.5 rounded-xl transition shadow-sm flex items-center justify-center gap-2 w-full md:w-auto active:scale-95">
                <Send size={14}/> Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}