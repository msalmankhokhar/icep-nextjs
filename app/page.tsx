import HeroSectionSwiper from "@/components/Sections/HeroSections/HeroSectionSwiper";
import AboutSectionOne from "@/components/Sections/AboutSections/AboutSectionOne";
import AboutSectionTwo from "@/components/Sections/AboutSections/AboutSectionTwo";
import CampusLifeSection from "@/components/Sections/CampusLifeSection";
import Footer from "@/components/Sections/Footer";
import Topbar from "@/components/Topbar";
import Navbar from "@/components/Navbar";
import { AnnualPlan2026, CompulsorySubjectsTestSeries, CSSOverviewSection, MagazineAndBlog, PastPapersTeaser, TestSeriesJuly2026 } from "@/components/Sections/HomeSections";

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
        
        <CSSOverviewSection />
        <TestSeriesJuly2026 />
        <CompulsorySubjectsTestSeries />
        <AnnualPlan2026 />
        <MagazineAndBlog />
        <PastPapersTeaser />

      </main>

      <Footer />
    </>
  );
}
