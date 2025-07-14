'use client';

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Logo from './Logo'
import { HiMenuAlt1, HiX } from 'react-icons/hi'

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const pathname = usePathname();

    // Handle scroll behavior
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Check if scrolled past initial position
            setIsScrolled(currentScrollY > 50);

            // Show/hide navbar based on scroll direction
            if (currentScrollY < lastScrollY || currentScrollY < 100) {
                // Scrolling up or near top - show navbar
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down and not near top - hide navbar
                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Close mobile menu when clicking outside or pressing escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsMobileMenuOpen(false);
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(href);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };
    return (
        <nav className={`text-black px-5 min-[440px]:px-14 z-[11] transition-all duration-300 ease-in-out ${
            isScrolled 
                ? `fixed top-0 left-0 right-0 ${isVisible ? 'translate-y-0' : '-translate-y-[162px]'}` 
                : 'relative'
            } ${isScrolled
                ? 'bg-white backdrop-blur-md shadow-lg'
                : 'bg-white backdrop-blur-sm shadow-sm'
            }`}>
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
            </div>            {/* Navigation Links */}
            {/* left-14 right-14 rounded */}
            {/* media query at 991px */}
            <div className={`bg-brand-blue hidden min-[991px]:flex border-b border-white absolute left-14 right-14 rounded-md items-center justify-between py-2 transition-all duration-300 ease-in-out ${isVisible ? '-bottom-5' : '-bottom-5'
                }`}>
                <ul className="flex uppercase text-white text-sm font-medium px-2">
                    <li className={`rounded-[4px] px-5 py-2 flex items-center justify-center text-center border-r border-gray-500 ${isActive('/') ? 'bg-brand-yellow text-black' : ''}`}>
                        <Link className='' href={'/'}>Home</Link>
                    </li>
                    <li className={`rounded-[4px] px-5 py-3 flex items-center justify-center text-center border-r border-gray-500 ${isActive('/courses') ? 'bg-brand-yellow text-black' : ''}`}>
                        <Link className='' href={'#'}>Courses</Link>
                    </li>
                    <li className={`rounded-[4px] px-5 py-3 flex items-center justify-center text-center border-r border-gray-500 ${isActive('/success-stories') ? 'bg-brand-yellow text-black' : ''}`}>
                        <Link className='' href={'/#success-stories-section'}>Success Stories</Link>
                    </li>
                    <li className={`rounded-[4px] px-5 py-3 flex items-center justify-center text-center border-r border-gray-500 ${isActive('/faqs') ? 'bg-brand-yellow text-black' : ''}`}>
                        <Link className='' href={'/contact/#faqs-section'}>FAQs</Link>
                    </li>
                    <li className={`rounded-[4px] px-5 py-3 flex items-center justify-center text-center border-r border-gray-500 ${isActive('/past-papers') ? 'bg-brand-yellow text-black' : ''}`}>
                        <Link className='' href={'/past-papers'}>Past Papers</Link>
                    </li>
                    <li className={`rounded-[4px] px-5 py-3 flex items-center justify-center text-center border-r border-gray-500 ${isActive('/magazine') ? 'bg-brand-yellow text-black' : ''}`}>
                        <Link className='' href={'#'}>Magazine</Link>
                    </li>
                    <li className={`rounded-[4px] px-5 py-3 flex items-center justify-center text-center border-r border-gray-500 ${isActive('/about') ? 'bg-brand-yellow text-black' : ''}`}>
                        <Link className='' href={'/about'}>About Us</Link>
                    </li>
                    <li className={`rounded-[4px] px-5 py-3 flex items-center justify-center text-center border-gray-500 ${isActive('/contact') ? 'bg-brand-yellow text-black' : ''}`}>
                        <Link className='' href={'/contact'}>Contact</Link>
                    </li>
                </ul>
            </div>            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[60] min-[991px]:hidden"
                    onClick={closeMobileMenu}
                ></div>
            )}            {/* Mobile Side Menu */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[100000] transform transition-transform duration-300 ease-in-out min-[991px]:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                style={{
                    transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)'
                }}
            >
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <Logo />
                    <button
                        onClick={closeMobileMenu}
                        className="text-gray-600 hover:text-brand-blue transition-colors"
                    >
                        <HiX size={24} />
                    </button>
                </div>{/* Mobile Menu Links */}
                <div className="py-6">
                    <ul className="space-y-2">
                        <li>
                            <Link
                                href="/"
                                onClick={closeMobileMenu}
                                className={`block px-6 py-3 transition-colors duration-200 ${isActive('/')
                                    ? 'bg-brand-blue text-white'
                                    : 'text-gray-700 hover:bg-brand-blue hover:text-white'
                                    }`}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="#"
                                onClick={closeMobileMenu}
                                className={`block px-6 py-3 transition-colors duration-200 ${isActive('/courses')
                                    ? 'bg-brand-blue text-white'
                                    : 'text-gray-700 hover:bg-brand-blue hover:text-white'
                                    }`}
                            >
                                Courses
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="#"
                                onClick={closeMobileMenu}
                                className={`block px-6 py-3 transition-colors duration-200 ${isActive('/success-stories')
                                    ? 'bg-brand-blue text-white'
                                    : 'text-gray-700 hover:bg-brand-blue hover:text-white'
                                    }`}
                            >
                                Success Stories
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="#"
                                onClick={closeMobileMenu}
                                className={`block px-6 py-3 transition-colors duration-200 ${isActive('/faqs')
                                    ? 'bg-brand-blue text-white'
                                    : 'text-gray-700 hover:bg-brand-blue hover:text-white'
                                    }`}
                            >
                                FAQs
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/past-papers"
                                onClick={closeMobileMenu}
                                className={`block px-6 py-3 transition-colors duration-200 ${isActive('/past-papers')
                                    ? 'bg-brand-blue text-white'
                                    : 'text-gray-700 hover:bg-brand-blue hover:text-white'
                                    }`}
                            >
                                Past Papers
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="#"
                                onClick={closeMobileMenu}
                                className={`block px-6 py-3 transition-colors duration-200 ${isActive('/magazine')
                                    ? 'bg-brand-blue text-white'
                                    : 'text-gray-700 hover:bg-brand-blue hover:text-white'
                                    }`}
                            >
                                Magazine
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/about"
                                onClick={closeMobileMenu}
                                className={`block px-6 py-3 transition-colors duration-200 ${isActive('/about')
                                    ? 'bg-brand-blue text-white'
                                    : 'text-gray-700 hover:bg-brand-blue hover:text-white'
                                    }`}
                            >
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/contact"
                                onClick={closeMobileMenu}
                                className={`block px-6 py-3 transition-colors duration-200 ${isActive('/contact')
                                    ? 'bg-brand-blue text-white'
                                    : 'text-gray-700 hover:bg-brand-blue hover:text-white'
                                    }`}
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
