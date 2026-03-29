'use client';

import { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, Search, Loader2, Clock, XCircle, MapPin } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';

type OrderItem = {
  quantity: number; weight_grams: number; price_at_time: number;
  products: { name: string; github_image_path: string; };
};

type Order = {
  id: string; created_at: string; total_amount: number; delivery_address: string;
  status: 'pending' | 'prepping' | 'out_for_delivery' | 'delivered' | 'cancelled';
  order_items: OrderItem[];
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push('/login');

      const { data } = await supabase.from('orders').select(`
          id, created_at, status, total_amount, delivery_address,
          order_items ( quantity, weight_grams, price_at_time, products ( name, github_image_path ) )
        `).eq('customer_id', session.user.id).order('created_at', { ascending: false });
      
      setOrders((data as any) || []);
      setLoading(false);
    };
    fetchOrders();
  }, [router]);

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.order_items.some(item => item.products.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusDisplay = (status: Order['status']) => {
    switch (status) {
      case 'delivered': return <div className="flex items-center gap-1.5 text-[#2E7D32] font-black text-sm md:text-base"><CheckCircle2 size={16}/> Delivered</div>;
      case 'out_for_delivery': return <div className="flex items-center gap-1.5 text-[#F57C00] font-black text-sm md:text-base"><Truck size={16}/> Out for Delivery</div>;
      case 'prepping': return <div className="flex items-center gap-1.5 text-[#F57C00] font-black text-sm md:text-base"><Package size={16}/> Preparing Order</div>;
      case 'cancelled': return <div className="flex items-center gap-1.5 text-[#D32F2F] font-black text-sm md:text-base"><XCircle size={16}/> Cancelled</div>;
      default: return <div className="flex items-center gap-1.5 text-[#8D6E63] font-black text-sm md:text-base"><Clock size={16}/> Pending</div>;
    }
  };

  if (loading) return (
    <div className="min-h-[70vh] bg-[#FAFAF7] flex flex-col items-center justify-center text-[#F57C00]">
      <Loader2 size={32} className="animate-spin mb-3" />
      <p className="font-black tracking-widest uppercase text-xs">Fetching Order History...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FAFAF7] py-6 md:py-8 px-4 lg:px-0 font-sans">
      <div className="w-full lg:w-[75%] xl:max-w-5xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-5 md:mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#3E2723]">Order History</h1>
            <p className="text-[#8D6E63] text-xs md:text-sm font-medium mt-1">Track or buy your favorite recipes again.</p>
          </div>
          <div className="relative w-full md:w-64">
            <input 
              type="text" placeholder="Search orders..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#EFEBE1] rounded-xl py-2.5 pl-9 pr-4 text-sm font-bold outline-none focus:border-[#F57C00] transition shadow-sm" 
            />
            <Search size={16} className="absolute left-3 top-3 text-[#8D6E63]" />
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#EFEBE1] shadow-sm">
            <div className="w-14 h-14 bg-[#F5F2E9] rounded-full flex items-center justify-center text-[#8D6E63] mx-auto mb-3"><Package size={20} /></div>
            <h3 className="text-lg font-black text-[#3E2723] mb-1">No orders yet</h3>
            <p className="text-[#5D4037] text-xs mb-5">When you place an order, your tracking details will appear here.</p>
            <Link href="/shop" className="bg-[#F57C00] text-white text-xs md:text-sm font-black px-5 py-2.5 rounded-xl hover:bg-[#E65100] transition inline-flex items-center gap-2">
              Start Shopping
            </Link>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-10 text-sm text-[#8D6E63] font-bold">No orders found matching "{searchQuery}".</div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-[#EFEBE1] shadow-sm overflow-hidden transition-all hover:shadow-md">
                
                <div className="bg-[#F5F2E9] py-2.5 px-4 border-b border-[#EFEBE1] flex flex-wrap gap-4 justify-between items-center">
                  <div className="flex gap-4 md:gap-6">
                    <div>
                      <p className="text-[9px] font-bold text-[#8D6E63] uppercase tracking-widest mb-0.5">Order Placed</p>
                      <p className="font-black text-[#3E2723] text-xs md:text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-[#8D6E63] uppercase tracking-widest mb-0.5">Total</p>
                      <p className="font-black text-[#3E2723] text-xs md:text-sm">₹{order.total_amount}</p>
                    </div>
                  </div>
                  <div className="text-left md:text-right w-full md:w-auto">
                    <p className="text-[9px] font-bold text-[#8D6E63] uppercase tracking-widest mb-0.5">Order ID</p>
                    <p className="font-black text-[#3E2723] text-xs uppercase tracking-wider">{order.id.split('-')[0]}</p>
                  </div>
                </div>

                <div className="p-4 md:p-5 flex flex-col lg:flex-row gap-5 justify-between">
                  <div className="flex-1 space-y-3 md:space-y-4">
                    {getStatusDisplay(order.status)}
                    
                    <div className="space-y-2.5">
                      {order.order_items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-[#F5F2E9] rounded-lg border border-[#EFEBE1] overflow-hidden shrink-0">
                             <img src={item.products.github_image_path} className="w-full h-full object-cover" alt={item.products.name} onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Item'; }}/>
                          </div>
                          <div>
                            <p className="font-bold text-[#3E2723] text-xs md:text-sm line-clamp-1">{item.products.name}</p>
                            <p className="text-[9px] md:text-[10px] font-bold text-[#8D6E63] mt-0.5">Qty: {item.quantity} • {item.weight_grams}g • ₹{item.price_at_time}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 md:pt-3 mt-2 md:mt-3 border-t border-[#EFEBE1] flex items-start gap-1.5">
                      <MapPin size={14} className="text-[#8D6E63] shrink-0 mt-0.5"/>
                      <p className="text-[10px] md:text-[11px] font-bold text-[#8D6E63] leading-relaxed">
                        Delivering to: <span className="text-[#5D4037]">{order.delivery_address}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-row lg:flex-col gap-2 shrink-0 lg:w-40 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#EFEBE1] lg:justify-center">
                    <Link href={`/track-order?id=${order.id}`} className="flex-1 lg:flex-none text-center bg-[#FFF8E1] border-2 border-[#FFE082] text-[#F57C00] font-black px-3 py-2 md:py-2.5 rounded-xl hover:bg-[#F57C00] hover:text-white transition text-[11px] md:text-xs">
                      Track Package
                    </Link>
                    <button className="flex-1 lg:flex-none text-center bg-white border-2 border-[#EFEBE1] text-[#5D4037] font-black px-3 py-2 md:py-2.5 rounded-xl hover:border-[#3E2723] hover:text-[#3E2723] transition text-[11px] md:text-xs">
                      Need Help?
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}