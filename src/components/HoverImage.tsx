"use client";

import Image from "next/image";
import { useState } from "react";

interface HoverImageProps {
  images: string[];
  alt: string;
}

const HoverImage: React.FC<HoverImageProps> = ({ images, alt }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Normal Image */}
      <Image
        src={images[0]}
        alt={alt}
        fill
        className={`
          object-cover transition-all duration-300
          ${hover ? "opacity-0" : "opacity-100"}
        `}
      />

      {/* Hover Image */}
      {images[1] && (
        <Image
          src={images[1]}
          alt={alt}
          fill
          className={`
            absolute inset-0 object-cover transition-all duration-300
            ${hover ? "opacity-100" : "opacity-0"}
          `}
        />
      )}
    </div>
  );
};

export default HoverImage;
