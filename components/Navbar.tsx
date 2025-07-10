import Link from 'next/link'
import React from 'react'
import Logo from './Logo'
import { HiMenuAlt1 } from 'react-icons/hi'

export default function Navbar() {
    return (
        <nav className="text-black bg-brand-white/30 px-5 min-[440px]:px-14 relative z-[2]">
            {/* Logo Div */}
            <div className="flex items-center justify-between pt-6 pb-6 min-[991px]:pb-14">
                {/* NavLogo */}
                <Logo />
                <button className="bg-brand-blue/85 text-brand-white btn hidden min-[991px]:hidden">
                    Apply Now
                </button>
                <button className='text-brand-blue block min-[991px]:hidden'>
                    <HiMenuAlt1 size={30} />
                </button>
            </div>

            {/* Navigation Links */}
            {/* left-14 right-14 rounded */}
            {/* media query at 991px */}
            <div className="bg-brand-blue hidden min-[991px]:flex border-b border-white absolute -bottom-5 left-14 right-14 rounded items-center justify-between py-2">
                <ul className="flex items-center uppercase text-white text-sm font-medium">                    <li className="px-5 py-2 flex justify-center text-center border-r border-gray-500"><Link href={'/'}>Home</Link></li>
                    <li className="px-5 py-2 flex justify-center text-center border-r border-gray-500"><Link href={'#'}>Courses</Link></li>
                    <li className="px-5 py-2 flex justify-center text-center border-r border-gray-500"><Link href={'#'}>Success Stories</Link></li>
                    <li className="px-5 py-2 flex justify-center text-center border-r border-gray-500"><Link href={'#'}>FAQs</Link></li>
                    <li className="px-5 py-2 flex justify-center text-center border-r border-gray-500"><Link href={'/past-papers'}>Past Papers</Link></li>
                    <li className="px-5 py-2 flex justify-center text-center border-r border-gray-500"><Link href={'#'}>Magazine</Link></li>
                    <li className="px-5 py-2 flex justify-center text-center border-r border-gray-500"><Link href={'#'}>About Us</Link></li>
                    <li className="px-5 py-2 flex justify-center text-center border-gray-500"><Link href={'#'}>Contact</Link></li>
                </ul>
            </div>

        </nav>
    )
}
