"use client";

import { getSessionUser } from "@/server/auth/user";
import { IAuthUser, TSessionUser } from "@/types/auth/user";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useState } from "react";


interface AuthContextType {
     user: TSessionUser | null | undefined;
     setUser: (user: TSessionUser | null | undefined) => void;
     authOn: boolean;
     setAuthOn: (option:boolean) => void;
     refresh?: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({authUser, children}:{children: ReactNode, authUser: TSessionUser | null | undefined}) {
     const [user, setUser] = useState<TSessionUser | null | undefined>(authUser);
     const [authOn, setAuthOn] = useState(authUser ? false : true);
     const router = useRouter();
     const refresh = async () => {
          const {user} = await getSessionUser()
          setUser(user);
     }

     return (
          <AuthContext.Provider value={{user, setUser, authOn, setAuthOn, refresh}}>
               {children}
          </AuthContext.Provider>
     )
}

