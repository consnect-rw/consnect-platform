import { getSessionUser } from "@/lib/actions";
import { getRedirectPath } from "@/util/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AuthLayout ({children}:{children: ReactNode}) {
     const {user} = await getSessionUser();
     if(user) return redirect(getRedirectPath(user.role));
     return (
          <>{children}</>
     )
}