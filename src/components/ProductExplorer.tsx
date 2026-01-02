'use client';

import { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { products as allProducts, Product as RawProduct } from "@/data/products";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* -------------------- Types -------------------- */
type ImgType = string | StaticImageData;

type Product = RawProduct & {
  image: ImgType;
  gallery?: Array<ImgType | { image: ImgType }>;
};

/* -------------------- Helpers -------------------- */
function normalizeImg(item: ImgType | { image: ImgType } | undefined): ImgType | null {
  if (!item) return null;
  if (typeof item === "string") return item;
  if (typeof item === "object" && "src" in item) return item as StaticImageData;
  if (typeof item === "object" && "image" in item) return item.image;
  return null;
}

function productToImageArray(product: Product): ImgType[] {
  const imgs: ImgType[] = [];
  const main = normalizeImg(product.image);
  if (main) imgs.push(main);

  product.gallery?.forEach((g) => {
    const img = normalizeImg(g as ImgType | { image: ImgType });
    if (img) imgs.push(img);
  });

  return [...new Set(imgs)];
}

/* -------------------- Auto Swiper -------------------- */
const AutoSwiper = ({ images, interval = 2000 }: { images: ImgType[]; interval?: number }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval);
    return () => clearInterval(id);
  }, [images, interval]);

  return (
    <Image
      src={images[index]}
      alt="auto slide"
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-110"
    />
  );
};

/* -------------------- Main Component -------------------- */
const ProductExplorer = () => {
  const router = useRouter();
  const products = allProducts as Product[];

  const itemsPerSlide = 3;
  const totalSlides = Math.max(1, Math.ceil(products.length / itemsPerSlide));
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((s) => (s + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((s) => (s - 1 + totalSlides) % totalSlides);

  const slideProducts = products.slice(
    currentSlide * itemsPerSlide,
    currentSlide * itemsPerSlide + itemsPerSlide
  );

  const middleIndex = Math.floor(slideProducts.length / 2);

  return (
    <section id="hardware" className="bg-black text-white py-28 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Crafted for your <span className="text-cyan-400">Every Venue</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Choose bottles that match your vibe.
          </p>
        </div>

        {/* Slider */}
        <div className="relative max-w-6xl mx-auto">

          {/* Arrows */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 bg-black/70 border border-gray-700 p-3 rounded-full z-10"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 bg-black/70 border border-gray-700 p-3 rounded-full z-10"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-3 sm:px-6">
            {slideProducts.map((product, index) => {
              const imgs = productToImageArray(product);
              const isMiddle = index === middleIndex;

              return (
                <div
                  key={product.id}
                  className={`glass-panel rounded-2xl p-6 sm:p-6 transition-all duration-500 group ${
                    isMiddle
                      ? "border-cyan-400/30 shadow-[0_0_25px_rgba(0,240,255,0.15)] md:-translate-y-4"
                      : "hover:border-cyan-400"
                  }`}
                >
                  {/* Image */}
                  <div
                    className={`relative overflow-hidden rounded-xl mb-5 bg-gradient-to-b from-gray-800 to-black transition-all duration-500 ${
                      isMiddle
                        ? "h-72 sm:h-72 md:h-80"
                        : "h-64 sm:h-56 md:h-64"
                    }`}
                  >
                    {isMiddle && imgs.length > 1 ? (
                      <AutoSwiper images={imgs} />
                    ) : (
                      imgs[0] && (
                        <Image
                          src={imgs[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      )
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl sm:text-xl md:text-2xl font-bold mb-3">
                    {product.name}
                  </h3>

                  <p className="text-gray-400 text-sm mb-5">
                    {product.details}
                  </p>

                  {isMiddle ? (
                    <span className="inline-block bg-cyan-400 text-black px-4 py-1 rounded-full text-xs font-bold">
                      Best Seller
                    </span>
                  ) : (
                    <span className="text-cyan-400 font-semibold text-sm">
                      {index === 0 ? "Most Popular" : "For Luxury"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Dots */}
          {totalSlides > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-3 h-3 rounded-full ${
                    i === currentSlide ? "bg-cyan-400" : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <button
            onClick={() => router.push("/products")}
            className="border border-gray-600 px-8 py-3 rounded-full hover:border-cyan-400 transition"
          >
            Explore All Bottles
          </button>
        </div>

      </div>
    </section>
  );
};

export default ProductExplorer;
