import AdminOffersNavBar from "@/components/layout/admin/AdminOffersNavBar";
import AdminPageNavBar from "@/components/layout/admin/PageNavBar";
import { ReactNode } from "react";

export default function AdminOffersLayout({children}:{children: ReactNode}) {
     return (
          <div className="w-full flex flex-col gap-8">
               <AdminOffersNavBar />
               {children}
          </div>
     )
}