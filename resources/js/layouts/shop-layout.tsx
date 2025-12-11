'use client';
import Header from '@/components/frontend/header';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div>
      <div className="relative z-50">
        <Header />
      </div>
      <main className="min-h-screen bg-[#FDFBF7] z-0 font-sans text-black selection:bg-black selection:text-white">
        {/* Content will be injected here */}
        {children}
      </main>
    </div>
  );
}
