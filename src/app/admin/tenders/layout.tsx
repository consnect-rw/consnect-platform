import AdminTendersNavBar from "@/components/layout/admin/AdminTendersNavBar";
import { ReactNode } from "react";

export default function AdminTendersLayout({children}:{children: ReactNode}) {
     return (
          <div className="w-full flex flex-col gap-8">
               <AdminTendersNavBar />
               {children}
          </div>
     )
}