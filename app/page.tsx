import HeroSectionSwiper from "@/components/Sections/HeroSections/HeroSectionSwiper";
import AboutSectionOne from "@/components/Sections/AboutSections/AboutSectionOne";
import AboutSectionTwo from "@/components/Sections/AboutSections/AboutSectionTwo";
import CampusLifeSection from "@/components/Sections/CampusLifeSection";
import Footer from "@/components/Sections/Footer";
import Topbar from "@/components/Topbar";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Topbar />
      <Navbar />

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
