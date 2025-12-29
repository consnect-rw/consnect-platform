import { AdminMobileTopBar, AdminSideBar } from "@/components/layout/admin/SideBar";
import AuthWrapper from "@/context/AuthWrapper";
import { getSessionUser } from "@/lib/actions";
import { EUserRole } from "@/types/auth/user";
import { getRedirectPath } from "@/util/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AdminLayout ({children}:{children: ReactNode}) {
     return (
          <AuthWrapper type={EUserRole.ADMIN}>
               <div className="w-full h-dvh bg-gray-100 overflow-hidden p-2 md:p-4 flex flex-col lg:flex-row gap-4 justify-between">
                    <div className="w-64 h-full hidden lg:block"><AdminSideBar /></div>
                    <AdminMobileTopBar />
                    <div className="w-full h-full overflow-y-auto rounded-xl">
                    {children}
                    </div>
               </div>
          </AuthWrapper>
     )
}