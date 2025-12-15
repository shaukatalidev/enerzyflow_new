"use client";
import { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import {
  products as allProducts,
  categories,
  Product as RawProduct,
} from "@/data/products";
import { useRouter } from "next/navigation";

/* -------------------- Helpers -------------------- */
type ImgType = string | StaticImageData;
type Product = RawProduct & {
  image: ImgType;
  gallery?: Array<ImgType | { image: ImgType }>;
};

function normalizeImg(
  item: ImgType | { image: ImgType } | undefined
): ImgType | null {
  if (!item) return null;
  if (typeof item === "string") return item;
  // StaticImageData or object with `image`
  if (
    typeof item === "object" &&
    item !== null &&
    ("src" in item || "height" in item)
  )
    return item as StaticImageData;
  if (typeof item === "object" && item !== null && "image" in item)
    return item.image as ImgType;
  // fallback
  return item as ImgType;
}

function productToImageArray(p: Product): ImgType[] {
  const arr: ImgType[] = [];
  const main = normalizeImg(p.image);
  if (main) arr.push(main);

  if (Array.isArray(p.gallery)) {
    p.gallery.forEach((g) => {
      const img = normalizeImg(g as ImgType | { image: ImgType });
      if (img) arr.push(img);
    });
  }

  return arr.filter((v, i, a) => !(i > 0 && a[i - 1] === v));
}

/* -------------------- AutoSwiper -------------------- */
const AutoSwiper: React.FC<{ images: ImgType[]; intervalMs?: number }> = ({
  images,
  intervalMs = 1800,
}) => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const t = setInterval(() => {
      setIdx((s) => (s + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(t);
  }, [images, intervalMs]);

  const src = images[idx];

  return (
    <div className="relative w-full h-full">
      <Image
        src={src}
        alt={`slide-${idx}`}
        fill
        className="object-cover transition-opacity duration-400"
      />
    </div>
  );
};

/* -------------------- Modal -------------------- */
interface ImageModalProps {
  isOpen: boolean;
  images: Product[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}
const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}) => {
  if (!isOpen) return null;

  const img = images[currentIndex];
  const src = normalizeImg(img.image);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white z-20"
          title="Close modal"
        >
          <X size={32} />
        </button>
        <button
          title="Previous image"
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white z-20"
        >
          <ChevronLeft size={48} />
        </button>
        <button
          title="Next image"
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white z-20"
        >
          <ChevronRight size={48} />
        </button>

        <div className="relative w-full max-w-4xl h-full max-h-[90vh]">
          <Image
            src={src as ImgType}
            alt={img.name || "image"}
            fill
            className="object-contain"
          />
          <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 p-2 rounded">
            <h3 className="text-xl font-semibold">{img.name}</h3>
            <p className="text-gray-300 text-sm">{img.details}</p>
          </div>

          <div className="absolute bottom-4 right-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------- Main Component -------------------- */
const ProductExplorer: React.FC = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  // ensure products typed to our Product type
  const products = allProducts as unknown as Product[];

  const categoryButtons = categories.filter((c) => c !== "All Bottles");
  const filteredProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  const itemsPerSlide = 3;
  const totalSlides = Math.max(
    1,
    Math.ceil(filteredProducts.length / itemsPerSlide)
  );

  function getCurrentSlideProducts() {
    const start = currentSlide * itemsPerSlide;
    return filteredProducts.slice(start, start + itemsPerSlide);
  }

  function openModal(productIndex: number) {
    const actualIndex = currentSlide * itemsPerSlide + productIndex;
    setModalImageIndex(actualIndex);
    setIsModalOpen(true);
  }
  function closeModal() {
    setIsModalOpen(false);
  }
  function nextModalImage() {
    setModalImageIndex((i) => (i + 1) % filteredProducts.length);
  }
  function prevModalImage() {
    setModalImageIndex(
      (i) => (i - 1 + filteredProducts.length) % filteredProducts.length
    );
  }

  function handleCategoryChange(cat: string) {
    setActiveCategory(cat);
    setCurrentSlide(0);
  }

  if (!isClient) {
    return (
      <section className="py-16 bg-white text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">
          Explore our Bottles
        </h2>
        <div className="text-gray-500">Loading...</div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">

        {/* Title & Categories */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">
            Explore our Bottles
          </h2>
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <button
              onClick={() => handleCategoryChange("")}
              className={`px-2 py-2 font-medium ${
                activeCategory === "" ? "text-gray-900" : "text-gray-600"
              }`}
            >
              All Products
            </button>
            {categoryButtons.map((c) => (
              <button
                key={c}
                onClick={() => handleCategoryChange(c)}
                className={`px-2 py-2 font-medium ${
                  activeCategory === c
                    ? "text-gray-900"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Slider */}
        <div className="relative max-w-6xl mx-auto">

          {/* Slide Controls */}
          {totalSlides > 1 && (
            <>
              <button
                title="Previous image"
                onClick={prevModalImage}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                title="Next image"
                onClick={nextModalImage}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          <div className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">

              {getCurrentSlideProducts().map((product, index) => {
                const imgs = productToImageArray(product);
                const isMiddle1L =
                  product.category === "1 Litre Collection" && index === 1;

                return (
                  <div key={product.id} className="group text-center">

                    <div
                      className="relative aspect-[3/4] w-full max-w-xs bg-gray-50 rounded-lg cursor-pointer mx-auto overflow-hidden"
                      onClick={() => openModal(index)}
                    >
                      {/* 👇 HoverImage replace here */}
                      {isMiddle1L && imgs.length > 1 ? (
                        <AutoSwiper images={imgs} />
                      ) : (
                        <Image
                          src={imgs[0] as ImgType}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}

                      <div className="absolute inset-0 flex items-center justify-center">
                        <ZoomIn
                          size={32}
                          className="text-white opacity-0 group-hover:opacity-100 bg-black/50 p-1 rounded-full transition-opacity"
                        />
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 mt-4">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {product.details}
                    </p>
                  </div>
                );
              })}

            </div>
          </div>

          {/* slide dots */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  title="Go to slide "
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-3 h-3 rounded-full ${
                    i === currentSlide ? "bg-gray-800" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Explore Button */}
        <div className="text-center mt-16">
          <button
            onClick={() => router.push("/products")}
            className="px-8 py-3 bg-white border border-gray-400 rounded-full"
          >
            Explore All Bottles
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ImageModal
          isOpen={isModalOpen}
          images={filteredProducts}
          currentIndex={modalImageIndex}
          onClose={() => setIsModalOpen(false)}
          onNext={() => setModalImageIndex((i) => (i + 1) % filteredProducts.length)}
          onPrev={() => setModalImageIndex((i) => (i - 1 + filteredProducts.length) % filteredProducts.length)}
        />
      )}
    </section>
  );
};

export default ProductExplorer;
