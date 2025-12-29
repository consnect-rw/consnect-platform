import UserOffersNavBar  from "@/components/layout/user/OffersNavbar";
import { ReactNode } from "react";

export default function UserOffersLayout ({children}:{children: ReactNode}) {
     return (
          <div className="w-full flex flex-col gap-8">
               <UserOffersNavBar />
               {children}
          </div>
     )
}