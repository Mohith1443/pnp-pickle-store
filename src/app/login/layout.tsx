import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col items-center justify-center p-4 lg:p-8 font-sans">
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-[#8D6E63] hover:text-[#F57C00] transition font-black text-[10px] uppercase tracking-widest z-50">
        <ArrowLeft size={14} /> Back to Pantry
      </Link>
      <div className="w-full max-w-5xl">
        {children}
      </div>
    </div>
  );
}