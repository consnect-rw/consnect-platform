import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import AuthWrapper from "@/context/AuthWrapper";
import { ReactNode } from "react";


export default function MainLayout ({children}:{children: ReactNode}) {
     return (
          <AuthWrapper>
               <Header />
               {children}
               <Footer />
          </AuthWrapper>
     )
} 