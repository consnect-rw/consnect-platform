import HomeAboutSection from "@/components/sections/HomeAboutSection";
import HomeBlogsSection from "@/components/sections/HomeBlogSection";
import HomeCatalogsSection from "@/components/sections/HomeCatalogsSection";
import HomeCategoriesSection from "@/components/sections/HomeCategoriesSection";
import { HomeCompaniesSection } from "@/components/sections/HomeCompaniesSection";
import HomeHeroSection from "@/components/sections/HomeHeroSection";
import HomeOffersSection from "@/components/sections/HomeOffersSection";
import {  MiddlePageBanners,  FloatingPageBanners } from "@/components/banners/PageBanners";

export default function HomePage() {
  return (
    <>
      <HomeHeroSection />
      <MiddlePageBanners location="home" index={0} totalSlots={4} />
      <HomeCompaniesSection />
      <MiddlePageBanners location="home" index={1} totalSlots={4} />
      <HomeOffersSection />
      <MiddlePageBanners location="home" index={2} totalSlots={4} />
      <HomeBlogsSection />
      <MiddlePageBanners location="home" index={3} totalSlots={4} />
      <HomeCatalogsSection />
      <HomeCategoriesSection />
      <FloatingPageBanners location="home" />
    </>
  );
}