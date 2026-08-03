import HomeBlogsSection from "@/components/sections/HomeBlogSection";
import HomeCatalogsSection from "@/components/sections/HomeCatalogsSection";
import HomeCategoriesSection from "@/components/sections/HomeCategoriesSection";
import { HomeCompaniesSection } from "@/components/sections/HomeCompaniesSection";
import HomeHeroSection from "@/components/sections/HomeHeroSection";
import HomeOffersSection from "@/components/sections/HomeOffersSection";
import {  MiddlePageBanners,  FloatingPageBanners } from "@/components/banners/PageBanners";
import { JsonLd, buildWebSiteSchema, buildOrganizationSchema } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consnect | Rwanda's #1 Construction Platform",
  description:
    "Find verified construction companies, tenders, and business opportunities in Rwanda. Consnect connects contractors, suppliers, and engineers across Rwanda's construction industry.",
  alternates: { canonical: "https://consnect.rw" },
  openGraph: {
    title: "Consnect | Rwanda's #1 Construction Platform",
    description: "Connect with verified construction companies, find tenders, and grow your construction business in Rwanda.",
    url: "https://consnect.rw",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildWebSiteSchema()} />
      <JsonLd data={buildOrganizationSchema()} />
      <HomeHeroSection />
      <MiddlePageBanners location="home" index={0} totalSlots={4} />
      <HomeCatalogsSection />
      <HomeOffersSection />
      <MiddlePageBanners location="home" index={1} totalSlots={4} />
      <HomeCompaniesSection />
      <MiddlePageBanners location="home" index={2} totalSlots={4} />
      <HomeBlogsSection />
      <MiddlePageBanners location="home" index={3} totalSlots={4} />
      <HomeCategoriesSection />
      <FloatingPageBanners location="home" />
    </>
  );
}