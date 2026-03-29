'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '../../../store/cartStore';
import { supabase } from '../../../lib/supabase';
import { Trash2, Minus, Plus, ArrowRight, ShieldCheck, Truck, CheckCircle, ShoppingBag, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, addItem, clearCart } = useCartStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => { setIsHydrated(true); }, []);
  if (!isHydrated) return null;

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 60;
  const total = subtotal + shipping;
  const amountToFreeShipping = 999 - subtotal;
  const progressPercentage = Math.min((subtotal / 999) * 100, 100);

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Please login to place an order!");
        return router.push('/login');
      }

      const { data: profile, error: profileError } = await supabase.from('profiles').select('phone_number, address').eq('id', session.user.id).single();
      if (profileError) throw profileError;

      if (!profile.phone_number || !profile.address || profile.address.trim() === '') {
        alert("Please update your Phone Number and Delivery Address in your profile before checking out.");
        return router.push('/account');
      }

      const { data: order, error: orderError } = await supabase.from('orders')
        .insert([{ customer_id: session.user.id, total_amount: total, delivery_address: profile.address, status: 'pending' }])
        .select().single();
      if (orderError) throw orderError;

      const orderItemsPayload = items.map(item => ({
        order_id: order.id, product_id: item.id.substring(0, 36),
        quantity: item.quantity, price_at_time: item.price, weight_grams: item.weight_grams
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload);
      if (itemsError) throw itemsError;

      clearCart();
      setOrderSuccess(true);
    } catch (err: any) {
      console.error(err);
      alert("Checkout failed: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <main className="min-h-[60vh] bg-[#FAFAF7] flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#2E7D32] mb-5 shadow-sm border-[3px] border-white">
          <CheckCircle size={40} />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-[#3E2723] mb-3 text-center">Order Confirmed!</h1>
        <p className="text-[#8D6E63] text-sm font-medium mb-6 text-center max-w-md leading-relaxed">
          Thank you for choosing PNP. We are preparing your traditional recipes now. <br/>
          <strong className="text-[#3E2723]">Our team will reach out to you via Call or WhatsApp shortly to confirm dispatch details.</strong>
        </p>
        <Link href="/orders" className="bg-[#F57C00] text-white text-sm font-black px-6 py-3 rounded-xl shadow-sm hover:bg-[#E65100] transition active:scale-95">
          View My Orders
        </Link>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-[60vh] bg-[#FAFAF7] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-[#F5F2E9] rounded-full flex items-center justify-center text-[#8D6E63] mb-5">
          <ShoppingBag size={28} />
        </div>
        <h1 className="text-2xl font-black text-[#3E2723] mb-3 text-center">Your Bag is Empty</h1>
        <Link href="/shop" className="bg-[#F57C00] text-white text-sm font-black px-6 py-3 rounded-xl shadow-sm hover:bg-[#E65100] transition active:scale-95">Explore Pantry</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAF7] py-6 md:py-8 px-4 lg:px-0 font-sans pb-24 md:pb-8">
      {/* PERFECT RESPONSIVE WRAPPER: 100% width on mobile, 80% width on large desktops */}
      <div className="w-full lg:w-[80%] xl:max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black text-[#3E2723] mb-5 md:mb-6">Review Your Bag</h1>
        
        <div className="grid lg:grid-cols-12 gap-5 md:gap-6">
          <div className="lg:col-span-7 space-y-3">
            
            <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl border border-[#EFEBE1] shadow-sm mb-3 md:mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-[#FFF8E1] rounded-full text-[#F57C00]"><Truck size={14}/></div>
                <p className="font-bold text-[#3E2723] text-xs">
                  {amountToFreeShipping > 0 
                    ? <>Add <span className="text-[#D32F2F]">₹{amountToFreeShipping}</span> more for <strong>Free Shipping!</strong></>
                    : <span className="text-[#2E7D32]">Congratulations! You unlocked Free Shipping.</span>
                  }
                </p>
              </div>
              <div className="w-full bg-[#F5F2E9] rounded-full h-1.5 md:h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-[#F57C00] to-[#E65100] h-1.5 md:h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>

            {items.map((item) => (
              <div key={item.id} className="bg-white p-3 rounded-xl border border-[#EFEBE1] flex gap-3 items-center shadow-sm">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-[#F5F2E9] rounded-lg overflow-hidden shrink-0 border border-[#EFEBE1]">
                  <img src={item.github_image_path} className="w-full h-full object-cover" alt={item.name} onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Img'; }}/>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-[#3E2723] text-xs md:text-sm leading-tight mb-0.5 pr-2">{item.name}</h3>
                      <p className="text-[9px] font-bold text-[#8D6E63] uppercase tracking-widest">{item.weight_grams}g Jar</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-1.5 text-[#8D6E63] hover:text-[#D32F2F] hover:bg-[#D32F2F]/10 rounded-md transition shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center bg-[#F5F2E9] rounded-md p-0.5">
                       <button onClick={() => { if(item.quantity > 1) removeItem(item.id); }} className="p-1 hover:text-[#D32F2F] transition"><Minus size={12}/></button>
                       <span className="font-black text-[#3E2723] w-6 text-center text-xs md:text-sm">{item.quantity}</span>
                       <button onClick={() => addItem({...item, quantity: 1})} className="p-1 hover:text-[#F57C00] transition"><Plus size={12}/></button>
                    </div>
                    <span className="font-black text-[#8E1C1C] text-sm">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-5 md:p-6 rounded-2xl border border-[#EFEBE1] shadow-md sticky top-24">
              <h2 className="text-base md:text-lg font-black text-[#3E2723] mb-4">Order Summary</h2>
              <div className="space-y-2.5 mb-5 text-xs md:text-sm">
                <div className="flex justify-between text-[#5D4037]"><span>Subtotal</span><span className="font-bold">₹{subtotal}</span></div>
                <div className="flex justify-between text-[#5D4037]"><span>Shipping</span><span className="font-bold">{shipping === 0 ? <span className="text-[#2E7D32]">FREE</span> : `₹${shipping}`}</span></div>
                <div className="border-t border-[#EFEBE1] pt-3 flex justify-between items-end">
                  <span className="font-bold text-[#3E2723]">Total Payable</span>
                  <span className="text-xl md:text-2xl font-black text-[#8E1C1C]">₹{total}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout} disabled={isProcessing}
                className="w-full bg-[#8E1C1C] hover:bg-[#B71C1C] text-white text-xs md:text-sm font-black py-3 rounded-xl transition shadow-sm flex items-center justify-center gap-2 active:scale-95 disabled:bg-gray-300 mb-3"
              >
                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : null}
                {isProcessing ? 'CONFIRMING...' : 'PLACE ORDER NOW'}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[9px] md:text-[10px] font-bold text-[#8D6E63] uppercase tracking-widest">
                <ShieldCheck size={14} className="text-[#2E7D32]"/> 100% Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}