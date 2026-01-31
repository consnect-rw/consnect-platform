"use client";

import { IAuthUser, TSessionUser } from "@/types/auth/user";
import { createContext, ReactNode, useState } from "react";


interface AuthContextType {
     user: TSessionUser | null | undefined;
     setUser: (user: TSessionUser | null | undefined) => void;
     authOn: boolean;
     setAuthOn: (option:boolean) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({authUser, children}:{children: ReactNode, authUser: TSessionUser | null | undefined}) {
     const [user, setUser] = useState<TSessionUser | null | undefined>(authUser);
     const [authOn, setAuthOn] = useState(authUser ? false : true);

     return (
          <AuthContext.Provider value={{user, setUser, authOn, setAuthOn}}>
               {children}
          </AuthContext.Provider>
     )
}

