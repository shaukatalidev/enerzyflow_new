import Image from "next/image";
import { brands, Brand } from "@/data/brands";

const BrandLogos: React.FC = () => {
  return (
    <section
      id="partners"
      className="py-14 mt-10 md:py-20 border-t border-white/5 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 text-center">
        {/* Heading */}
        <p className="text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-[0.25em] mb-12 font-bold">
          Our Trusted Partners
        </p>

        {/* AUTO SWIPE CONTAINER */}
        <div className="relative w-full overflow-hidden">
          <div className="flex w-max animate-autoSwipe">
            {[...brands, ...brands].map((brand: Brand, index) => {
              const isLarge = brand.id === 3;

              return (
                <div
                  key={`${brand.id}-${index}`}
                  className="flex flex-col items-center mx-12"
                >
                  {/* Logo */}
                  <div
                    className={`relative transition-all duration-300
                      ${
                        isLarge
                          ? "w-56 h-32 sm:w-64 sm:h-36 md:w-72 md:h-40"
                          : "w-56 h-32 sm:w-40 sm:h-24 md:w-44 md:h-28"
                      }
                    `}
                  >
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Brand Name */}
                  <span className="text-sm md:text-base text-white font-serif font-bold mt-3">
                    {brand.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandLogos;
