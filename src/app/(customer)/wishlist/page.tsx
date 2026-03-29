import { Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  return (
    <main className="min-h-[70vh] bg-[#FAFAF7] flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-24 h-24 bg-[#FFF8E1] rounded-full flex items-center justify-center text-[#F57C00] mb-6 shadow-sm border-4 border-white">
        <Heart size={40} className="fill-[#F57C00]/20" />
      </div>
      <h1 className="text-3xl md:text-4xl font-black text-[#3E2723] mb-4">Your Wishlist is Empty</h1>
      <p className="text-[#8D6E63] font-medium mb-8 text-center max-w-md">
        Looks like you haven't saved any of our traditional recipes yet. Discover the authentic taste of Guntur!
      </p>
      <Link href="/shop" className="bg-[#F57C00] hover:bg-[#E65100] text-white font-black px-8 py-4 rounded-xl transition shadow-lg shadow-[#F57C00]/30 flex items-center gap-2 active:scale-95">
        Start Shopping <ArrowRight size={18}/>
      </Link>
    </main>
  );
}