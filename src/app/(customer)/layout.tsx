import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import WhatsAppButton from '../../components/shared/WhatsAppButton'; // <-- IMPORT THIS

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
      
      <WhatsAppButton /> {/* <-- ADD THIS HERE */}
      
      {/* Persistent Customer Footer */}
      <Footer />
    </>
  );
}