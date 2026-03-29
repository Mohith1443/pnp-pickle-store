import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Persistent Customer Header */}
      <Header />
      
      {/* Main Content Area */}
      <main className="flex-grow w-full">
        {children}
      </main>

      {/* Persistent Customer Footer */}
      <Footer />
    </>
  );
}