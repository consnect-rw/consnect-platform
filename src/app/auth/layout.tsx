import { AuthProvider } from "@/context/AuthContext";
import { getSessionUser } from "@/server/auth/user";
import { ReactNode } from "react";

export default async function AuthLayout ({children}:{children: ReactNode}) {
     const {user} = await getSessionUser();
     return (
          <AuthProvider authUser={user}>{children}</AuthProvider>
     )
}