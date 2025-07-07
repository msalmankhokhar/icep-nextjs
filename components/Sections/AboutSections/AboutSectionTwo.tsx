// components/AboutSectionTwo.tsx
'use client';

import { motion } from 'framer-motion';
import { FaGraduationCap, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';

export default function AboutSectionTwo() {
  return (
    <section className="about-gradient py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-4 heading-font"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Why Choose ICEP?
        </motion.h2>

        <motion.p
          className="text-brand-yellow-100 max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          ICEP is recognized as the best CSS institute in Lahore, offering quality mentorship, rigorous exam prep, and unmatched student satisfaction.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            className="p-6 bg-brand-white rounded-xl shadow-md"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            <FaGraduationCap className="w-10 h-10 text-brand-red mb-4 mx-auto" />
            <h4 className="text-xl font-semibold mb-2 text-brand-blue">Expert Faculty</h4>
            <p className="text-sm text-brand-blue-400">
              Learn from CSS-qualified mentors with years of experience.
            </p>
          </motion.div>

          <motion.div
            className="p-6 bg-brand-white rounded-xl shadow-md"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <FaUsers className="w-10 h-10 text-brand-red mb-4 mx-auto" />
            <h4 className="text-xl font-semibold mb-2 text-brand-blue">Student-Centric Approach</h4>
            <p className="text-sm text-brand-blue-400">
              Focused on individual growth, mock tests, and strategy sessions.
            </p>
          </motion.div>

          <motion.div
            className="p-6 bg-brand-white rounded-xl shadow-md"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <FaMapMarkerAlt className="w-10 h-10 text-brand-red mb-4 mx-auto" />
            <h4 className="text-xl font-semibold mb-2 text-brand-blue">Prime Location</h4>
            <p className="text-sm text-brand-blue-400">
              Located in the heart of Garden Town, Lahore — easy to access.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}