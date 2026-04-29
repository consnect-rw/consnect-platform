
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import AuthWrapper from "@/context/AuthWrapper";
import { BottomPageBanners, TopPageBanners } from "@/components/banners/PageBanners";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <AuthWrapper>
      <TopPageBanners location="home" />
      <Header />
      {children}
      <BottomPageBanners location="home" />
      <Footer />
    </AuthWrapper>
  );
}