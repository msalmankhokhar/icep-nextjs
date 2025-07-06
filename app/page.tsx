import HoverSlider from "@/components/HoverSlider";
import Logo from "@/components/Logo";
import Link from "next/link";
import { LuMail, LuPhone } from "react-icons/lu";

export default function Home() {
  return (
    <>
      <nav className="eduma-header-bg px-14 relative z-[1]">

        {/* Topbar */}
        <div className="flex py-1.5 justify-between items-center border-b border-gray-500">
          <div className="flex gap-x-8 text-white text-sm">
            <span>Have any questions?</span>
            <div className="flex items-center gap-x-2">
              <LuPhone size={16} className="mt-0.5" />
              <strong className="font-normal">+923331234567</strong>
            </div>
            <div className="flex items-center gap-x-2">
              <LuMail size={16} className="mt-0.5" />
              <strong className="font-normal">info@icepcssinstitute.com</strong>
            </div>
          </div>
        </div>

        {/* Logo Div */}
        <div className="flex items-center justify-between pt-6 pb-14">
          {/* NavLogo */}
          <Logo />
          <button className="rounded bg-brand-white text-brand-blue px-6 pt-3 pb-3.5 leading-none flex items-center justify-center text-sm font-semibold cursor-pointer">
            <span>Apply Now</span>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="bg-brand-yellow absolute left-14 right-14 -bottom-5 rounded flex items-center justify-between py-2">
          <ul className="flex items-center text-brand-blue text-sm font-medium">
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
        <HoverSlider />
      </main>
    </>
  );
}
