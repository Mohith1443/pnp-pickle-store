import { ShieldCheck, Sun, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF7] pb-12 font-sans">
      
      {/* Compact Hero */}
      <section className="bg-[#4E342E] text-white py-10 md:py-12 px-4 text-center border-b-4 border-[#F57C00]">
        <h1 className="text-2xl md:text-3xl font-black mb-3 tracking-tight">From Our Family to Yours</h1>
        <p className="text-[#D7CCC8] text-xs md:text-sm max-w-xl mx-auto font-medium leading-relaxed">
          PNP - Pachadluandpindivantalu was born out of a simple desire: to preserve the authentic, fiery, and deeply comforting taste of traditional Andhra recipes before they are lost to mass production.
        </p>
      </section>

      {/* Main Content */}
      <section className="w-full lg:w-[80%] xl:max-w-5xl mx-auto px-4 lg:px-0 py-8 md:py-12 grid md:grid-cols-2 gap-8 items-center">
        
        <div className="aspect-square md:aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden bg-[#EFEBE1] shadow-sm border-4 border-white max-h-[400px] mx-auto w-full">
          <img src="https://images.unsplash.com/photo-1596683788737-142f1f544bc3?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Making Pickles"/>
        </div>
        
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#EFEBE1] shadow-sm">
          <h2 className="text-xl md:text-2xl font-black text-[#3E2723] mb-6 border-b border-[#EFEBE1] pb-3">The No-Compromise Kitchen</h2>
          
          <div className="space-y-5">
            <div className="flex gap-3">
              <div className="mt-0.5 bg-[#FFF8E1] p-2 rounded-xl h-fit text-[#F57C00] shrink-0 border border-[#FFE082]"><Sun size={16}/></div>
              <div>
                <h3 className="text-sm md:text-base font-black text-[#8E1C1C] mb-1">Sun-Dried, Not Baked</h3>
                <p className="text-[#5D4037] text-xs font-medium leading-relaxed">We naturally sun-dry our ingredients for weeks. It takes longer, but it's the only way to lock in that deep, authentic flavor.</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="mt-0.5 bg-[#FFF8E1] p-2 rounded-xl h-fit text-[#F57C00] shrink-0 border border-[#FFE082]"><ShieldCheck size={16}/></div>
              <div>
                <h3 className="text-sm md:text-base font-black text-[#8E1C1C] mb-1">Zero Preservatives</h3>
                <p className="text-[#5D4037] text-xs font-medium leading-relaxed">We use premium cold-pressed sesame and groundnut oils as natural preservatives, completely avoiding synthetic vinegars and chemicals.</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="mt-0.5 bg-[#FFF8E1] p-2 rounded-xl h-fit text-[#F57C00] shrink-0 border border-[#FFE082]"><Users size={16}/></div>
              <div>
                <h3 className="text-sm md:text-base font-black text-[#8E1C1C] mb-1">Empowering Local Women</h3>
                <p className="text-[#5D4037] text-xs font-medium leading-relaxed">Our kitchen is entirely run by skilled women from local villages who are masters of these ancestral recipes.</p>
              </div>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}