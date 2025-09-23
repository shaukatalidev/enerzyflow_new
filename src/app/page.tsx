import Hero from '@/components/Hero';
import ProductExplorer from '@/components/ProductExplorer';
import Testimonials from '@/components/Testimonials';
import BrandLogos from '@/components/BrandLogos';
import About from '@/components/About';

export default function Home() {
  return (
    <main className="bg-white">
      <Hero />
      <ProductExplorer />
      <BrandLogos/>
      <About/>
      <Testimonials />
    </main>
  );
}