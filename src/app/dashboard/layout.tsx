import { UserMobileTopBar, UserSideBar } from "@/components/layout/user/SideBar";
import AuthWrapper from "@/context/AuthWrapper";
import { EUserRole } from "@prisma/client";
import { ReactNode } from "react";

export default function UserDashboardLayout({ children }: { children: ReactNode }) {
     return (
          <AuthWrapper type={EUserRole.USER}>
               <div className="w-full h-dvh bg-gray-100 overflow-hidden p-2 md:p-4 flex flex-col lg:flex-row gap-4">
                    <div className="w-64 shrink-0 hidden lg:block h-full">
                         <UserSideBar />
                    </div>
                    <div className="lg:hidden shrink-0">
                         <UserMobileTopBar />
                    </div>
                    <div className="w-full min-w-0 flex-1 min-h-0 overflow-y-auto rounded-xl">
                         {children}
                    </div>
               </div>
          </AuthWrapper>
     )
}