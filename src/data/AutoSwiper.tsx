"use client";

import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";

interface Props {
  images: (string | StaticImageData)[];  // <-- FIXED HERE
  width?: number;
  height?: number;
}

export default function AutoSwiper({ images, width = 300, height = 300 }: Props) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setI((prev) => (prev + 1) % images.length);
    }, 1800);

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <Image
      src={images[i]}
      alt="Auto swipe"
      width={width}
      height={height}
      className="transition-all duration-500"
    />
  );
}
