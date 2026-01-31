import CompanySettingsNavBar from "@/components/layout/user/SettingsNavBar";
import { ReactNode } from "react";

export default function CompanySettingsLayout ({children}:{children: ReactNode}) {
     return (
          <div className="w-full rounded-xl bg-white h-full overflow-y-auto p-4 flex flex-col gap-4">
               <div className="w-full flex flex-col gap-2">
                    <h1 className="text-2xl font-extrabold text-gray-800">Company Settings</h1>
                    <p className="text-sm font-medium text-gray-600">Edit you company information so other users know more about you!</p>
               </div>
               <CompanySettingsNavBar />
               {children}
          </div>
     )
}