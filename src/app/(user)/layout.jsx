'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function UserLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-14 sm:pt-16">
        {children}
      </main>
      <Footer />
    </>
  );
}
