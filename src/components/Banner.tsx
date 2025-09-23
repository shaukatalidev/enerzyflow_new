'use client';

import Image from 'next/image';

interface BannerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const Banner: React.FC<BannerProps> = ({
  title = "Ready to Transform Your Brand?",
  subtitle = "Join thousands of businesses that trust EnerzyFlow for their beverage packaging solutions",
  buttonText = "Get Started Today",
  onButtonClick
}) => {
  return (
    <section className="relative h-[400px] md:h-[500px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/hero-banner.webp"
          alt="EnerzyFlow Banner"
          fill
          className="object-cover"
          quality={85}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
          
          {/* Call-to-Action Button */}
          <button 
            onClick={onButtonClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Banner;
