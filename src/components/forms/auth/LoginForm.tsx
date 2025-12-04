"use client";

import { useAuth} from "@/hooks/useAuth";
import { IAuthUser } from "@/types/auth/user";
import { CredentialsSignin } from "@/util/auth";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import { AuthPasswordInput, AuthSubmitBtn, AuthTextInput } from "../AuthForms";
import { getSessionUser } from "@/lib/actions";
import Link from "next/link";

export const LoginForm = ({onComplete}:{onComplete: (user: IAuthUser) => void}) => {
     const {setUser} = useAuth();
     const [loading, setLoading] = useState(false);
     const submitForm = async(event: ChangeEvent<HTMLFormElement>) => {
          event.preventDefault();
          try {
               setLoading(true);
               const formData = new FormData(event.currentTarget);
               const email = formData.get("email") as string;
               const password = formData.get("password") as string;

               if(!email || !password) return toast.warning("Please fill in the required fields");
               const res = await CredentialsSignin(formData);
               if(!res) return toast.error("Application error");

               if(res.error) return toast.error("Invalid email or password");
               
               const {user} = await getSessionUser();
               if(!user) return toast.warning("User account not found!");
               setUser(user);
               toast.success("Login success");
               return onComplete(user);
          } catch (error) {
               console.log(error);
               return toast.error("Application error. Please try again!");
          }finally{
               setLoading(false);
          }
     }
     return (
          <form onSubmit={submitForm} className="w-full max-w-2xl flex flex-col items-center justify-center gap-4 bg-white p-0 lg:p-6  rounded-lg ">
               <AuthTextInput name="email" label="Email: " placeholder="ex dushime@gmail.com..." />
               <AuthPasswordInput name="password" label="Password" placeholder="***********" />
               <div className="w-full flex items-center justify-between text-sm">
                         <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="rounded border-gray-300 text-amber-500 focus:ring-amber-500" />
                              <span className="text-gray-600">Remember me</span>
                         </label>
                         <a href="/auth/forgot-password" className="text-amber-600 hover:text-amber-700 font-medium">
                              Forgot password?
                         </a>
                    </div>
               <AuthSubmitBtn name="Login" loading={loading} />
               <div className="w-full space-y-4">
                    <p className="text-center text-sm text-gray-600">
                         Don't have an account?{' '}
                         <Link  href="/auth/register" prefetch className="text-amber-600 hover:text-amber-700 font-medium">
                              Sign up
                         </Link>
                    </p>
              </div>
          </form>
     )
}