import AdminCompanyNavBar from "@/components/layout/admin/AdminCompanyNavBar";
import { ReactNode } from "react";

export default function AdminCompaniesLayout({children}:{children: ReactNode}){
     return(
          <div className="w-full flex flex-col gap-8">
               <AdminCompanyNavBar />
               {children}
          </div>
     )
}