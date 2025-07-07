'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import Image from 'next/image';
import 'swiper/css';

const slides: string[] = [
  '/images/hero-section/1.jpg',
  '/images/hero-section/2.jpg',
  '/images/hero-section/3.jpg',
];

export default function HeroSectionSwiper() {
  return (
    <section className="relative w-full h-[90vh] overflow-hidden">
      {/* Swiper */}
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 5000 }}
        loop
        className="absolute inset-0 w-full h-full -z-10"
      >
        {slides.map((src, index) => (
          <SwiperSlide key={index}>
            <motion.div
              className="relative w-full h-[90vh]"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 3, ease: 'easeOut' }}
            >
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                priority
                className="object-cover"
              />
              {/* Overlay inside slide */}
              <div className="absolute inset-0 bg-black/60"></div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* TEXT Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-white text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-bold leading-tight max-w-3xl"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Ready to Become a <span className='text-red-500'>CSS </span> Topper?
        </motion.h1>

        <motion.p
          className="mt-4 text-xl max-w-xl text-gray-200"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Unlock tailored guidance and hands-on practice—start today!
        </motion.p>

        <motion.div
          className="mt-6 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <a
            href="#courses"
            className="bg-red-700 hover:bg-red-700/90 text-white btn"
          >
            Explore Courses
          </a>
          <a
            href="#contact"
            className="border text-brand-blue bg-brand-white hover:bg-white hover:text-black btn"
          >
            📞 Contact Us
          </a>
        </motion.div>
      </div>
    </section>
  );
}
