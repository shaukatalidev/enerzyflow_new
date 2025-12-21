"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Product } from "@/data/products";

export default function ProductImage({ product }: { product: Product }) {
  const images = product.gallery ?? [product.image];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!product.autoSwipe || images.length < 2) return;

    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [product.autoSwipe, images.length]);

  return (
    <div className="relative w-64 h-64 rounded-xl overflow-hidden bg-black">
      <Image
        src={images[index]}
        alt={product.name}
        fill
        className="object-contain transition-opacity duration-500"
      />

      <div className="absolute bottom-2 left-2 right-2 text-center">
        <h3 className="text-white text-sm font-semibold">
          {product.name}
        </h3>
        <p className="text-xs text-gray-400">{product.details}</p>
      </div>
    </div>
  );
}
