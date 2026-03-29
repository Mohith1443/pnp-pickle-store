'use client';

import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import { useCartStore } from '../../../../store/cartStore';
import { 
  ArrowLeft, ShoppingCart, Flame, ShieldCheck, Truck, 
  CheckCircle2, Star, Minus, Plus, Zap, Heart, ThumbsUp
} from 'lucide-react';

type Product = {
  id: string; name: string; price: number; weight_grams: number;
  stock_quantity: number; github_image_path: string; github_description_path: string;
  offer_percentage: number;
};

const VARIANTS = [
  { weight: 250, label: '250g', multiplier: 0.55 },
  { weight: 500, label: '500g', multiplier: 1, popular: true },
  { weight: 1000, label: '1kg', multiplier: 1.85, save: 'Save 15%' }
];

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });
  
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(VARIANTS[1]);
  const [activeTab, setActiveTab] = useState<'desc' | 'ingredients' | 'reviews'>('desc');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => { fetchProductDetails(); }, [slug]);

  const fetchProductDetails = async () => {
    const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
    if (error || !data) return router.push('/');

    setProduct(data);
    try {
      const res = await fetch(data.github_description_path);
      setDescription(await res.text());
    } catch (e) { setDescription("Authentic homemade pickle made with premium ingredients."); }
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (!product) return;
    const baseVariantPrice = product.price * selectedVariant.multiplier;
    const finalPrice = Math.round(baseVariantPrice - (baseVariantPrice * (product.offer_percentage / 100)));
    
    addItem({ 
      ...product, 
      price: finalPrice, 
      weight_grams: selectedVariant.weight,
      quantity: quantity,
      id: `${product.id}-${selectedVariant.weight}`
    });
    
    setToast({ show: true, msg: `Added ${quantity}x ${product.name} to bag!` });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
    setQuantity(1);
  };

  if (loading || !product) return <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7] font-black text-[#F57C00] animate-pulse text-xs tracking-widest uppercase">Fetching Secret Recipe...</div>;

  const baseVariantPrice = product.price * selectedVariant.multiplier;
  const finalPrice = Math.round(baseVariantPrice - (baseVariantPrice * (product.offer_percentage / 100)));
  const isDiscounted = product.offer_percentage > 0;

  const gallery = [
    product.github_image_path,
    'https://images.unsplash.com/photo-1596683788737-142f1f544bc3?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1627308595229-7830f5c92f70?auto=format&fit=crop&q=80&w=400'
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#3E2723] pb-24 md:pb-12 font-sans">
      
      {/* Toast Notification */}
      <div className={`fixed top-20 right-4 z-[100] transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-[#2E7D32] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
          <CheckCircle2 size={16} /> {toast.msg}
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div className="w-full lg:w-[85%] xl:max-w-5xl mx-auto px-4 lg:px-0">
        
        {/* Navigation */}
        <nav className="py-4">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-[#8D6E63] hover:text-[#F57C00] transition font-bold text-[10px] uppercase tracking-widest">
            <ArrowLeft size={12} /> Back to Shop
          </button>
        </nav>

        {/* Above the Fold Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
          
          {/* LEFT: Compact Gallery */}
          <div className="lg:col-span-5 space-y-3">
            <div className="rounded-2xl md:rounded-3xl overflow-hidden bg-white border border-[#EFEBE1] aspect-square relative shadow-sm">
              <img src={gallery[activeImage]} alt={product.name} className="w-full h-full object-cover" />
              <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full text-[#8D6E63] hover:text-[#D32F2F] transition shadow-sm border border-[#EFEBE1]">
                <Heart size={18} />
              </button>
              {isDiscounted && (
                <div className="absolute top-3 left-3 bg-[#D32F2F] text-white text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest shadow-sm">
                  {product.offer_percentage}% OFF
                </div>
              )}
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {gallery.map((img, idx) => (
                <button key={idx} onClick={() => setActiveImage(idx)} className={`w-14 h-14 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-[#F57C00] scale-105' : 'border-transparent opacity-60'}`}>
                  <img src={img} className="w-full h-full object-cover" alt="thumb"/>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Compact Info Panel */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="mb-4">
              <p className="text-[9px] font-black text-[#F57C00] uppercase tracking-[0.2em] mb-1 flex items-center gap-1">
                <ShieldCheck size={12}/> Traditional Recipe
              </p>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-[#3E2723] leading-tight mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-[#FFF8E1] px-2 py-0.5 rounded-full border border-[#FFE082]">
                  <Star size={10} fill="#F57C00" color="#F57C00" className="mr-1"/>
                  <span className="text-[10px] font-black text-[#3E2723]">4.8 / 5</span>
                </div>
                <span className="text-[10px] font-bold text-[#8D6E63] underline underline-offset-2 hover:text-[#F57C00] cursor-pointer">128 Reviews</span>
              </div>
            </div>

            <div className="mb-5 flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-black text-[#8E1C1C]">₹{finalPrice}</span>
              {isDiscounted && (
                <>
                  <span className="text-[#8D6E63] line-through font-bold text-sm">₹{Math.round(baseVariantPrice)}</span>
                  <span className="text-[#2E7D32] font-black text-[10px] uppercase ml-1">Save ₹{Math.round(baseVariantPrice) - finalPrice}</span>
                </>
              )}
            </div>

            {/* Variant Selector */}
            <div className="mb-5">
              <p className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest mb-2">Net Weight</p>
              <div className="grid grid-cols-3 gap-2">
                {VARIANTS.map((v) => (
                  <button key={v.label} onClick={() => setSelectedVariant(v)} 
                    className={`relative py-2.5 rounded-xl border-2 text-xs font-black transition-all ${selectedVariant.label === v.label ? 'border-[#F57C00] bg-[#FFF8E1] text-[#F57C00]' : 'border-[#EFEBE1] bg-white text-[#5D4037] hover:border-[#F57C00]/40'}`}>
                    {v.popular && <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#FBC02D] text-[#3E2723] text-[7px] uppercase px-1 rounded shadow-sm whitespace-nowrap">Popular</span>}
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5 mb-6">
              <div className="flex items-center justify-between bg-[#F5F2E9] rounded-xl p-1 sm:w-24 h-10">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 text-[#8D6E63] hover:text-[#F57C00] transition"><Minus size={14}/></button>
                <span className="font-black text-sm">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-1 text-[#8D6E63] hover:text-[#F57C00] transition"><Plus size={14}/></button>
              </div>

              <div className="flex-1 flex gap-2">
                <button onClick={handleAddToCart} className="flex-1 bg-white border-2 border-[#F57C00] text-[#F57C00] text-[11px] font-black rounded-xl h-10 hover:bg-[#FFF8E1] transition-all flex items-center justify-center gap-1.5 active:scale-95">
                  <ShoppingCart size={14} /> ADD TO BAG
                </button>
                <button onClick={() => { handleAddToCart(); /* router.push('/cart'); */ }} className="flex-1 bg-[#F57C00] text-white text-[11px] font-black rounded-xl h-10 hover:bg-[#E65100] transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95">
                  <Zap size={14} className="fill-white" /> BUY NOW
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-white p-3 rounded-xl border border-[#EFEBE1] space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-[#8E1C1C]">
                <Flame size={14} className="animate-pulse"/>
                <span>Limited Batch: Only {product.stock_quantity < 10 ? product.stock_quantity : 'few'} left today.</span>
              </div>
              <div className="h-px bg-[#FAFAF7]"></div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-[#5D4037]">
                <Truck size={14} className="text-[#F57C00]"/>
                <span>Fast Dispatch: Order in 2 hours for same-day shipping.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Storytelling Section */}
        <section className="mt-10">
          <div className="bg-[#4E342E] rounded-3xl overflow-hidden flex flex-col md:flex-row items-stretch border-4 border-white shadow-sm">
            <div className="p-6 md:p-10 text-white md:w-3/5">
              <h3 className="text-xl md:text-2xl font-black mb-3">Grandma's recipe, no assembly lines.</h3>
              <p className="text-[#D7CCC8] text-xs md:text-sm font-medium leading-relaxed mb-6">
                Every jar of {product.name} is handcrafted by village artisans using techniques passed down for generations. Sun-dried, hand-pounded, and perfectly aged.
              </p>
              <div className="grid grid-cols-2 gap-4 text-[10px] font-black uppercase tracking-widest text-[#FFCC80]">
                <div className="flex items-center gap-2"><CheckCircle2 size={12}/> Zero Chemicals</div>
                <div className="flex items-center gap-2"><CheckCircle2 size={12}/> Natural Oils</div>
              </div>
            </div>
            <div className="md:w-2/5 min-h-[200px] relative">
              <img src="https://greenkitchenstories.com/wp-content/uploads/2018/01/GKS_meal_prep_2a-800x1131.jpg" className="absolute inset-0 w-full h-full object-cover" alt="Kitchen"/>
              <div className="absolute inset-0 bg-gradient-to-r from-[#4E342E] via-transparent to-transparent"></div>
            </div>
          </div>
        </section>

        {/* Tabs Area */}
        <section className="mt-10">
          <div className="flex gap-6 border-b border-[#EFEBE1] mb-6 px-2">
            {[
              { id: 'desc', label: 'Story' },
              { id: 'ingredients', label: 'What\'s Inside' },
              { id: 'reviews', label: 'Reviews' }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} 
                className={`pb-2 text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'text-[#8E1C1C] border-b-2 border-[#F57C00]' : 'text-[#8D6E63] hover:text-[#3E2723]'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#EFEBE1] min-h-[200px]">
            {activeTab === 'desc' && (
              <div className="prose prose-sm prose-orange max-w-none text-xs md:text-sm leading-relaxed text-[#5D4037]">
                <ReactMarkdown>{description}</ReactMarkdown>
              </div>
            )}
            {activeTab === 'ingredients' && (
              <div className="space-y-4">
                <div className="bg-[#FAFAF7] p-4 rounded-xl border border-[#EFEBE1]">
                  <p className="text-xs font-bold text-[#5D4037] leading-relaxed">
                    Premium Sun-Dried Material, Guntur Red Chilli, Cold-Pressed Groundnut Oil, Crystal Sea Salt, and Ancient Spices.
                    <span className="block mt-2 text-[#D32F2F] font-black uppercase text-[10px]">No Synthetic Vinegar or Colors.</span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border border-[#EFEBE1] rounded-xl"><p className="text-[9px] font-bold text-[#8D6E63] uppercase mb-1">Shelf Life</p><p className="text-xs font-black text-[#3E2723]">6 Months</p></div>
                  <div className="p-3 border border-[#EFEBE1] rounded-xl"><p className="text-[9px] font-bold text-[#8D6E63] uppercase mb-1">Storage</p><p className="text-xs font-black text-[#3E2723]">Dry Spoon Only</p></div>
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="border-b border-[#F5F2E9] pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-black text-xs text-[#3E2723]">Rohit S. <span className="text-[9px] text-[#2E7D32] ml-1 uppercase">Verified Buyer</span></p>
                    <div className="flex gap-0.5"><Star size={8} fill="#F57C00" color="#F57C00"/><Star size={8} fill="#F57C00" color="#F57C00"/><Star size={8} fill="#F57C00" color="#F57C00"/><Star size={8} fill="#F57C00" color="#F57C00"/><Star size={8} fill="#F57C00" color="#F57C00"/></div>
                  </div>
                  <p className="text-xs italic text-[#5D4037]">"Authentic taste. Reminds me of my hometown pickles. The spice level is just right."</p>
                </div>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* Mobile Sticky Bar - Fixed Scale */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-[#EFEBE1] p-3 pb-safe z-50 flex items-center justify-between shadow-[0_-8px_20px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col">
          <span className="text-xs text-[#8D6E63] line-through font-bold">₹{Math.round(baseVariantPrice)}</span>
          <span className="text-xl font-black text-[#8E1C1C] leading-none">₹{finalPrice}</span>
          <span className="text-[8px] font-black text-[#F57C00] uppercase mt-1 tracking-widest">{selectedVariant.label} Jars</span>
        </div>
        <button disabled={product.stock_quantity === 0} onClick={handleAddToCart} className="bg-[#F57C00] text-white text-xs font-black px-6 py-2.5 rounded-xl active:scale-95 flex items-center gap-2">
          <ShoppingCart size={14}/> {product.stock_quantity === 0 ? 'SOLD OUT' : 'ADD TO BAG'}
        </button>
      </div>

    </div>
  );
}