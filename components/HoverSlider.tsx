'use client'
import { motion } from "framer-motion";
import Image from "next/image";

const images = [
  "/images/header-slider/1.jpg",
  "/images/header-slider/2.jpg",
  "/images/header-slider/3.jpg",
];

export default function HoverSlider() {
  return (
    <div className="flex h-[400px] overflow-hidden">
      {images.map((src, index) => (
        <motion.div
          key={index}
          className="relative flex-1 transition-all duration-200 ease-linear overflow-hidden"
          whileHover={{ flex: 2, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Image
            src={src}
            alt={`Slider image ${index + 1}`}
            layout="fill"
            objectFit="cover"
            className="transition-all duration-300 ease-in-out"
            priority
          />
        </motion.div>
      ))}
    </div>
  );
}