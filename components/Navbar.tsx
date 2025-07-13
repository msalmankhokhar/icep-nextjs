'use client';

import Link from 'next/link'
import React, { useState } from 'react'
import Logo from './Logo'
import { HiMenuAlt1, HiX } from 'react-icons/hi'

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };
    return (
        <nav className="text-black bg-brand-white/30 px-5 min-[440px]:px-14 relative z-[11]">
            {/* Logo Div */}
            <div className="flex items-center justify-between pt-6 pb-6 min-[991px]:pb-14">
                {/* NavLogo */}
                <Logo />
                <button className="bg-brand-blue/85 text-brand-white btn hidden min-[991px]:hidden">
                    Apply Now
                </button>                <button 
                    className='text-brand-blue block min-[991px]:hidden'
                    onClick={toggleMobileMenu}
                >
                    <HiMenuAlt1 size={30} />
                </button>
            </div>

            {/* Navigation Links */}
            {/* left-14 right-14 rounded */}
            {/* media query at 991px */}            <div className="bg-brand-blue hidden min-[991px]:flex border-b border-white absolute -bottom-5 left-14 right-14 rounded items-center justify-between py-2">
                <ul className="flex items-center uppercase text-white text-sm font-medium">                    <li className="px-5 py-2 flex justify-center text-center border-r border-gray-500"><Link href={'/'}>Home</Link></li>
                    <li className="px-5 py-2 flex justify-center text-center border-r border-gray-500"><Link href={'#'}>Courses</Link></li>
                    <li className="px-5 py-2 flex justify-center text-center border-r border-gray-500"><Link href={'#'}>Success Stories</Link></li>
                    <li className="px-5 py-2 flex justify-center text-center border-r border-gray-500"><Link href={'#'}>FAQs</Link></li>
                    <li className="px-5 py-2 flex justify-center text-center border-r border-gray-500"><Link href={'/past-papers'}>Past Papers</Link></li>
                    <li className="px-5 py-2 flex justify-center text-center border-r border-gray-500"><Link href={'#'}>Magazine</Link></li>
                    <li className="px-5 py-2 flex justify-center text-center border-r border-gray-500"><Link href={'/about'}>About Us</Link></li>
                    <li className="px-5 py-2 flex justify-center text-center border-gray-500"><Link href={'/contact'}>Contact</Link></li>
                </ul>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-50 min-[991px]:hidden"
                    onClick={closeMobileMenu}
                ></div>
            )}

            {/* Mobile Side Menu */}
            <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out min-[991px]:hidden ${
                isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <Logo />
                    <button 
                        onClick={closeMobileMenu}
                        className="text-gray-600 hover:text-brand-blue transition-colors"
                    >
                        <HiX size={24} />
                    </button>
                </div>

                {/* Mobile Menu Links */}
                <div className="py-6">
                    <ul className="space-y-2">
                        <li>
                            <Link 
                                href="/" 
                                onClick={closeMobileMenu}
                                className="block px-6 py-3 text-gray-700 hover:bg-brand-blue hover:text-white transition-colors duration-200"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="#" 
                                onClick={closeMobileMenu}
                                className="block px-6 py-3 text-gray-700 hover:bg-brand-blue hover:text-white transition-colors duration-200"
                            >
                                Courses
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="#" 
                                onClick={closeMobileMenu}
                                className="block px-6 py-3 text-gray-700 hover:bg-brand-blue hover:text-white transition-colors duration-200"
                            >
                                Success Stories
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="#" 
                                onClick={closeMobileMenu}
                                className="block px-6 py-3 text-gray-700 hover:bg-brand-blue hover:text-white transition-colors duration-200"
                            >
                                FAQs
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/past-papers" 
                                onClick={closeMobileMenu}
                                className="block px-6 py-3 text-gray-700 hover:bg-brand-blue hover:text-white transition-colors duration-200"
                            >
                                Past Papers
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="#" 
                                onClick={closeMobileMenu}
                                className="block px-6 py-3 text-gray-700 hover:bg-brand-blue hover:text-white transition-colors duration-200"
                            >
                                Magazine
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/about" 
                                onClick={closeMobileMenu}
                                className="block px-6 py-3 text-gray-700 hover:bg-brand-blue hover:text-white transition-colors duration-200"
                            >
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/contact" 
                                onClick={closeMobileMenu}
                                className="block px-6 py-3 text-gray-700 hover:bg-brand-blue hover:text-white transition-colors duration-200"
                            >
                                Contact
                            </Link>
                        </li>
                    </ul>

                    {/* Mobile CTA Button */}
                    <div className="px-6 pt-6">
                        <button 
                            onClick={closeMobileMenu}
                            className="w-full bg-brand-blue text-white py-3 px-6 rounded-lg font-semibold hover:bg-brand-blue-700 transition-colors duration-200"
                        >
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>

        </nav>
    )
}
