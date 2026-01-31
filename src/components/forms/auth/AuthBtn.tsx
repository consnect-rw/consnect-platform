"use client";

import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogPanel } from "@headlessui/react";
import { X } from "lucide-react";
import { ComponentProps, ReactNode, useState } from "react";
import { UserForm } from "./UserForm";
import { LoginForm } from "./LoginForm";
import { TSessionUser } from "@/types/auth/user";

export const AuthFormToggleBtn = ({form="login", name, icon, ...btnProps}:{form?: "login" | "register", name?:string, icon?: ReactNode} & ComponentProps<"button">) => {
     const [open,setOpen] = useState(false);
     const {setUser} = useAuth();
     const [formType,setFormType] = useState(form);

     const handleLoginComplete = (user:TSessionUser) => {
          setUser(user);
          return setOpen(false);
     }

     if(!open) return <button onClick={() => setOpen(true)} {...btnProps}>{name ?? null} {icon ?? null}</button>
     return (
          <Dialog open={open} onClose={() => {}} className="relative z-50">
               <div className="fixed inset-0 bg-black/50 bg-opacity-30 flex justify-center items-center ">
                    <DialogPanel className="bg-white p-6 rounded-lg shadow-lg w-[90vw] lg:w-[40%] max-h-[90%] overflow-y-auto flex flex-col items-center justify-start gap-[10px]" onClick={(e) => e.stopPropagation()}>
                         <div className="w-full flex items-center justify-between gap-[8px]">
                              <h3 className="text-xl text-slate-800 font-bold">{formType === "login" ? "Login to Continue" : "Create a new account!"}</h3>
                              <X size={28} className="text-gray-600 border rounded-full p-1 cursor-pointer hover:text-gray-800" onClick={() => setOpen(false)} />
                         </div>
                         {
                              formType === "login" ?
                                   <LoginForm onComplete={handleLoginComplete} />
                              :
                              <UserForm onComplete={() => setFormType("login")}/>
                         }
                    </DialogPanel >
               </div>
          </Dialog>
     )
} 