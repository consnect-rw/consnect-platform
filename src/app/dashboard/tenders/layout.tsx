import UserTendersNavBar from "@/components/layout/user/TendersNavBar";
import { ReactNode } from "react";

export default function UserTendersLayout ({children}:{children: ReactNode}) {
     return (
          <div className="w-full flex flex-col gap-8">
               <UserTendersNavBar />
               {children}
          </div>
     )
}