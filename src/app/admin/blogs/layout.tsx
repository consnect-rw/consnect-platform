import AdminBlogsNavBar from "@/components/layout/admin/AdminBlogsNavBar";
import { ReactNode } from "react";

export default function AdminBlogsLayout({children}:{children: ReactNode}) {
     return (
          <div className="w-full flex flex-col gap-8">
               <AdminBlogsNavBar />
               {children}
          </div>
     )
}