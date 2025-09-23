import Image from 'next/image';
import { brands, Brand } from '@/data/brands';

const BrandLogos: React.FC = () => {
  return (
    <section id='partners' className="bg-white py-12 border-b">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">
            Our trusted Partners
          </h2>
        </div>

        {/* MODIFICATION: Switched to justify-center and increased gap for consistent spacing */}
        <div className="flex flex-wrap items-center justify-around gap-y-10 gap-x-16">
          {brands.map((brand: Brand) => (
            <div key={brand.id}>
              {/* MODIFICATION: Increased logo container size and using fill on Image */}
              <div className="w-40 h-20 relative">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandLogos;