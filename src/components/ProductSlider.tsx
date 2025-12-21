"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Product } from "@/data/products";

interface Props {
  product: Product;
}

export default function ProductSlider({ product }: Props) {
  const [index, setIndex] = useState(0);

  const images = product.gallery ?? [product.image];

  // ⭐ AUTO SWIPE LOGIC
  useEffect(() => {
    if (!product.autoSwipe || images.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [product.autoSwipe, images.length]);

  return (
    <div className="relative w-64 h-64 overflow-hidden">
      <Image
        src={images[index]}
        alt={product.name}
        fill
        className="object-contain transition-opacity duration-500"
        priority={product.autoSwipe}
      />
    </div>
  );
}
