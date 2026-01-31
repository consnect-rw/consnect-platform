import HomeAboutSection from "@/components/sections/HomeAboutSection";
import HomeBlogsSection from "@/components/sections/HomeBlogSection";
import { HomeCompaniesSection } from "@/components/sections/HomeCompaniesSection";
import HomeHeroSection from "@/components/sections/HomeHeroSection";

export default function HomePage () {
     return (
          <>
               <HomeHeroSection />
               <HomeAboutSection />
               <HomeCompaniesSection />
               <HomeBlogsSection />
          </>
     )
}