import { Metadata } from 'next';
import { supabase } from '../../../../lib/supabase';

// This runs entirely on the server to generate the beautiful preview cards
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data: product } = await supabase
    .from('products')
    .select('name, price, github_image_path, offer_percentage')
    .eq('slug', params.slug)
    .single();

  if (!product) return { title: 'Recipe Not Found' };

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
          url: product.github_image_path, // Uses the actual pickle image!
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
  // We just pass your existing page right through!
  return <>{children}</>;
}