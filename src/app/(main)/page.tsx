import HomeAboutSection from "@/components/sections/HomeAboutSection";
import HomeBlogsSection from "@/components/sections/HomeBlogSection";
import HomeCatalogsSection from "@/components/sections/HomeCatalogsSection";
import HomeCategoriesSection from "@/components/sections/HomeCategoriesSection";
import { HomeCompaniesSection } from "@/components/sections/HomeCompaniesSection";
import HomeHeroSection from "@/components/sections/HomeHeroSection";
import HomeOffersSection from "@/components/sections/HomeOffersSection";

export default function HomePage () {
     return (
          <>
               <HomeHeroSection />
               {/* <HomeAboutSection /> */}
               <HomeCompaniesSection />
               <HomeOffersSection />
               <HomeBlogsSection />
               <HomeCatalogsSection />
               <HomeCategoriesSection />
          </>
     )
}