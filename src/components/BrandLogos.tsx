import Image from "next/image";
import { brands, Brand } from "@/data/brands";

const BrandLogos: React.FC = () => {
  return (
    <section
      id="partners"
      className="py-14  mt-10 md:py-20 border-t border-white/5"
    >
      <div className="container mx-auto px-4 sm:px-6 text-center">
        {/* Heading */}
        <p className="
          text-xl sm:text-2xl md:text-3xl
          text-white
          uppercase
          tracking-[0.25em]
          mb-10 md:mb-12
          font-bold
        ">
          Our Trusted Partners
        </p>

        {/* Logos */}
        <div
          className="
            grid grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            gap-8 sm:gap-12 md:gap-16
            items-center
            opacity-60 grayscale
            hover:grayscale-0 hover:opacity-100
            transition-all duration-500
          "
        >
          {brands.map((brand: Brand) => (
            <div
              key={brand.id}
              className="
                flex flex-col items-center gap-3
                text-gray-300 hover:text-brand
                transition-colors duration-300
              "
            >
              {/* Logo */}
              <div className="
                relative
                w-28 h-16
                sm:w-32 sm:h-18
                md:w-36 md:h-20
                lg:w-40 lg:h-20
              ">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                />
              </div>

              {/* Brand Name */}
              <span className="
                text-sm sm:text-base md:text-lg
                font-serif font-bold
                text-center
              ">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandLogos;
