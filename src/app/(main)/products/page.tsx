"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CustomCursor from "@/components/CustomCursor";
import { products, categories } from "@/data/products";

const ProductPage: React.FC = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Bottles");

  const filteredProducts =
    selectedCategory === "All Bottles"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <>
      <CustomCursor />

      <div className="bg-black text-white min-h-screen pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-12">
            {/* ================= LEFT SIDEBAR ================= */}
            <aside className="w-full md:w-1/4 lg:w-1/5">
              <nav className="flex flex-col space-y-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`text-left text-lg transition-colors ${
                      selectedCategory === category
                        ? "text-cyan-400 font-bold"
                        : "text-white hover:text-cyan-400"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </nav>
            </aside>

            {/* ================= PRODUCT GRID ================= */}
            <section className="w-full md:w-3/4 lg:w-4/5">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="group">
                      {/* Product Image */}
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-100">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli2G7Qw=="
                        />

                        {/* ALWAYS VISIBLE GET PRICE BUTTON */}
                        <button
                          onClick={() => router.push("/get-price")}
                          className="absolute bottom-3 right-3
                                     px-4 py-2 text-sm font-semibold
                                     rounded-full bg-cyan-400 text-black
                                     shadow-[0_0_20px_rgba(0,240,255,0.6)]
                                     hover:scale-105 transition"
                        >
                          Get Price
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold hover:text-cyan-400 transition">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-400">
                          {product.details}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500 text-lg">
                    No products found in this category.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
