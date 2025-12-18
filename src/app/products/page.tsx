'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import CustomCursor from '@/components/CustomCursor';
import { products, categories } from '@/data/products'; 

const ProductPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Bottles");

  // Filter products based on selected category
  const filteredProducts = selectedCategory === "All Bottles" 
    ? products 
    : products.filter((product) => product.category === selectedCategory);

  return (
    <>
      <CustomCursor />
   
    <div className="bg-black mt-15  text-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Left Sidebar: Categories */}
          <aside className="w-full md:w-1/4 lg:w-1/5">
            <nav className="  flex flex-col space-y-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-left text-lg hover:text-cyan-600 transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'text-cyan-600 font-bold'
                      : 'text-white-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </nav>
          </aside>

          {/* Right Section: Product Grid */}
          <section className="w-full md:w-3/4 lg:w-4/5">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group cursor-pointer">
                    {/* Product Image */}
                    <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden
                     transition-all duration-200
                      group-hover:opacity-80
                      ">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover object-center"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli2G7Qw=="
                      />
                    </div>
                    
                    {/* Product Info - Simplified like Figma */}
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-white-800 hover:text-cyan-600 transition-colors duration-200">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm text-white-500 hover:text-cyan-600 transition-colors duration-200">
                        {product.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 text-lg">No products found in this category.</p>
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
