import AdminMonitoringNavBar from "@/components/layout/admin/AdminMonitoringNavBar";
import { ReactNode } from "react";

export default function MonitoringLayout({children}:{children:ReactNode}) {
     return (
          <div className="w-full flex flex-col gap-8">
               <AdminMonitoringNavBar/>
               {children}
          </div>
     )
}