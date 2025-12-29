import { AuthProvider } from "@/context/AuthContext";
import { getSessionUser } from "@/server/auth/user";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";
import { EUserRole } from "@prisma/client";
import { getRedirectPath } from "@/util/auth";

async function AuthContent({children, type}:{children: ReactNode, type?: EUserRole}) {
     const {user} = await getSessionUser();
     if(type) {
          if(!user) return redirect(`/auth/login`);
          if(user.role !== type) return redirect(getRedirectPath(user.role));
     }
     return (
          <AuthProvider authUser={user ?? null}>
               {children}
          </AuthProvider>
     )
}

export default function AuthWrapper({children, type}:{children: ReactNode, type?: EUserRole}){
     return (
          <Suspense fallback={<></>}>
               <AuthContent type={type}>
                    {children}
               </AuthContent>
          </Suspense>
     )
}