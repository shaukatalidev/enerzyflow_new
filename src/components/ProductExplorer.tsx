'use client';

import { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { products as allProducts, Product as RawProduct } from "@/data/products";

/* -------------------- Types -------------------- */
type ImgType = string | StaticImageData;

type Product = RawProduct & {
  image: ImgType;
  gallery?: Array<ImgType | { image: ImgType }>;
};

/* -------------------- Helpers -------------------- */
const normalizeImg = (
  item?: ImgType | { image: ImgType }
): ImgType | null => {
  if (!item) return null;
  if (typeof item === "string") return item;
  if ("src" in item) return item as StaticImageData;
  if ("image" in item) return item.image;
  return null;
};

const productToImageArray = (product: Product): ImgType[] => {
  const images: ImgType[] = [];

  const main = normalizeImg(product.image);
  if (main) images.push(main);

  product.gallery?.forEach((g) => {
    const img = normalizeImg(g);
    if (img) images.push(img);
  });

  return [...new Set(images)];
};

/* -------------------- Auto Swiper -------------------- */
const AutoSwiper = ({
  images,
  interval = 2000,
}: {
  images: ImgType[];
  interval?: number;
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      interval
    );
    return () => clearInterval(timer);
  }, [images, interval]);

  return (
    <Image
      src={images[index]}
      alt="product image"
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

  const nextSlide = () =>
    setCurrentSlide((s) => (s + 1) % totalSlides);

  const prevSlide = () =>
    setCurrentSlide((s) => (s - 1 + totalSlides) % totalSlides);

  const slideProducts = products.slice(
    currentSlide * itemsPerSlide,
    currentSlide * itemsPerSlide + itemsPerSlide
  );

  const middleIndex = Math.floor(slideProducts.length / 2);

  return (
    <section id="hardware" className="bg-black text-white py-28 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Crafted for your{" "}
            <span className="text-cyan-400">Every Venue</span>
          </h2>
          <p className="text-gray-400">
            Choose bottles that match your brand and scale faster.
          </p>
        </div>

        {/* Slider */}
        <div className="relative max-w-6xl mx-auto">

          {/* Navigation Arrows */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10
                           bg-black/70 border border-gray-700 p-3 rounded-full"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10
                           bg-black/70 border border-gray-700 p-3 rounded-full"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-3">
            {slideProducts.map((product, index) => {
              const images = productToImageArray(product);
              const isMiddle = index === middleIndex;

              return (
                <div
                  key={product.id}
                  className={`group glass-panel rounded-2xl p-6 transition-all duration-500 ${
                    isMiddle
                      ? "border-cyan-400/30 shadow-[0_0_25px_rgba(0,240,255,0.15)] md:-translate-y-4"
                      : "hover:border-cyan-400"
                  }`}
                >
                  {/* Image Box */}
                  <div
                    className={`relative overflow-hidden rounded-xl mb-5
                                bg-gradient-to-b from-gray-800 to-black
                                ${isMiddle ? "h-80" : "h-64"}`}
                  >
                    {isMiddle && images.length > 1 ? (
                      <AutoSwiper images={images} />
                    ) : (
                      images[0] && (
                        <Image
                          src={images[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      )
                    )}

                    {/* GET PRICE – ALWAYS VISIBLE */}
                    <div className="absolute bottom-4 right-4">
                      <button
                        onClick={() =>
                          router.push(
                            `/get-price?product=${encodeURIComponent(
                              product.name
                            )}`
                          )
                        }
                        className="px-4 py-2 text-xs font-bold rounded-full
                                   bg-black/80 backdrop-blur-md
                                   border border-white/20 text-white
                                   hover:text-cyan-400 hover:border-cyan-400
                                   transition-all
                                   shadow-[0_0_15px_rgba(0,240,255,0.35)]"
                      >
                        Get Price
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-3">
                    {product.name}
                  </h3>

                  <p className="text-gray-400 text-sm mb-4">
                    {product.details}
                  </p>

                  {isMiddle ? (
                    <span className="inline-block bg-cyan-400 text-black px-4 py-1 rounded-full text-xs font-bold">
                      Best Seller
                    </span>
                  ) : (
                    <span className="text-cyan-400 font-semibold text-sm">
                      Premium Choice
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Dots */}
          {totalSlides > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-3 h-3 rounded-full ${
                    i === currentSlide
                      ? "bg-cyan-400"
                      : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-20 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => router.push("/products")}
            className="border border-gray-600 px-8 py-3 rounded-full
                       hover:border-cyan-400 transition"
          >
            Explore All Bottles
          </button>

          <button
            onClick={() => router.push("/get-price")}
            className="px-8 py-3 rounded-full
                       bg-gradient-to-r from-cyan-400 to-blue-500
                       text-black font-semibold
                       shadow-[0_0_20px_rgba(0,240,255,0.45)]
                       hover:scale-105 transition"
          >
            Get Franchise
          </button>
        </div>

      </div>
    </section>
  );
};

export default ProductExplorer;
