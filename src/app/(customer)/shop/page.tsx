'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useCartStore } from '../../../store/cartStore';
import { ShoppingCart, Star, Heart, Filter, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type Product = {
  id: string; name: string; slug: string; price: number;
  weight_grams: number; stock_quantity: number; github_image_path: string;
  offer_percentage: number; is_active: boolean;
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false });
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const calcPrice = (price: number, offer: number) => Math.round(price - (price * (offer / 100)));

  return (
    <main className="min-h-screen bg-[#FAFAF7] pb-24 font-sans">
      {/* Shop Hero */}
      <div className="bg-[#4E342E] py-16 px-6 border-b-8 border-[#F57C00]">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Our Complete Pantry</h1>
          <p className="text-[#D7CCC8] max-w-2xl mx-auto font-medium">Browse our entire collection of authentic, handcrafted Andhra pickles, spice powders, and traditional sweets.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
        
        {/* Desktop Sidebar Filter (Visual) */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white p-6 rounded-2xl border border-[#EFEBE1] sticky top-28">
            <h3 className="font-black text-[#3E2723] mb-4 flex items-center gap-2"><Filter size={18}/> Filters</h3>
            <div className="space-y-3">
              {['All Products', 'Vegetarian Pickles', 'Non-Veg Pickles', 'Powders & Masalas', 'Sweets'].map((cat, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="category" className="w-4 h-4 text-[#F57C00] focus:ring-[#F57C00] border-gray-300" defaultChecked={i===0} />
                  <span className="text-sm font-bold text-[#5D4037] group-hover:text-[#F57C00] transition-colors">{cat}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-80 bg-[#EFEBE1] animate-pulse rounded-2xl"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {products.map((product) => {
                const finalPrice = calcPrice(product.price, product.offer_percentage);
                const isDiscounted = product.offer_percentage > 0;

                return (
                  <div key={product.id} className="group bg-white rounded-2xl border border-[#EFEBE1] shadow-sm hover:shadow-xl hover:border-[#F57C00]/30 transition-all overflow-hidden flex flex-col relative">
                    <div className="aspect-square bg-[#F5F2E9] relative overflow-hidden cursor-pointer" onClick={() => window.location.href = `/product/${product.slug}`}>
                      <img src={product.github_image_path} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/F5F2E9/F57C00?text=Pickle'; }}/>
                      <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-[#8D6E63] hover:text-[#D32F2F] hover:bg-white transition opacity-0 group-hover:opacity-100 hidden md:block"><Heart size={18} /></button>
                      {isDiscounted && <span className="absolute top-3 left-3 bg-[#D32F2F] text-white text-[10px] font-black px-2 py-1 rounded uppercase shadow-sm">{product.offer_percentage}% OFF</span>}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-[10px] font-bold text-[#8D6E63] uppercase tracking-widest mb-1">{product.weight_grams}g Jar</p>
                      <h3 onClick={() => window.location.href = `/product/${product.slug}`} className="font-bold text-[#3E2723] leading-tight mb-2 cursor-pointer hover:text-[#F57C00] line-clamp-2">{product.name}</h3>
                      <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-col">
                          {isDiscounted && <span className="text-[10px] text-[#8D6E63] line-through font-bold">₹{product.price}</span>}
                          <span className="text-lg font-black text-[#8E1C1C]">₹{finalPrice}</span>
                        </div>
                        <button disabled={product.stock_quantity === 0} onClick={() => addItem({ ...product, price: finalPrice })} className="w-full sm:w-auto bg-white border-2 border-[#F57C00] text-[#F57C00] hover:bg-[#F57C00] hover:text-white disabled:border-[#EFEBE1] disabled:text-[#8D6E63] font-black px-4 py-2 rounded-xl transition-all active:scale-95 text-sm">
                          ADD
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}