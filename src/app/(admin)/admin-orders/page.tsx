'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { Search, Filter, Eye, Clock, Package, Truck, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

type OrderStatus = 'pending' | 'prepping' | 'out_for_delivery' | 'delivered' | 'cancelled';

type AdminOrder = {
  id: string;
  created_at: string;
  total_amount: number;
  status: OrderStatus;
  profiles: { full_name: string; phone_number: string } | null;
};

export default function AdminOrdersDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      // RBAC: Ensure user is Admin
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push('/login');
      
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      if (profile?.role !== 'admin') return router.push('/');

      // Fetch Orders with Customer Details
      const { data, error } = await supabase
        .from('orders')
        .select(`id, created_at, total_amount, status, profiles ( full_name, phone_number )`)
        .order('created_at', { ascending: false });

      if (!error && data) setOrders(data as any);
      setLoading(false);
    };
    fetchOrders();
  }, [router]);

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (!error) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } else {
      alert("Failed to update status.");
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      prepping: "bg-orange-100 text-orange-800 border-orange-200",
      out_for_delivery: "bg-blue-100 text-blue-800 border-blue-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200"
    };
    const labels = {
      pending: "New / Pending", prepping: "Packed", out_for_delivery: "Shipped", delivered: "Delivered", cancelled: "Cancelled"
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.profiles?.phone_number?.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#F57C00]" size={32}/></div>;

  return (
    <main className="min-h-screen bg-[#FAFAF7] py-8 px-4 font-sans">
      <div className="w-full xl:max-w-6xl mx-auto">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-[#3E2723]">Order Management</h1>
            <p className="text-[#8D6E63] text-xs font-bold mt-1">Manage processing, dispatch, and delivery.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input 
                type="text" placeholder="Search ID, Name, Phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 bg-white border border-[#EFEBE1] rounded-xl py-2 pl-9 pr-3 text-xs font-bold outline-none focus:border-[#F57C00] shadow-sm"
              />
              <Search size={14} className="absolute left-3 top-2.5 text-[#8D6E63]"/>
            </div>
            
            <div className="relative">
              <select 
                value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full sm:w-40 bg-white border border-[#EFEBE1] rounded-xl py-2 pl-9 pr-3 text-xs font-bold outline-none focus:border-[#F57C00] shadow-sm appearance-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="prepping">Packed</option>
                <option value="out_for_delivery">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Filter size={14} className="absolute left-3 top-2.5 text-[#8D6E63]"/>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-[#EFEBE1] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F2E9] border-b border-[#EFEBE1] text-[#8D6E63] text-[10px] uppercase tracking-widest">
                  <th className="px-5 py-3 font-black">Order Info</th>
                  <th className="px-5 py-3 font-black">Customer</th>
                  <th className="px-5 py-3 font-black">Amount</th>
                  <th className="px-5 py-3 font-black">Status</th>
                  <th className="px-5 py-3 font-black text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEBE1] text-xs font-bold text-[#3E2723]">
                {filteredOrders.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-[#8D6E63]">No orders found.</td></tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-[#FAFAF7] transition-colors group">
                      <td className="px-5 py-4">
                        <div className="font-black text-[#8E1C1C]">#{order.id.split('-')[0].toUpperCase()}</div>
                        <div className="text-[10px] text-[#8D6E63] mt-0.5">{new Date(order.created_at).toLocaleString()}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div>{order.profiles?.full_name || 'Guest User'}</div>
                        <div className="text-[10px] text-[#8D6E63] mt-0.5">{order.profiles?.phone_number || 'No phone'}</div>
                      </td>
                      <td className="px-5 py-4 font-black">₹{order.total_amount}</td>
                      <td className="px-5 py-4">
                        <select 
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                          className="bg-transparent font-bold text-xs cursor-pointer outline-none border-b border-dashed border-gray-300 pb-0.5"
                        >
                          <option value="pending">Pending</option>
                          <option value="prepping">Packed</option>
                          <option value="out_for_delivery">Shipped (Dispatch)</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <div className="mt-1.5">{getStatusBadge(order.status)}</div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link href={`/admin-orders/${order.id}`} className="inline-flex items-center gap-1.5 bg-[#FFF8E1] text-[#F57C00] hover:bg-[#F57C00] hover:text-white px-3 py-1.5 rounded-lg transition-colors text-[10px] uppercase tracking-wider">
                          <Eye size={12}/> View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}