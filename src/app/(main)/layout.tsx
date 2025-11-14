import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { ReactNode } from "react";


export default function MainLayout ({children}:{children: ReactNode}) {
     return (
          <>
               <Header />
               {children}
               <Footer />
          </>
     )
} 