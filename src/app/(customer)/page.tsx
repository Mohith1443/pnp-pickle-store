'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useCartStore } from '../../store/cartStore';
import { PlayCircle, Star, ChevronRight, Heart, ShieldCheck, CheckCircle2 } from 'lucide-react';

type Product = {
  id: string; name: string; slug: string; price: number;
  weight_grams: number; stock_quantity: number; github_image_path: string;
  offer_percentage: number; is_active: boolean;
};

export default function StorefrontPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });
  
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false });
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product, finalPrice: number) => {
    addItem({ ...product, price: finalPrice });
    setToast({ show: true, msg: `Added ${product.name} to bag!` });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  const calcPrice = (price: number, offer: number) => Math.round(price - (price * (offer / 100)));

  return (
    <>
      <div className={`fixed top-24 right-4 z-[100] transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-[#2E7D32] text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-bold">
          <CheckCircle2 size={20} /> {toast.msg}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        
        <section className="relative rounded-3xl overflow-hidden bg-[#4E342E] text-white flex flex-col md:flex-row shadow-2xl">
          <div className="p-8 md:p-12 flex-1 z-10 flex flex-col justify-center">
            <span className="inline-block bg-[#FBC02D] text-[#4E342E] text-xs font-black px-3 py-1 rounded-full w-fit mb-4 tracking-widest uppercase">100% Homemade</span>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
              Authentic Andhra Pickles <br/> <span className="text-[#FFCC80]">Made Fresh Daily.</span>
            </h1>
            <p className="text-[#D7CCC8] mb-8 max-w-md font-medium">Sun-dried, cold-pressed oils, and spices pounded by hand. Taste the legacy of Guntur in every bite.</p>
            <div className="flex gap-4">
              <button className="bg-[#F57C00] hover:bg-[#EF6C00] text-white font-black px-8 py-4 rounded-full transition shadow-lg shadow-[#F57C00]/30">Shop Best Sellers</button>
            </div>
            <div className="mt-8 flex items-center gap-2 text-sm font-bold text-[#FFCC80]">
              <div className="flex"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
              <span>4.9★ Rated by 10,000+ Indians</span>
            </div>
          </div>
          <div className="hidden md:block w-1/2 relative">
            <img src="https://5.imimg.com/data5/ANDROID/Default/2023/11/364711143/AL/SH/XG/53059877/product-jpeg-500x500.jpg" alt="Spices" className="absolute inset-0 w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#4E342E] to-transparent"></div>
          </div>
        </section>

        <section>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {['🥭 Mango Specials', '🍗 Chicken & Meat', '🧄 Garlic Lovers', '🔥 Ultra Spicy', '🎁 Combo Packs', '🍯 Sweet Cravings'].map((cat, i) => (
              <button key={i} className="shrink-0 bg-white border border-[#EFEBE1] rounded-full px-6 py-3 font-bold text-[#5D4037] hover:border-[#F57C00] hover:text-[#F57C00] shadow-sm transition snap-start">{cat}</button>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-black text-[#3E2723]">Trending Now</h2>
              <div className="w-16 h-1.5 bg-[#F57C00] rounded-full mt-2"></div>
            </div>
            <button className="hidden sm:flex items-center gap-1 font-bold text-[#F57C00] hover:underline">View All <ChevronRight size={20}/></button>
          </div>

          {loading ? (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
               {[1,2,3,4].map(i => <div key={i} className="h-80 bg-[#EFEBE1] animate-pulse rounded-2xl"></div>)}
             </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => {
                const finalPrice = calcPrice(product.price, product.offer_percentage);
                const isDiscounted = product.offer_percentage > 0;

                return (
                  <div key={product.id} className="group bg-white rounded-2xl border border-[#EFEBE1] shadow-sm hover:shadow-xl hover:border-[#F57C00]/30 transition-all overflow-hidden flex flex-col relative">
                    <div className="aspect-square bg-[#F5F2E9] relative overflow-hidden cursor-pointer" onClick={() => window.location.href = `/product/${product.slug}`}>
                      <img src={product.github_image_path} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/F5F2E9/F57C00?text=Pickle'; }}/>
                      <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-[#8D6E63] hover:text-[#D32F2F] hover:bg-white transition opacity-0 group-hover:opacity-100 hidden md:block"><Heart size={18} /></button>
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {isDiscounted && <span className="bg-[#D32F2F] text-white text-[10px] font-black px-2 py-1 rounded uppercase shadow-sm">{product.offer_percentage}% OFF</span>}
                        {product.stock_quantity < 15 && product.stock_quantity > 0 && <span className="bg-[#FBC02D] text-[#4E342E] text-[9px] font-black px-2 py-1 rounded uppercase shadow-sm">Fast Selling</span>}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-[10px] font-bold text-[#8D6E63] uppercase tracking-widest mb-1">{product.weight_grams}g Jar</p>
                      <h3 onClick={() => window.location.href = `/product/${product.slug}`} className="font-bold text-[#3E2723] leading-tight mb-2 cursor-pointer hover:text-[#F57C00] line-clamp-2">{product.name}</h3>
                      <div className="flex items-center gap-1 mb-3">
                        <Star size={12} fill="#F57C00" color="#F57C00"/><Star size={12} fill="#F57C00" color="#F57C00"/><Star size={12} fill="#F57C00" color="#F57C00"/><Star size={12} fill="#F57C00" color="#F57C00"/><Star size={12} fill="#F57C00" color="#F57C00"/>
                        <span className="text-xs text-[#8D6E63] font-medium ml-1">(120)</span>
                      </div>
                      <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-col">
                          {isDiscounted && <span className="text-[10px] text-[#8D6E63] line-through font-bold">₹{product.price}</span>}
                          <span className="text-lg font-black text-[#8E1C1C]">₹{finalPrice}</span>
                        </div>
                        <button disabled={product.stock_quantity === 0} onClick={() => handleAddToCart(product, finalPrice)} className="w-full sm:w-auto bg-white border-2 border-[#F57C00] text-[#F57C00] hover:bg-[#F57C00] hover:text-white disabled:border-[#EFEBE1] disabled:text-[#8D6E63] font-black px-4 py-2 rounded-xl transition-all active:scale-95 text-sm">
                          {product.stock_quantity === 0 ? 'SOLD OUT' : 'ADD'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="bg-[#FFF8E1] rounded-3xl p-6 md:p-12 border border-[#FFE082] flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/2 relative rounded-2xl overflow-hidden aspect-video group cursor-pointer shadow-xl">
            <img src="https://images.unsplash.com/photo-1596683788737-142f1f544bc3?q=80&w=1000&auto=format&fit=crop" alt="Traditional Kitchen" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 group-hover:bg-[#F57C00] transition">
                <PlayCircle size={32} className="text-white" />
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-black text-[#3E2723] mb-6">Not a factory.<br/>A family kitchen.</h2>
            <ul className="space-y-4">
              {['Handpicked Guntur Sannam Chillies', 'Pure cold-pressed groundnut & sesame oil', 'Zero artificial colors or preservatives', 'Sun-dried naturally for weeks'].map((text, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-[#5D4037]"><div className="bg-[#4CAF50]/10 p-1.5 rounded-full text-[#2E7D32]"><CheckCircle2 size={18}/></div> {text}</li>
              ))}
            </ul>
            <button className="mt-8 font-black text-[#8E1C1C] hover:text-[#F57C00] flex items-center gap-2 uppercase tracking-widest text-sm">Read Our Story <ChevronRight size={18}/></button>
          </div>
        </section>

      </main>
    </>
  );
}