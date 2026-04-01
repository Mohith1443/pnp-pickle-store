import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin-orders/', 
        '/dashboard/', 
        '/customers/', 
        '/queue/',
        '/account/',
        '/cart/'
      ],
    },
    sitemap: 'https://pnppickles.netlify.app/sitemap.xml',
  };
}