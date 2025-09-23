'use client';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const noPaths = ['/login', '/signup'];

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showFooter = !noPaths.some(path => pathname.startsWith(path));
  const showHeader = !noPaths.some(path => pathname.startsWith(path));

  return (
    <>
      {showHeader && <Header />}
      <main className="min-h-screen">
        {children}
      </main>
      {showFooter && <Footer />}
    </>
  );
}
