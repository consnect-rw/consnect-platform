/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const AuthTextInput = ({label, type, name, placeholder,action}:{label: string,type?:string, name:string, placeholder: string, action?:(res:string)=> unknown }) => {
     return (
          <div className="w-full flex flex-col items-start justify-normal gap-[5px]">
               <label className="text-base font-bold text-gray-700" htmlFor={name}>{label}</label>
               <Input className="w-full text-sm active:outline-blue-400" required type={type || "text"} name={name} id={name} placeholder={placeholder} onChange={e => action ?  action(e.target.value) : null}  />
          </div>
     )
}

export const AuthPasswordInput = ({label, name, placeholder,action}:{label: string, name:string, placeholder: string, action?:(res:string)=> unknown }) => {
     const [showPassword, setShowPassword] = useState<boolean>(false);
     return (
          <div className="w-full flex flex-col items-start justify-normal gap-1">
               <label className="text-sm font-bold text-gray-700" htmlFor={name}>{label}</label>
               <div className="w-full relative">
                    <Input required className="w-full placeholder:text-sm active:outline-blue-400 " type={showPassword ? "text":"password"} name={name} id={name} placeholder={placeholder} onChange={e => action ?  action(e.target.value) : null}  />
                    {
                         !showPassword ? 
                         <i className="text-gray-500 text-base absolute right-1 top-[50%] -translate-y-[50%] cursor-pointer hover:text-gray-700 " onClick={() => setShowPassword(true)}><FaEye /></i>
                         :
                         <i className="text-gray-500 text-base absolute right-1 top-[50%] -translate-y-[50%] cursor-pointer hover:text-gray-700 " onClick={() => setShowPassword(false) } ><FaEyeSlash /></i>
                    }
               </div>
          </div>
     )
}

export const AuthSubmitBtn = ({name, loading}:{name:string, loading: boolean}) => {
     return (
          <Button type="submit" disabled={loading} className="w-full text-base font-medium text-white outline-none bg-yellow-600 cursor-pointer hover:bg-yellow-800 disabled:bg-gray-600 transition-all duration-200 ">{loading ? <Loader2 size={18} className="text-gray-200 animate-spin"/> : null} {loading ? "Authenticating..." :name}</Button>
     )
} 

export const AuthLogoutBtn = ({name, className, variant, size, icon}:{name?:string, className?:string, variant?:"link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined, size?:"sm" | "default" | "lg" | null | undefined, icon?:React.ReactNode}) => {
     const [loading,setLoading] = useState(false);
     const router = useRouter();

     const handleClick = async() => {
          try {
               setLoading(true);
               await signOut();
               toast.success("You have been logged out!");
               return router.push("/auth/login");
          } catch (error) {
               console.log(error);
               return 
          }finally{
               setLoading(false);
          }
          
     }
     return (
          <Button onClick={handleClick} variant={variant} size={size} className={className ? className : "w-full bg-orange-600 hover:bg-orange-800 text-white transition-all duration-200 "} type="button">
               {loading ? <Loader2 className="animate-spin" /> : icon ?? null}
               { loading ? null : name ?? null}
          </Button>
     )
}

// export const GoogleSignBtn = ({className, variant}:{className?:string, variant?:"link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined}) => {
//      const [loading, setLoading] = useState(false);
//      const signIn = async() => {
//           try {
//                setLoading(true);
//                return await GoogleSignIn();
//           } catch (error) {
//                toast.error("Error logging with Google!");
//           }finally{
//                setLoading(false);
//           }
//      }
//      return (
//           <Button variant={variant} disabled={loading} type="button" onClick={signIn} className={className ? className : "w-full flex items-center justify-center gap-3 rounded-3xl p-3 bg-gradient-to-br from-orange-600 to-orange-800 transition-all duration-200 disabled:cursor-progress"}>
//                <i className="text-xl"><FcGoogle /></i>
//                {loading ? null : "Continue with Google"}
//           </Button>
//      )
// }