import { AdminUsersNavBar } from "@/components/layout/admin/AdminUsersNavBar";
import { ReactNode } from "react";

export default function AdminUsersLayout({children}:{children: ReactNode}) {
     return (
          <div className="w-full flex flex-col gap-8">
               <AdminUsersNavBar />
               {children}
          </div>
     )
}