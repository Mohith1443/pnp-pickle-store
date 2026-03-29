import './globals.css';

export const metadata = {
  title: 'Pachadlu & pindivantalu | Authentic Homemade Pickles & Sweets',
  description: 'Authentic Andhra pickles, powders, and traditional sweets crafted using our grandmother’s recipes. Made fresh daily with zero preservatives.',
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