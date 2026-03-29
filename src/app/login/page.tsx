'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { Mail, Lock, User, Phone, ShieldCheck, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email, password, options: { data: { full_name: fullName, phone_number: phoneNumber } },
        });
        if (signUpError) throw signUpError;
        alert('Registration successful! Please sign in.');
        setIsSignUp(false);
      } else {
        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        if (authData.user) {
          const { data: profile } = await supabase.from('profiles').select('role').eq('id', authData.user.id).single();
          if (profile?.role === 'admin') router.push('/dashboard');
          else router.push('/');
        }
      }
    } catch (err: any) { setError(err.message); } 
    finally { setLoading(false); }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-[#EFEBE1] flex flex-col lg:flex-row min-h-[500px] animate-in fade-in zoom-in-95 duration-500">
      
      {/* LEFT SIDE: Heritage Branding (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#3E2723] p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <img src="/pnp.png" alt="PNP" className="h-14 w-auto object-contain brightness-0 invert mb-8" />
          <h2 className="text-3xl font-black text-white leading-tight mb-4">The taste of tradition, <br/> delivered to your door.</h2>
          <p className="text-[#D7CCC8] text-sm font-medium leading-relaxed max-w-xs">
            Join thousands of families enjoying authentic, handmade Andhra recipes crafted with zero preservatives.
          </p>
        </div>
        
        <div className="relative z-10 flex gap-6 text-[#FFCC80] text-[10px] font-black uppercase tracking-widest">
           <span className="flex items-center gap-1.5"><ShieldCheck size={14}/> 100% Authentic</span>
           <span className="flex items-center gap-1.5"><ShieldCheck size={14}/> Family Recipes</span>
        </div>

        {/* Decorative Background Element */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#8E1C1C] rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* RIGHT SIDE: The Auth Form */}
      <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
        <div className="mb-8 lg:hidden flex justify-center">
           <img src="/pnp.png" alt="PNP" className="h-10 w-auto object-contain" />
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-black text-[#3E2723]">{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
          <p className="text-xs font-bold text-[#8D6E63] uppercase tracking-widest mt-1">
            {isSignUp ? 'Join our heritage community' : 'Sign in to access your pantry'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 text-[#D32F2F] text-[10px] font-black uppercase rounded-xl flex items-center gap-2">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-3">
          {isSignUp && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required
                  className="w-full bg-[#F5F2E9] rounded-xl py-2.5 pl-9 pr-4 text-xs font-bold text-[#3E2723] outline-none focus:bg-white focus:ring-2 focus:ring-[#F57C00]/20 transition-all border border-transparent focus:border-[#F57C00]" />
                <User className="absolute left-3 top-2.5 text-[#8D6E63]" size={14} />
              </div>
              <div className="relative">
                <input type="tel" placeholder="WhatsApp Number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required
                  className="w-full bg-[#F5F2E9] rounded-xl py-2.5 pl-9 pr-4 text-xs font-bold text-[#3E2723] outline-none focus:bg-white focus:ring-2 focus:ring-[#F57C00]/20 transition-all border border-transparent focus:border-[#F57C00]" />
                <Phone className="absolute left-3 top-2.5 text-[#8D6E63]" size={14} />
              </div>
            </div>
          )}

          <div className="relative">
            <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full bg-[#F5F2E9] rounded-xl py-2.5 pl-9 pr-4 text-xs font-bold text-[#3E2723] outline-none focus:bg-white focus:ring-2 focus:ring-[#F57C00]/20 transition-all border border-transparent focus:border-[#F57C00]" />
            <Mail className="absolute left-3 top-2.5 text-[#8D6E63]" size={14} />
          </div>

          <div className="relative">
            <input type="password" placeholder="Secure Password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full bg-[#F5F2E9] rounded-xl py-2.5 pl-9 pr-4 text-xs font-bold text-[#3E2723] outline-none focus:bg-white focus:ring-2 focus:ring-[#F57C00]/20 transition-all border border-transparent focus:border-[#F57C00]" />
            <Lock className="absolute left-3 top-2.5 text-[#8D6E63]" size={14} />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#8E1C1C] hover:bg-[#B71C1C] text-white font-black py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:bg-gray-300 mt-4 text-[10px] uppercase tracking-[0.2em]">
            {loading ? <Loader2 className="animate-spin" size={16}/> : isSignUp ? 'Register Now' : 'Enter Vault'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#EFEBE1] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-[10px] font-black text-[#F57C00] uppercase tracking-widest hover:underline transition">
            {isSignUp ? 'Back to Login' : 'Need an Account? Sign Up'}
          </button>
          
          <div className="flex items-center gap-3 opacity-40 grayscale">
             <div className="flex flex-col items-center"><CheckCircle2 size={10}/><span className="text-[8px] font-bold">Secure</span></div>
             <div className="w-px h-4 bg-gray-300"></div>
             <div className="flex flex-col items-center"><CheckCircle2 size={10}/><span className="text-[8px] font-bold">Verified</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}