'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { products, categories, Product } from '@/data/products';
import { useRouter } from 'next/navigation'; 

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
  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center animate-fadeIn">
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300 z-20">
          <X size={32} />
        </button>
        <button onClick={onPrev} className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-20" disabled={images.length <= 1}>
          <ChevronLeft size={48} />
        </button>
        <button onClick={onNext} className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-20" disabled={images.length <= 1}>
          <ChevronRight size={48} />
        </button>
        <div className="relative w-full max-w-4xl h-full max-h-[90vh]">
          <Image
            src={currentImage.image}
            alt={currentImage.name}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 90vw, 800px"
            priority
          />
          <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 p-2 rounded">
            <h3 className="text-xl font-semibold">{currentImage.name}</h3>
            <p className="text-gray-300 text-sm">{currentImage.details}</p>
          </div>
          <div className="absolute bottom-4 right-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main ProductExplorer component ---
const ProductExplorer: React.FC = () => {
  const router = useRouter(); 
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter products - exclude "All Bottles" from individual category buttons
  const categoryButtons = categories.filter(cat => cat !== "All Bottles");
  
  const filteredProducts = activeCategory
    ? products.filter((product) => product.category === activeCategory)
    : products;

  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(filteredProducts.length / itemsPerSlide);

  const getCurrentSlideProducts = () => {
    const startIndex = currentSlide * itemsPerSlide;
    return filteredProducts.slice(startIndex, startIndex + itemsPerSlide);
  };

  const nextSlide = () => {
    if (totalSlides > 1) {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }
  };

  const prevSlide = () => {
    if (totalSlides > 1) {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  };

  const openModal = (productIndex: number) => {
    const actualIndex = currentSlide * itemsPerSlide + productIndex;
    setModalImageIndex(actualIndex);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextModalImage = () => {
    setModalImageIndex((prev) => (prev + 1) % filteredProducts.length);
  };

  const prevModalImage = () => {
    setModalImageIndex(
      (prev) => (prev - 1 + filteredProducts.length) % filteredProducts.length
    );
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentSlide(0);
  };

  if (!isClient) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Explore our Bottles
            </h2>
            <div className="text-gray-500">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Title and Category Filters */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">
            Explore our Bottles
          </h2>
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-2 py-2 font-medium transition-colors relative ${
                activeCategory === ''
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              All Bottles
              {activeCategory === '' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
              )}
            </button>
            {categoryButtons.map((category: string) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-2 py-2 font-medium transition-colors relative ${
                  activeCategory === category
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {category}
                {activeCategory === category && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -mt-8 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors md:-left-6"
              >
                <ChevronLeft size={28} className="text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mt-8 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors md:-right-6"
              >
                <ChevronRight size={28} className="text-gray-600" />
              </button>
            </>
          )}

          {/* Products Grid */}
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
              {getCurrentSlideProducts().map((product: Product, index: number) => (
                <div key={product.id} className="group text-center">
                  {/* Image container */}
                  <div
                    className="relative w-full max-w-xs bg-gray-50 rounded-lg cursor-pointer mx-auto overflow-hidden"
                    style={{ aspectRatio: '3/4' }}
                    onClick={() => openModal(index)}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 80vw, 300px"
                    />
                    {/* Zoom icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ZoomIn
                        size={32}
                        className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-full p-1"
                      />
                    </div>
                  </div>
                  {/* Product Info */}
                  <h3 className="text-lg font-semibold text-gray-800 mt-4">{product.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{product.details}</p>
                </div>
              ))}
              {/* Invisible placeholders to maintain grid layout */}
              {getCurrentSlideProducts().length < itemsPerSlide &&
                Array.from({
                  length: itemsPerSlide - getCurrentSlideProducts().length,
                }).map((_, index) => (
                  <div key={`empty-${index}`} className="invisible"></div>
                ))}
            </div>
          </div>

          {/* Slide Indicators */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-gray-800' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* "Explore All Bottles" Button */}
        <div className="text-center mt-16">
            <button 
              onClick={() => router.push('/products')} 
              className="px-8 py-3 bg-white border border-gray-400 text-gray-800 font-medium rounded-full hover:bg-gray-50 transition-colors duration-300"
            >
                Explore All Bottles
            </button>
        </div>
      </div>

      {isModalOpen && (
        <ImageModal
          isOpen={isModalOpen}
          images={filteredProducts}
          currentIndex={modalImageIndex}
          onClose={closeModal}
          onNext={nextModalImage}
          onPrev={prevModalImage}
        />
      )}
    </section>
  );
};

export default ProductExplorer;
