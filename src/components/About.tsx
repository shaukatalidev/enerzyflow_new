'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section
      id="about"
      className="bg-black relative py-24 sm:py-32 overflow-hidden"
    >
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Section: Text */}
          <motion.div
            className="md:w-1/2 text-left"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h2 className="text-4xl font-bold text-cyan-400 mb-10 text-center">
              About Us
            </h2>

            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              At{' '}
              <span className="font-semibold text-cyan-400">
                Enerzyflow
              </span>
              , we believe water shouldn&apos;t just hydrate you&mdash;it should
              connect you.
            </p>

            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              We started with a simple promise: killer design in existing water
              bottles. But we didn&apos;t stop at the bottle. We realized the
              dining table was disconnected, so we gave our bottles a brain.
            </p>

            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              Today, Enerzyflow is the world&apos;s first Hospitality Operating
              System disguised as premium hydration. We blend sustainable
              hardware with an AI-driven digital ecosystem. Every bottle is a
              gateway&mdash;connecting the guest to the kitchen, automating
              inventory, and serving live, dynamic offers in real time.
            </p>

            <p className="text-lg text-gray-300 leading-relaxed">
              Our mission has evolved: hydrate the world, eliminate plastic, and
              digitize the physical table.
            </p>
          </motion.div>

          {/* Right Section: Image */}
          <motion.div
            className="md:w-1/2 flex justify-center"
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            <div className="rounded-2xl overflow-hidden">
              <Image
                src="/images/hero/about1.png"
                alt="Enerzyflow team and products"
                width={600}
                height={400}
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
