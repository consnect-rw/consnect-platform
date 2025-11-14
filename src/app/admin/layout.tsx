import { getSessionUser } from "@/lib/actions";
import { EUserRole } from "@/types/auth/user";
import { getRedirectPath } from "@/util/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AdminLayout ({children}:{children: ReactNode}) {
     const {user} = await getSessionUser();
     if (!user) return redirect("/auth/login");
     if(user.role !== EUserRole.ADMIN) return redirect(getRedirectPath(user.role));
     return (
          <>
               {children}
          </>
     )
}