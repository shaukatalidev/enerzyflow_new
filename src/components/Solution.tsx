'use client';

import React from "react";

export default function Solution() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-10">
      <h1 className="text-3xl sm:text-5xl font-bold mb-6 sm:mb-8 text-center">
        Coming Soon
      </h1>

      <video
        src="/images/hero/vd1.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full sm:max-w-5xl h-auto rounded-lg shadow-xl object-cover"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
