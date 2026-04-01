import { MetadataRoute } from 'next';
import { supabase } from '../lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pnppickles.netlify.app';

  // Fetch all active products
  const { data: products } = await supabase
    .from('products')
    .select('slug, created_at');

  const productUrls = products?.map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: new Date(p.created_at),
  })) || [];

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/shop`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    ...productUrls,
  ];
}