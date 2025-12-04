"use client";

import { IAuthUser } from "@/types/auth/user";
import { createContext, ReactNode, useState } from "react";


interface AuthContextType {
     user: IAuthUser | null | undefined;
     setUser: (user: IAuthUser | null | undefined) => void;
     authOn: boolean;
     setAuthOn: (option:boolean) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({authUser, children}:{children: ReactNode, authUser: IAuthUser | null | undefined}) {
     const [user, setUser] = useState<IAuthUser | null | undefined>(authUser);
     const [authOn, setAuthOn] = useState(authUser ? false : true);

     return (
          <AuthContext.Provider value={{user, setUser, authOn, setAuthOn}}>
               {children}
          </AuthContext.Provider>
     )
}

