'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { 
  Package, Search, Edit2, AlertCircle, Tag, Image as ImageIcon,
  CheckCircle2, IndianRupee
} from 'lucide-react';

type Product = {
  id: string; name: string; slug: string; price: number;
  weight_grams: number; stock_quantity: number; github_image_path: string;
  github_description_path: string; offer_percentage: number; is_active: boolean;
};

export default function ProfessionalAdmin() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'editor'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', slug: '', price: '', weight: '', stock: '', offer: '0',
    image: '/products/images/', desc: '/products/descriptions/'
  });

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push('/login');
      
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      if (profile?.role !== 'admin') return router.push('/');

      fetchProducts();
    };
    init();
  }, [router]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name, slug: form.slug, price: parseFloat(form.price),
      weight_grams: parseInt(form.weight), stock_quantity: parseInt(form.stock),
      offer_percentage: parseInt(form.offer), github_image_path: form.image,
      github_description_path: form.desc
    };

    const { error } = editingId 
      ? await supabase.from('products').update(payload).eq('id', editingId)
      : await supabase.from('products').insert([payload]);

    if (error) {
      alert(error.message);
    } else {
      alert(editingId ? 'Product Updated Successfully' : 'Product Published Successfully');
      resetEditor();
      fetchProducts();
      setActiveTab('overview');
    }
  };

  const resetEditor = () => {
    setEditingId(null);
    setForm({ name: '', slug: '', price: '', weight: '', stock: '', offer: '0', image: '/products/images/', desc: '/products/descriptions/' });
  };

  const openEditor = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setForm({
        name: product.name, slug: product.slug, price: product.price.toString(),
        weight: product.weight_grams.toString(), stock: product.stock_quantity.toString(),
        offer: product.offer_percentage.toString(), image: product.github_image_path,
        desc: product.github_description_path
      });
    } else {
      resetEditor();
    }
    setActiveTab('editor');
  };

  const lowStockCount = products.filter(p => p.stock_quantity < 10).length;
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock_quantity), 0);
  const activeOffers = products.filter(p => p.offer_percentage > 0).length;
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) return <div className="p-10 flex items-center justify-center text-[#F57C00] font-black tracking-widest uppercase">Initializing Vault...</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      
      {/* Page Title & Context Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-[#3E2723]">
          {activeTab === 'overview' ? 'Inventory Overview' : editingId ? 'Edit Heritage Recipe' : 'Add New Recipe'}
        </h1>
        {activeTab === 'overview' && (
          <button onClick={() => openEditor()} className="bg-[#3E2723] text-white px-6 py-2.5 rounded-xl text-sm font-black hover:bg-[#8E1C1C] transition shadow-md w-full md:w-auto">
            Add Recipe
          </button>
        )}
      </div>

      {/* DASHBOARD OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          
          {/* KPI Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-[2rem] border border-[#EFEBE1] shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-2 relative z-10">
                <p className="text-sm font-bold text-[#8D6E63] uppercase tracking-widest">Total Products</p>
                <Package size={18} className="text-[#3E2723]"/>
              </div>
              <h3 className="text-4xl font-black text-[#3E2723] relative z-10">{products.length}</h3>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-[#F5F2E9] rounded-full z-0"></div>
            </div>
            
            <div className="bg-white p-6 rounded-[2rem] border border-[#EFEBE1] shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-2 relative z-10">
                <p className="text-sm font-bold text-[#8D6E63] uppercase tracking-widest">Inventory Value</p>
                <IndianRupee size={18} className="text-[#2E7D32]"/>
              </div>
              <h3 className="text-4xl font-black text-[#3E2723] relative z-10">₹{totalValue.toLocaleString()}</h3>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-[#EFEBE1] shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-2 relative z-10">
                <p className="text-sm font-bold text-[#8D6E63] uppercase tracking-widest">Low Stock</p>
                <AlertCircle size={18} className={lowStockCount > 0 ? "text-[#D32F2F]" : "text-[#EFEBE1]"}/>
              </div>
              <h3 className="text-4xl font-black text-[#3E2723] relative z-10">{lowStockCount}</h3>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-[#EFEBE1] shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-2 relative z-10">
                <p className="text-sm font-bold text-[#8D6E63] uppercase tracking-widest">Active Offers</p>
                <Tag size={18} className="text-[#F57C00]"/>
              </div>
              <h3 className="text-4xl font-black text-[#3E2723] relative z-10">{activeOffers}</h3>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-[2rem] border border-[#EFEBE1] shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#EFEBE1] flex justify-between items-center bg-[#FAFAF7]">
              <div className="relative w-full md:w-72">
                <Search size={18} className="absolute left-4 top-3 text-[#8D6E63]" />
                <input 
                  type="text" placeholder="Search recipes..." 
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-white border border-[#EFEBE1] rounded-xl text-sm font-bold focus:outline-none focus:border-[#F57C00] focus:ring-4 focus:ring-[#F57C00]/10 transition shadow-sm" 
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white text-[#8D6E63] border-b border-[#EFEBE1]">
                  <tr>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Product Listing</th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Pricing</th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Inventory</th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFEBE1]">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FFF8E1]/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#F5F2E9] border border-[#EFEBE1] overflow-hidden shrink-0">
                            <img src={p.github_image_path} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=No+Img'; }}/>
                          </div>
                          <div>
                            <p className="font-black text-[#3E2723]">{p.name}</p>
                            <p className="text-[10px] font-bold text-[#8D6E63] uppercase tracking-widest">{p.weight_grams}g Jar</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-black text-[#8E1C1C] text-lg leading-none">₹{p.price}</p>
                        {p.offer_percentage > 0 && <span className="inline-block mt-1 text-[9px] font-black text-white bg-[#D32F2F] px-2 py-0.5 rounded-full uppercase tracking-wider">{p.offer_percentage}% OFF</span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {p.stock_quantity > 10 ? <CheckCircle2 size={16} className="text-[#2E7D32]"/> : <AlertCircle size={16} className="text-[#D32F2F]"/>}
                          <span className={`font-black ${p.stock_quantity <= 10 ? 'text-[#D32F2F]' : 'text-[#3E2723]'}`}>
                            {p.stock_quantity} <span className="text-[#8D6E63] font-medium text-xs">jars</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openEditor(p)} className="inline-flex items-center justify-center p-2.5 text-[#8D6E63] hover:text-[#F57C00] hover:bg-[#FFF8E1] rounded-xl transition">
                          <Edit2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT EDITOR */}
      {activeTab === 'editor' && (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500 pb-20">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="bg-white p-8 rounded-[2rem] border border-[#EFEBE1] shadow-sm">
              <h3 className="text-lg font-black text-[#3E2723] mb-6 flex items-center gap-2"><Tag size={20} className="text-[#F57C00]"/> Basic Information</h3>
              <div className="grid gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#8D6E63] uppercase tracking-widest mb-2">Product Title</label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')})} className="w-full bg-[#F5F2E9] border border-transparent rounded-xl px-4 py-3 font-bold text-[#3E2723] outline-none focus:bg-white focus:border-[#F57C00] focus:ring-4 focus:ring-[#F57C00]/10 transition" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8D6E63] uppercase tracking-widest mb-2">URL Slug (Auto-generated)</label>
                  <input type="text" value={form.slug} readOnly className="w-full bg-[#F5F2E9] border border-transparent rounded-xl px-4 py-3 font-bold text-[#8D6E63] opacity-60 cursor-not-allowed" />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-[#EFEBE1] shadow-sm">
              <h3 className="text-lg font-black text-[#3E2723] mb-6 flex items-center gap-2"><IndianRupee size={20} className="text-[#F57C00]"/> Pricing & Inventory</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#8D6E63] uppercase tracking-widest mb-2">Base Price (₹)</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full bg-[#F5F2E9] border border-transparent rounded-xl px-4 py-3 font-black text-[#8E1C1C] outline-none focus:bg-white focus:border-[#F57C00] focus:ring-4 focus:ring-[#F57C00]/10 transition" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8D6E63] uppercase tracking-widest mb-2">Discount Offer (%)</label>
                  <input type="number" value={form.offer} onChange={e => setForm({...form, offer: e.target.value})} className="w-full bg-[#FFF8E1] border border-[#FFE082] rounded-xl px-4 py-3 font-black text-[#D32F2F] outline-none focus:border-[#F57C00] transition" min="0" max="100"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8D6E63] uppercase tracking-widest mb-2">Net Weight (Grams)</label>
                  <input type="number" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} className="w-full bg-[#F5F2E9] border border-transparent rounded-xl px-4 py-3 font-bold text-[#3E2723] outline-none focus:bg-white focus:border-[#F57C00]" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8D6E63] uppercase tracking-widest mb-2">Available Stock</label>
                  <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full bg-[#F5F2E9] border border-transparent rounded-xl px-4 py-3 font-bold text-[#3E2723] outline-none focus:bg-white focus:border-[#F57C00]" required />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-[#EFEBE1] shadow-sm">
              <h3 className="text-lg font-black text-[#3E2723] mb-6 flex items-center gap-2"><ImageIcon size={20} className="text-[#F57C00]"/> Media & Content</h3>
              <div className="grid gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#8D6E63] uppercase tracking-widest mb-2">Image Asset Path</label>
                  <input type="text" value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full bg-[#F5F2E9] border border-transparent rounded-xl px-4 py-3 font-mono text-sm text-[#5D4037] outline-none focus:bg-white focus:border-[#F57C00]" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8D6E63] uppercase tracking-widest mb-2">Markdown Description Path (.md)</label>
                  <input type="text" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className="w-full bg-[#F5F2E9] border border-transparent rounded-xl px-4 py-3 font-mono text-sm text-[#5D4037] outline-none focus:bg-white focus:border-[#F57C00]" required />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#EFEBE1]">
              <button type="button" onClick={() => setActiveTab('overview')} className="px-8 py-4 font-black text-[#5D4037] bg-white border-2 border-[#EFEBE1] rounded-2xl hover:bg-[#F5F2E9] transition">
                Cancel
              </button>
              <button type="submit" className="px-8 py-4 font-black text-white bg-[#F57C00] rounded-2xl hover:bg-[#E65100] transition shadow-lg shadow-[#F57C00]/30 flex items-center gap-2 active:scale-95">
                <CheckCircle2 size={20}/> {editingId ? 'Save Changes' : 'Publish Recipe'}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}