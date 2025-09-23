'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id='about' className="bg-black relative py-24 sm:py-32 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-16">
          {/* Left Section: Text */}
          <motion.div
            className="md:w-1/2 text-left"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* MODIFICATION: "About us" heading moved here */}
            <h2 className="text-4xl font-bold text-blue-500 mb-10 text-center">
              About us
            </h2>
            
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              At <span className="font-semibold text-white">Enerzyflow</span>, we believe water doesn't have to be boring. We
              put it in bold cans, backed by a simple promise: sustainability and killer design. Our
              mission: hydrate the world, kill plastic waste, and look good
              doing it.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Every can you drink saves a plastic bottle from polluting our
              planet. Join the revolution — quench your thirst and murder your thirst.
            </p>
          </motion.div>

          {/* Right Section: Image */}
          <motion.div
            className="md:w-1/2 flex justify-center"
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div className="rounded-2xl overflow-hidden">
              <Image
                src="/images/hero/about.jpg"
                alt="Enerzyflow team and products"
                width={600}
                height={400}
                objectFit="cover"
                className="rounded-2xl transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;