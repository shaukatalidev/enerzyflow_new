'use client';

import { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import {
  products as allProducts,
  categories,
  Product as RawProduct,
} from "@/data/products";
import { useRouter } from "next/navigation";

/* -------------------- Types -------------------- */
type ImgType = string | StaticImageData;

type Product = RawProduct & {
  image: ImgType;
  gallery?: Array<ImgType | { image: ImgType }>;
};

/* -------------------- Helpers -------------------- */
function normalizeImg(
  item: ImgType | { image: ImgType } | undefined
): ImgType | null {
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
    const id = setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      interval
    );
    return () => clearInterval(id);
  }, [images, interval]);

  return (
    <Image
      src={images[index]}
      alt="auto slide"
      fill
      className="object-cover transition-opacity duration-300"
    />
  );
};

/* -------------------- Modal -------------------- */
const ImageModal = ({
  isOpen,
  products,
  index,
  onClose,
  onNext,
  onPrev,
}: {
  isOpen: boolean;
  products: Product[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) => {
  if (!isOpen) return null;

  const img = normalizeImg(products[index].image);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      <button onClick={onClose} className="absolute top-6 right-6 text-white">
        <X size={32} />
      </button>

      <button onClick={onPrev} className="absolute left-6 text-white">
        <ChevronLeft size={48} />
      </button>

      <button onClick={onNext} className="absolute right-6 text-white">
        <ChevronRight size={48} />
      </button>

      <div className="relative w-full max-w-4xl h-[80vh]">
        {img && (
          <Image
            src={img}
            alt="preview"
            fill
            className="object-contain"
          />
        )}
      </div>
    </div>
  );
};

/* -------------------- Main Component -------------------- */
const ProductExplorer = () => {
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const products = allProducts as Product[];

  const filteredProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  const itemsPerSlide = 3;
  const totalSlides = Math.max(
    1,
    Math.ceil(filteredProducts.length / itemsPerSlide)
  );

  const slideProducts = filteredProducts.slice(
    currentSlide * itemsPerSlide,
    currentSlide * itemsPerSlide + itemsPerSlide
  );

  const middleIndex = Math.floor(slideProducts.length / 2);

  const nextSlide = () =>
    setCurrentSlide((s) => (s + 1) % totalSlides);

  const prevSlide = () =>
    setCurrentSlide((s) => (s - 1 + totalSlides) % totalSlides);

  const openModal = (i: number) => {
    setModalIndex(currentSlide * itemsPerSlide + i);
    setModalOpen(true);
  };

  return (
    <section className="py-24 bg-black text-white">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Crafted for Your <span className="text-cyan-400">Every Venue</span>
          </h2>
          <p className="text-gray-400">
            Choose the vessel that matches your vibe.
          </p>

          {/* Categories */}
          <div className="flex justify-center gap-8 mt-10">
            <button
              onClick={() => {
                setActiveCategory("");
                setCurrentSlide(0);
              }}
              className={`text-sm ${activeCategory === "" ? "text-cyan-400" : "text-gray-400 hover:text-white"}`}
            >
              All Products
            </button>

            {categories
              .filter((c) => c !== "All Bottles")
              .map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setActiveCategory(c);
                    setCurrentSlide(0);
                  }}
                  className={`text-sm ${activeCategory === c ? "text-cyan-400" : "text-gray-400 hover:text-white"}`}
                >
                  {c}
                </button>
              ))}
          </div>
        </div>

        {/* Slider */}
        <div className="relative max-w-6xl mx-auto">
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/70 border border-gray-700 p-3 rounded-full z-10"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/70 border border-gray-700 p-3 rounded-full z-10"
              >
                <ChevronRight />
              </button>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
            {slideProducts.map((product, index) => {
              const imgs = productToImageArray(product);

              // Only enable auto swiper for middle item
              const enableAuto = index === middleIndex && imgs.length > 1;

              return (
                <div key={product.id} className="text-center group">
                  <div
                    onClick={() => openModal(index)}
                    className="relative aspect-[4/5] bg-neutral-900 rounded-xl overflow-hidden cursor-pointer"
                  >
                    {enableAuto ? (
                      <AutoSwiper images={imgs} />
                    ) : (
                      imgs[0] && (
                        <Image
                          src={imgs[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition"
                        />
                      )
                    )}

                    <ZoomIn className="absolute inset-0 m-auto text-white opacity-0 group-hover:opacity-100" />
                  </div>

                  <h3 className="mt-4 font-semibold">{product.name}</h3>
                  <p className="text-gray-400 text-sm">{product.details}</p>
                </div>
              );
            })}
          </div>

          {/* Dots */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-10 gap-2">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2.5 h-2.5 rounded-full ${i === currentSlide ? "bg-cyan-400" : "bg-gray-600"}`}
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

      {/* Modal */}
      <ImageModal
        isOpen={modalOpen}
        products={filteredProducts}
        index={modalIndex}
        onClose={() => setModalOpen(false)}
        onNext={() =>
          setModalIndex((i) => (i + 1) % filteredProducts.length)
        }
        onPrev={() =>
          setModalIndex(
            (i) => (i - 1 + filteredProducts.length) % filteredProducts.length
          )
        }
      />
    </section>
  );
};

export default ProductExplorer;  