'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function CSSOverviewSection() {
  return (
    <section className="py-20 bg-brand-white text-brand-blue px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-md border border-brand-blue-50"
        >
          <h2 className="text-3xl md:text-4xl font-bold heading-font text-brand-blue mb-4">
            CSS 2026 Overview
          </h2>
          <p className="text-brand-blue-300 text-base">
            Stay updated with the latest CSS 2026 exam structure, important dates, and subject changes — all curated for aspiring candidates in Pakistan.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function TestSeriesJuly2026() {
  return (
    <section className="py-20 bg-brand-blue text-brand-white px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-xl bg-brand-blue-700 shadow-lg"
        >
          <h2 className="text-3xl md:text-4xl font-bold heading-font mb-4">
            Test Series – July 2026
          </h2>
          <p className="text-brand-blue-100 text-base">
            Join our upcoming test series starting July 2026 to evaluate your preparation through real-time exam simulations and expert marking.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function CompulsorySubjectsTestSeries() {
  return (
    <section className="py-20 bg-brand-yellow text-brand-blue px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-xl shadow-lg bg-white border border-brand-yellow-100"
        >
          <h2 className="text-3xl md:text-4xl font-bold heading-font mb-4">
            Compulsory Subjects Test Series
          </h2>
          <p className="text-brand-blue-400 text-base">
            Subject-wise testing of Essay, English, General Science, Current Affairs, and Pakistan Affairs with proper feedback from top faculty.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function AnnualPlan2026() {
  return (
    <section className="py-20 bg-white text-brand-blue px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-xl shadow border border-brand-blue-50"
        >
          <h2 className="text-3xl md:text-4xl font-bold heading-font mb-4">
            Annual Plan 2026
          </h2>
          <p className="text-brand-blue-300 text-base">
            Download our full-year strategy plan designed to guide CSS aspirants from beginner level to final attempt, step-by-step.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function MagazineAndBlog() {
  return (
    <section className="py-20 bg-brand-blue-700 text-brand-white px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-xl bg-brand-blue-800 shadow"
        >
          <h2 className="text-3xl md:text-4xl font-bold heading-font mb-4">
            Institute Magazine & Blog
          </h2>
          <p className="text-brand-blue-100 text-base mb-4">
            Explore opinion pieces, current affairs breakdowns, and monthly CSS-relevant content curated by top CSS mentors and writers.
          </p>
          <Link
            href="/blog"
            className="inline-block bg-brand-yellow text-brand-blue font-semibold px-5 py-2 rounded-md hover:bg-brand-yellow-400 transition"
          >
            Visit Blog
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

import { PiExamBold, PiBookOpenTextBold, PiBrainBold, PiNewspaperClippingBold, PiFlagBold, PiHandsPrayingBold, PiBookBookmarkBold } from 'react-icons/pi';
import { formatSubjectForUrl } from '@/utils/pastPapersTypes';

const compulsorySubjects = [
  { name: 'Essay', icon: PiBookOpenTextBold },
  { name: 'English (Precis & Composition)', icon: PiExamBold },
  { name: 'General Science & Ability', icon: PiBrainBold },
  { name: 'Current Affairs', icon: PiNewspaperClippingBold },
  { name: 'Pakistan Affairs', icon: PiFlagBold },
  { name: 'Islamic Studies / Comparative Religion', icon: PiHandsPrayingBold },
];

export function PastPapersTeaser() {
  return (
    <section className="py-20 bg-white text-black px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-xl bg-brand-white shadow-lg"
        >
          <h2 className="text-3xl md:text-4xl font-bold heading-font mb-3">
            CSS Past Papers
          </h2>
          <p className="text-base mb-10">
            Access solved and unsolved past papers categorized by subject and year.
          </p>          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6 mb-8">
            {compulsorySubjects.map((subject, index) => {
              const Icon = subject.icon;
              const urlSubject = formatSubjectForUrl(subject.name);
              return (
                <Link key={index} href={`/past-papers/${urlSubject}`}>
                  <div className="bg-brand-blue text-brand-white rounded-lg shadow p-4 sm:p-4 cursor-pointer flex flex-col items-center gap-2 hover:bg-brand-blue-600 transition-colors">
                    <Icon className="text-3xl text-brand-yellow" />
                    <span className="text-sm font-semibold text-center">
                      {subject.name}
                    </span>
                  </div>
                </Link>
              );
            })}
            <Link href="/past-papers">
              <div className="bg-brand-blue text-brand-white rounded-lg shadow p-4 sm:p-4 cursor-pointer flex flex-col items-center gap-2 hover:bg-brand-blue-600 transition-colors">
                <PiBookBookmarkBold className="text-3xl text-brand-yellow" />
                <span className="text-sm font-semibold text-center">
                  Optional Subjects
                </span>
              </div>
            </Link>
          </div>

          <Link
            href="/past-papers"
            className="inline-block bg-black text-brand-white font-semibold px-5 py-2 rounded-md hover:bg-gray-900 transition"
          >
            → View All Past Papers
          </Link>
        </motion.div>
      </div>
    </section>
  );
}