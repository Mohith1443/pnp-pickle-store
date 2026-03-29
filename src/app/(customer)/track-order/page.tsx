'use client';

import { useState, useEffect, Suspense } from 'react';
import { Package, Search, Truck, CheckCircle2, Clock, Loader2, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

type OrderStatus = 'pending' | 'prepping' | 'out_for_delivery' | 'delivered' | 'cancelled';
type OrderData = { id: string; status: OrderStatus; created_at: string; delivery_address: string; };

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [orderId, setOrderId] = useState(initialId);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => { if (initialId) handleTrackOrder(initialId); }, [initialId]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); handleTrackOrder(orderId); };

  const handleTrackOrder = async (idToTrack: string) => {
    if (!idToTrack.trim()) return;
    setLoading(true); setErrorMsg(''); setOrder(null);

    try {
      const { data, error } = await supabase.from('orders').select('id, status, created_at, delivery_address').eq('id', idToTrack.trim()).single();
      if (error || !data) setErrorMsg("We couldn't find an order with that ID. Please check and try again.");
      else setOrder(data);
    } catch (err) { setErrorMsg("Something went wrong while fetching tracking details."); }
    finally { setLoading(false); }
  };

  const isStepComplete = (stepStatus: OrderStatus[], currentStatus: OrderStatus) => stepStatus.includes(currentStatus);

  return (
    <div className="w-full lg:w-[70%] xl:max-w-4xl mx-auto">
      <div className="bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-3xl shadow-sm border border-[#EFEBE1]">
        
        {/* Compact Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#FFF8E1] rounded-xl flex items-center justify-center text-[#F57C00] shadow-sm shrink-0">
              <Package size={20} className="md:w-6 md:h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-[#3E2723]">Track Your Pickles</h1>
              <p className="text-[#8D6E63] text-xs md:text-sm font-medium">Enter Order ID for shipping updates.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 w-full lg:w-auto">
            <input 
              type="text" placeholder="e.g. 8067ec3c..." required value={orderId} onChange={(e) => setOrderId(e.target.value)}
              className="w-full lg:w-56 bg-[#F5F2E9] border border-[#EFEBE1] rounded-xl py-2 px-3 focus:bg-white focus:border-[#F57C00] focus:ring-2 focus:ring-[#F57C00]/10 transition-all outline-none text-xs md:text-sm font-bold text-[#3E2723]"
            />
            <button type="submit" disabled={loading} className="bg-[#8E1C1C] hover:bg-[#B71C1C] text-white font-black px-4 md:px-6 py-2 rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 disabled:bg-gray-400 text-xs md:text-sm shrink-0">
              {loading ? <Loader2 size={14} className="animate-spin"/> : <Search size={14}/>} 
              <span className="hidden sm:inline">{loading ? 'TRACKING' : 'TRACK'}</span>
            </button>
          </form>
        </div>

        {errorMsg && (
          <div className="p-3 mb-5 bg-[#D32F2F]/10 border border-[#D32F2F]/20 rounded-xl text-[#D32F2F] text-xs font-bold flex items-center gap-2">
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        {order && (
          <div className="p-4 md:p-6 bg-[#FAFAF7] rounded-xl border border-[#EFEBE1] animate-in fade-in">
            <div className="mb-5 border-b border-[#EFEBE1] pb-3 flex flex-row items-center justify-between gap-2">
              <div>
                <h3 className="font-black text-[#3E2723] text-lg">Order Status</h3>
                <p className="text-[10px] md:text-xs font-bold text-[#8D6E63] uppercase tracking-widest mt-0.5">ID: {order.id.split('-')[0]}</p>
              </div>
            </div>
            
            {order.status === 'cancelled' ? (
              <div className="text-center py-5">
                <div className="w-10 h-10 bg-[#D32F2F]/10 text-[#D32F2F] rounded-full flex items-center justify-center mx-auto mb-2">
                  <AlertCircle size={20} />
                </div>
                <h4 className="text-base font-black text-[#D32F2F] mb-1">Order Cancelled</h4>
                <p className="text-[#8D6E63] text-xs font-medium">This order has been cancelled and will not be delivered.</p>
              </div>
            ) : (
              /* HORIZONTAL TIMELINE - ULTRA COMPACT */
              <div className="relative flex flex-col md:flex-row justify-between w-full px-1 md:px-2 mt-2">
                
                {/* Connecting Line */}
                <div className="hidden md:block absolute top-3.5 left-8 right-8 h-1 bg-[#EFEBE1] z-0 rounded-full"></div>
                <div className="md:hidden absolute top-4 bottom-4 left-[15px] w-[3px] bg-[#EFEBE1] z-0 rounded-full"></div>

                {/* Step 1 */}
                <div className="relative z-10 flex md:flex-col items-center md:items-center gap-3 md:gap-2 flex-1 mb-5 md:mb-0">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-[3px] border-[#FAFAF7] shrink-0 transition-all ${isStepComplete(['pending', 'prepping', 'out_for_delivery', 'delivered'], order.status) ? 'bg-[#F57C00] text-white scale-105 shadow-sm' : 'bg-[#EFEBE1] text-[#8D6E63]'}`}>
                    <Clock size={14}/>
                  </div>
                  <div className="md:text-center pt-0.5">
                    <div className="font-black text-[#3E2723] text-xs md:text-sm">Confirmed</div>
                    <div className="text-[9px] font-bold text-[#8D6E63]">{new Date(order.created_at).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative z-10 flex md:flex-col items-center md:items-center gap-3 md:gap-2 flex-1 mb-5 md:mb-0">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-[3px] border-[#FAFAF7] shrink-0 transition-all ${isStepComplete(['prepping', 'out_for_delivery', 'delivered'], order.status) ? 'bg-[#F57C00] text-white scale-105 shadow-sm' : 'bg-[#EFEBE1] text-[#8D6E63]'}`}>
                    <Package size={14}/>
                  </div>
                  <div className="md:text-center pt-0.5">
                    <div className="font-black text-[#3E2723] text-xs md:text-sm">Prepared</div>
                    <div className="text-[9px] font-bold text-[#8D6E63]">Packing fresh</div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative z-10 flex md:flex-col items-center md:items-center gap-3 md:gap-2 flex-1 mb-5 md:mb-0">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-[3px] border-[#FAFAF7] shrink-0 transition-all ${isStepComplete(['out_for_delivery', 'delivered'], order.status) ? 'bg-[#F57C00] text-white scale-105 shadow-sm' : 'bg-[#EFEBE1] text-[#8D6E63]'}`}>
                    <Truck size={14}/>
                  </div>
                  <div className="md:text-center pt-0.5">
                    <div className="font-black text-[#3E2723] text-xs md:text-sm">On the Way</div>
                    <div className="text-[9px] font-bold text-[#8D6E63] max-w-[100px] truncate" title={order.delivery_address}>
                      {order.delivery_address ? `${order.delivery_address.substring(0, 10)}...` : 'Assigned'}
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative z-10 flex md:flex-col items-center md:items-center gap-3 md:gap-2 flex-1">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-[3px] border-[#FAFAF7] shrink-0 transition-all ${isStepComplete(['delivered'], order.status) ? 'bg-[#2E7D32] text-white scale-105 shadow-sm' : 'bg-[#EFEBE1] text-[#8D6E63]'}`}>
                    <CheckCircle2 size={14}/>
                  </div>
                  <div className="md:text-center pt-0.5">
                    <div className="font-black text-[#3E2723] text-xs md:text-sm">Delivered</div>
                    <div className="text-[9px] font-bold text-[#8D6E63]">Enjoy!</div>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <main className="min-h-[80vh] bg-[#FAFAF7] py-8 px-4 lg:px-0 font-sans flex items-start justify-center">
      <div className="w-full">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center pt-10 text-[#F57C00]">
            <Loader2 size={24} className="animate-spin mb-2" />
            <p className="font-black tracking-widest uppercase text-[10px]">Loading Portal...</p>
          </div>
        }>
          <TrackOrderContent />
        </Suspense>
      </div>
    </main>
  );
}