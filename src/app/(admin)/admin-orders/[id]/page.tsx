'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import { ArrowLeft, Package, User, MapPin, Truck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

type OrderStatus = 'pending' | 'prepping' | 'out_for_delivery' | 'delivered' | 'cancelled';

type DetailedOrder = {
  id: string; created_at: string; total_amount: number; status: OrderStatus; delivery_address: string;
  profiles: { full_name: string; phone_number: string; email: string };
  order_items: { quantity: number; weight_grams: number; price_at_time: number; products: { name: string; github_image_path: string } }[];
};

export default function AdminOrderDetails() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<DetailedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorLog, setErrorLog] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push('/login');
      
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      if (profile?.role !== 'admin') return router.push('/');

      // Safely extract ID from Next.js params
      const orderId = Array.isArray(params.id) ? params.id[0] : params.id;

      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, created_at, total_amount, status, delivery_address,
          profiles ( full_name, phone_number ),
          order_items ( quantity, weight_grams, price_at_time, products ( name, github_image_path ) )
        `)
        .eq('id', orderId)
        .single();

      if (error) {
        console.error("Fetch Error:", error);
        setErrorLog(error.message);
      } else {
        setOrder(data as any);
      }
      setLoading(false);
    };
    fetchOrderDetails();
  }, [params.id, router]);

  const advanceStatus = async (newStatus: OrderStatus) => {
    if (!order) return;
    setActionLoading(true);
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', order.id);
    if (!error) setOrder({ ...order, status: newStatus });
    else alert("Failed to update status: " + error.message);
    setActionLoading(false);
  };

  if (loading) return <div className="min-h-[70vh] flex items-center justify-center"><Loader2 className="animate-spin text-[#F57C00]" size={32}/></div>;
  if (errorLog) return <div className="p-10 text-center font-black text-[#8E1C1C]">Error: {errorLog}</div>;
  if (!order) return <div className="p-10 text-center font-black text-[#8E1C1C]">Order not found.</div>;

  const subtotal = order.order_items.reduce((sum, item) => sum + (item.price_at_time * item.quantity), 0);
  const shipping = order.total_amount - subtotal;

  return (
    <main className="min-h-screen bg-[#FAFAF7] py-8 px-4 font-sans">
      <div className="w-full xl:max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin-orders" className="p-2 bg-white rounded-xl shadow-sm border border-[#EFEBE1] text-[#5D4037] hover:text-[#F57C00] transition">
            <ArrowLeft size={16}/>
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-[#3E2723] uppercase tracking-wider">ORDER #{order.id.split('-')[0]}</h1>
            <p className="text-[#8D6E63] text-[10px] font-bold mt-0.5">{new Date(order.created_at).toLocaleString()}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Status Progression Flow */}
            <div className="bg-white p-5 rounded-2xl border border-[#EFEBE1] shadow-sm">
              <h2 className="text-xs font-black text-[#3E2723] uppercase tracking-widest mb-3">Fulfillment Action</h2>
              
              {order.status === 'cancelled' ? (
                <div className="p-3 bg-red-50 text-red-700 font-bold rounded-xl flex items-center gap-2 text-xs"><AlertCircle size={14}/> Order Cancelled by Admin or Customer</div>
              ) : order.status === 'delivered' ? (
                <div className="p-3 bg-green-50 text-green-700 font-bold rounded-xl flex items-center gap-2 text-xs"><CheckCircle2 size={14}/> Order Successfully Delivered</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => advanceStatus('prepping')} disabled={order.status !== 'pending' || actionLoading}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition border-2 flex justify-center items-center gap-1.5 ${order.status === 'pending' ? 'bg-[#FFF8E1] border-[#FFE082] text-[#F57C00] hover:bg-[#F57C00] hover:text-white' : 'bg-gray-50 border-transparent text-gray-400 opacity-50 cursor-not-allowed'}`}>
                    <Package size={14}/> Mark Packed
                  </button>
                  <button onClick={() => advanceStatus('out_for_delivery')} disabled={order.status !== 'prepping' || actionLoading}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition border-2 flex justify-center items-center gap-1.5 ${order.status === 'prepping' ? 'bg-[#E3F2FD] border-[#90CAF9] text-[#1976D2] hover:bg-[#1976D2] hover:text-white' : 'bg-gray-50 border-transparent text-gray-400 opacity-50 cursor-not-allowed'}`}>
                    <Truck size={14}/> Assign Dispatch
                  </button>
                  <button onClick={() => advanceStatus('delivered')} disabled={order.status !== 'out_for_delivery' || actionLoading}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition border-2 flex justify-center items-center gap-1.5 ${order.status === 'out_for_delivery' ? 'bg-[#E8F5E9] border-[#A5D6A7] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white' : 'bg-gray-50 border-transparent text-gray-400 opacity-50 cursor-not-allowed'}`}>
                    <CheckCircle2 size={14}/> Delivered
                  </button>
                </div>
              )}
              {order.status === 'pending' && (
                 <button onClick={() => advanceStatus('cancelled')} className="mt-3 text-[9px] text-red-500 font-bold hover:underline uppercase tracking-widest">Cancel Order</button>
              )}
            </div>

            {/* Items List */}
            <div className="bg-white p-5 rounded-2xl border border-[#EFEBE1] shadow-sm">
              <h2 className="text-xs font-black text-[#3E2723] uppercase tracking-widest mb-4 border-b border-[#EFEBE1] pb-2">Line Items</h2>
              <div className="space-y-3">
                {order.order_items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <div className="w-10 h-10 bg-[#F5F2E9] rounded-lg border border-[#EFEBE1] overflow-hidden shrink-0">
                      <img src={item.products?.github_image_path} className="w-full h-full object-cover" alt={item.products?.name} onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Img'; }}/>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black text-[#3E2723]">{item.products?.name || 'Unknown Product'}</p>
                      <p className="text-[9px] font-bold text-[#8D6E63] uppercase tracking-widest mt-0.5">{item.weight_grams}g</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-[#8E1C1C]">₹{item.price_at_time}</p>
                      <p className="text-[9px] font-bold text-[#8D6E63] uppercase tracking-widest mt-0.5">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-[#EFEBE1] shadow-sm">
              <h2 className="text-xs font-black text-[#3E2723] uppercase tracking-widest mb-4 border-b border-[#EFEBE1] pb-2">Customer</h2>
              <div className="space-y-2.5 text-xs font-bold text-[#5D4037]">
                <div className="flex items-center gap-2"><User size={14} className="text-[#8D6E63]"/> {order.profiles?.full_name || 'Guest'}</div>
                <div className="flex items-center gap-2"><Package size={14} className="text-[#8D6E63]"/> {order.profiles?.phone_number || 'N/A'}</div>
                <div className="flex items-start gap-2"><MapPin size={14} className="text-[#8D6E63] shrink-0 mt-0.5"/> <span className="leading-tight">{order.delivery_address}</span></div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EFEBE1] shadow-sm">
              <h2 className="text-xs font-black text-[#3E2723] uppercase tracking-widest mb-4 border-b border-[#EFEBE1] pb-2">Payment Summary</h2>
              <div className="space-y-2 text-xs font-bold text-[#8D6E63]">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between"><span>Shipping Fee</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                <div className="border-t border-[#EFEBE1] pt-2 mt-2 flex justify-between items-center text-[#3E2723]">
                  <span className="font-black uppercase tracking-widest text-[10px]">Total Paid</span>
                  <span className="text-lg font-black text-[#8E1C1C]">₹{order.total_amount}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}