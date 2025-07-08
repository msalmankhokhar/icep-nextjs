import HeroSectionSwiper from "@/components/Sections/HeroSections/HeroSectionSwiper";
import Logo from "@/components/Logo";
import Link from "next/link";
import { LuMail, LuPhone } from "react-icons/lu";
import AboutSectionOne from "@/components/Sections/AboutSections/AboutSectionOne";
import AboutSectionTwo from "@/components/Sections/AboutSections/AboutSectionTwo";
import CampusLifeSection from "@/components/Sections/CampusLifeSection";
import Footer from "@/components/Sections/Footer";

export default function Home() {
  return (
    <>
      {/* Topbar */}
      <div className="px-14 flex pt-1.5 pb-2 justify-between bg-brand-blue/95 text-white items-center border-b border-gray-500">
        <div className="flex gap-x-8 text-sm">
          <span>Have any questions?</span>
          <div className="flex items-center gap-x-1.5">
            <LuPhone size={16} className="mt-0.5" />
            <strong className="font-normal">+923331234567</strong>
          </div>
          <div className="flex items-center gap-x-1.5">
            <LuMail size={16} className="mt-0" />
            <strong className="font-normal">info@icepcssinstitute.com</strong>
          </div>
        </div>
      </div>

      <nav className="text-black bg-brand-white/30 px-14 relative z-[2]">
        {/* Logo Div */}
        <div className="flex items-center justify-between pt-6 pb-14">
          {/* NavLogo */}
          <Logo />
          <button className="bg-brand-blue/85 text-brand-white btn">
            Apply Now
          </button>
        </div>

        {/* Navigation Links */}
        {/* left-14 right-14 rounded */}
        <div className="bg-brand-blue/95 border-b border-white absolute -bottom-5 left-14 right-14 rounded flex items-center justify-between py-2">
          <ul className="flex items-center uppercase text-white text-sm font-medium">
            <li className="px-5 py-2 flex justify-center text-center border-r border-gray-500"><Link href={'#'}>Home</Link></li>
            <li className="px-5 py-2 flex justify-center text-center border-r border-gray-500"><Link href={'#'}>Courses</Link></li>
            <li className="px-5 py-2 flex justify-center text-center border-r border-gray-500"><Link href={'#'}>Admissions</Link></li>
            <li className="px-5 py-2 flex justify-center text-center border-r border-gray-500"><Link href={'#'}>CSS Past Papers</Link></li>
            <li className="px-5 py-2 flex justify-center text-center border-r border-gray-500"><Link href={'#'}>Blog</Link></li>
            <li className="px-5 py-2 flex justify-center text-center border-r border-gray-500"><Link href={'#'}>About Us</Link></li>
            <li className="px-5 py-2 flex justify-center text-center border-gray-500"><Link href={'#'}>Contact</Link></li>
          </ul>
        </div>

      </nav>

      <main>

        <HeroSectionSwiper />

        <AboutSectionOne />
        <AboutSectionTwo />

        <CampusLifeSection />

      </main>

      <Footer/>
    </>
  );
}
