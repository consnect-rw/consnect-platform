import { UserMobileTopBar, UserSideBar } from "@/components/layout/user/SideBar";
import AuthWrapper from "@/context/AuthWrapper";
import { EUserRole } from "@prisma/client";
import { ReactNode } from "react";

export default async function  UserDashboardLayout ({children}:{children: ReactNode}) {
     return (
          <AuthWrapper type={EUserRole.USER}>
               <div className="w-full h-full bg-gray-100 overflow-hidden p-2 md:p-4 flex flex-col lg:flex-row gap-4 justify-between">
                    <div className="w-64 h-full hidden lg:block"><UserSideBar /></div>
                    <UserMobileTopBar />
                    <div className="w-full h-full overflow-y-auto rounded-xl">
                    {children}
                    </div>
               </div>
          </AuthWrapper>
     )
}