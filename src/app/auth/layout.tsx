import { AuthProvider } from "@/context/AuthContext";
import AuthWrapper from "@/context/AuthWrapper";
import { getSessionUser } from "@/server/auth/user";
import { ReactNode } from "react";

export default async function AuthLayout ({children}:{children: ReactNode}) {
     return (
          <AuthWrapper>{children}</AuthWrapper>
     )
}