import { Metadata } from 'next';
import { supabase } from '../../../../lib/supabase';

// CRITICAL FIX: Tell Next.js to fetch SEO data LIVE, do not cache from build time
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data: product, error } = await supabase
    .from('products')
    .select('name, price, github_image_path, offer_percentage')
    .eq('slug', params.slug)
    .single();

  // If there's an error or it's temporarily missing, fall back to a safe brand title
  if (error || !product) {
    return { title: 'Authentic Andhra Pickles | PNP Foods' };
  }

  const discountedPrice = Math.round(product.price - (product.price * (product.offer_percentage / 100)));

  return {
    title: product.name,
    description: `Order authentic homemade ${product.name}. Handcrafted in Andhra Pradesh. Special price: ₹${discountedPrice}.`,
    openGraph: {
      title: `${product.name} | PNP Pachadlu`,
      description: `Order authentic homemade ${product.name} made with zero preservatives. Special price: ₹${discountedPrice}.`,
      url: `https://pnppickles.netlify.app/product/${params.slug}`,
      images: [
        {
          url: product.github_image_path,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}