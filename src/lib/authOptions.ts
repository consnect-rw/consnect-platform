/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefaultSession, DefaultUser, NextAuthOptions, Session as NextAuthSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { EUserRole, IAuthUser } from "@/types/auth/user";
import { DataService } from "@/util/data-service";
import { apiUrl } from "./api";
import Endpoints from "./endpoints";
import { ILoginRequest } from "@/types/auth/auth";

declare module "next-auth" {
     interface Session extends DefaultSession {
          user: {
               type: EUserRole;
          } & DefaultSession["user"];
     }

     interface User extends DefaultUser {
          type?: EUserRole;
     }
}

export const authOptions: NextAuthOptions = {
     // adapter: PrismaAdapter(prisma),
     providers: [
          CredentialsProvider({
               name: "Credentials",
               credentials: {
               email: { label: "Email", type: "email" },
               password: { label: "Password", type: "password" },
               },
               async authorize(credentials) {
                    const { email, password } = credentials as {
                         email: string;
                         password: string;
                    };

                    
                    const response = await DataService.post<ILoginRequest,IAuthUser>(apiUrl, `${Endpoints.AUTH.AUTH}/check-credentials`, {email, password});
                    if (!response || !response.success || !response.data) return null;
                    const user = response.data;
                    console.log(user);
                    if(!user.active) return null;
                    return {
                         ...user,
                         id: (user.id || "").toString(),
                    };
               },
          }),
     ],
     session: {
          strategy: "jwt",
          maxAge: 2 * 60 * 60,
     },
     jwt: {
          maxAge: 2 * 60 * 60,
     },
     cookies: {
          sessionToken: {
               name: `next-auth.session-token`,
               options: {
                    httpOnly: true, // Prevent JavaScript access
                    secure: process.env.NODE_ENV === "production", // Use HTTPS in production
                    sameSite: "lax", // Prevent CSRF attacks
                    path: "/", // Apply to the whole site
               },
          },
     },
     callbacks: {
          async jwt({token, user}) {
               if (user) {
                    const myUser = user;
                    token.id = myUser.id;
                    token.email = myUser.email;
                    token.type = myUser.type;
                    token.picture = myUser.image
                    token.iat = Math.floor(Date.now() / 1000); // Issue time
                    token.exp = (token.iat as number) + 2 * 60 * 60;
               }
               return token;
          },
          async session({ session, token }: { session: NextAuthSession; token: any }) {
               // Add additional fields to the session object
               if (token) {
                    if (token.exp && Date.now() >= token.exp * 1000) {
                         throw new Error("Session expired. Please log in again.");
                    }
                    session.user = {
                         ...session.user,
                         email: token.email,
                         type: token.type,
                         image: token.picture || null
                    };
               }else {
                    console.error("Token is undefined in session callback.");
               }
               return session;
          },
     },
     secret: process.env.NEXTAUTH_SECRET,
     pages: {
          signIn: "/auth/login",
     },
};