import { getSessionUser } from "@/lib/actions";
import { EUserRole } from "@/types/auth/user";
import { getRedirectPath } from "@/util/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function  UserDashboardLayout ({children}:{children: ReactNode}) {
     const {user} = await getSessionUser();
     if (!user) return redirect("/auth/login");
     if(user.role !== EUserRole.USER) return redirect(getRedirectPath(user.role));
     return (
          <div>{children}</div>
     )
}