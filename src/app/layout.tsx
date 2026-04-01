import './globals.css';

export const metadata = {
  metadataBase: new URL('https://pnppickles.netlify.app'),
  title: {
    default: 'Pachadlu & Pindivantalu | Authentic Homemade Pickles & Sweets',
    template: '%s | PNP Foods'
  },
  description: 'Authentic Andhra pickles, powders, and traditional sweets crafted using our grandmother’s recipes. Made fresh daily with zero preservatives.',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://pnppickles.netlify.app',
    siteName: 'PNP - Pachadlu & Pindivantalu',
    images: [
      {
        url: '/pnp.png', // This will use your logo for general page sharing
        width: 1200,
        height: 630,
        alt: 'PNP - Authentic Andhra Pickles',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PNP - Authentic Andhra Pickles',
    description: 'Authentic Andhra pickles, powders, and traditional sweets crafted using our grandmother’s recipes.',
    images: ['/pnp.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#FAFAF7] text-[#3E2723] flex flex-col min-h-screen">
        {/* Main Content Area - flex-grow ensures it pushes the footer down */}
        <main className="flex-grow w-full">
          {children}
        </main>
      </body>
    </html>
  );
}