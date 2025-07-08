// components/Footer.tsx
'use client';

import { motion } from 'framer-motion';
import Logo from '../Logo';
import Link from 'next/link';
import { FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { SiFacebook, SiInstagram, SiYoutube } from 'react-icons/si';

export default function Footer() {
    return (
        <footer className="relative text-brand-white pt-16 pb-8 px-6 md:px-12 lg:px-24">
            <div className="footer-bg" />
            {/* grid md:grid-cols-4 changed to */}
            <div className="max-w-7xl mx-auto flex justify-evenly gap-12">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className='mb-5'>
                        <Logo />
                    </div>
                    <p className="tracking-wider text-sm text-brand-blue-100 max-w-[260px]">
                        Join us and be part of a transformative journey toward success.
                    </p>
                    <div className='flex w-full self-start mt-5 items-center gap-x-3'>
                        <div className='size-[33px] rounded-full bg-brand-white text-blue-600 flex items-center justify-center'>
                            <SiFacebook />
                        </div>
                        <div className='size-[33px] rounded-full bg-brand-white text-red-600 flex items-center justify-center'>
                            <SiYoutube />
                        </div>
                        <div className='size-[33px] rounded-full bg-brand-white text-orange-500/70 flex items-center justify-center'>
                            <SiInstagram />
                        </div>
                    </div>
                </motion.div>

                {/* Info */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <p className="tracking-wider text-sm text-brand-blue-100 max-w-[260px] mb-2">
                        {/* ICEP CSS PMS Institute is an epitome of excellence in civil services preparation. We mentor with dedication and purpose. */}
                        ICEP CSS PMS Institute is Pakistan’s leading center for civil services preparation.
                    </p>
                    <p className="tracking-wider text-sm text-brand-blue-100 max-w-[260px] mb-2">
                        With a strong focus on personalized mentorship, rigorous training, and academic excellence, we guide aspirants towards achieving their dream careers in bureaucracy and public service.
                    </p>
                    
                </motion.div>

                {/* Quick Links */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    viewport={{ once: true }}
                    className='text-nowrap'
                >
                    <h4 className="text-2xl font-semibold mb-5 heading-font">Learn More</h4>
                    <ul className="space-y-3 text-sm text-brand-blue-100 uppercase">
                        <li><Link href="/" className="hover:text-brand-yellow">Courses</Link></li>
                        <li><Link href="/about" className="hover:text-brand-yellow">CSS Past Papers</Link></li>
                        <li><Link href="/courses" className="hover:text-brand-yellow">Magazine</Link></li>
                        <li><Link href="/contact" className="hover:text-brand-yellow">Books</Link></li>
                    </ul>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                    className='max-w-[230px]'
                >
                    <h4 className="text-2xl font-semibold mb-5 heading-font">Contact</h4>
                    <ul className="space-y-3 text-sm text-brand-blue-100">
                        <li className="flex items-start gap-2">
                            <iframe className='aspect-video' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4886.506085744368!2d74.31915614853962!3d31.50184414765225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391905802f02a883%3A0xcecd40725f6c81fd!2sICEP%20CSS%20-%20PMS%2C%20Institute!5e0!3m2!1sen!2s!4v1751966174210!5m2!1sen!2s" width="auto" height="auto" style={{ border: '0px' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                        </li>
                        <li className="flex items-start gap-2">
                            <FaMapMarkerAlt className="mt-1" />
                            22-B New, Ali Block, Garden Town, Lahore
                        </li>
                        <li className="flex items-center gap-2">
                            <FaPhone /> 0322 2077774
                        </li>
                    </ul>
                </motion.div>
            </div>

            <div className="text-center mt-16 border-t border-brand-blue-400 pt-6 text-sm text-brand-blue-100">
                © {new Date().getFullYear()} ICEP CSS Institute. All rights reserved.
            </div>
        </footer>
    );
}