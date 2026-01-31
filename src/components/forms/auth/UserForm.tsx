"use client";

import queryClient from "@/lib/queryClient";
import {  IUserCreate } from "@/types/auth/user";

import { toast } from "sonner";
import { MainForm } from "../MainForm";
import { PasswordInputGroup, SelectInputGroup, TextInputGroup } from "../InputGroups";
import { Send, X } from "lucide-react";
import { createUser, fetchUserById, updateUser } from "@/server/auth/user";
import { EAdminRole, EUserRole } from "@prisma/client";
import { EntityButton } from "@/components/ui/custom-buttons";
import { ComponentProps, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";

interface IUserFormProps {
     userId?: string
     onComplete: () => void
     role?: EUserRole
}

export const UserForm = ({userId, role,onComplete}:IUserFormProps) => {
     const {data: user, isLoading} = useQuery({
          queryKey: ["admin-user-form-data", userId],
          queryFn: () => userId ? fetchUserById(userId, {email:true, name:true, role:true, adminRole:true, active:true, phone:true, image:true,}) : undefined
     });
     const submitForm = async(data: FormData) => {
          const name = data.get("name") as string;
          const phone = data.get("phone") as string;
          const email = data.get("email") as string;
          const adminRole = data.get("admin-role") as EAdminRole;
          const newPassword = userId ? data.get("new-password") as string : "";
          const password = data.get("password") as string;
          const confirmPassword = data.get("confirm-password") as string;

          
          if(!userId) {
               if(!name || !phone || ! email || ! password) return ("Please fill all fields");
               if(password !== confirmPassword) return toast.warning("Please passwords do not match!")

               const response = await createUser({name, phone, email, password, ...(role ? {role} : {}), ...(adminRole ? {adminRole} : {})});
               if(!response) return toast.error("Erroring creating your account!");
               queryClient.invalidateQueries();
               toast.success("Success creating your account");
               return onComplete();
          }

          const updatedUser: Partial<IUserCreate> = {
               ...(name ? {name} :{}),
               ...(phone ? {phone} :{}),
               ...(name ? {name} :{}),
               ...(adminRole ? {adminRole} :{})
          }

          if(newPassword) {
               if(newPassword !== confirmPassword ) return toast.warning("New Passwords don not match!")
               updatedUser.password = newPassword;
          }
          const response = await updateUser(userId, updatedUser);
          if(!response) return toast.error("Erroring updating your account!");
          queryClient.invalidateQueries();
          toast.success("Success updating your account");
          return onComplete();
     }

     return (
          <MainForm submitData={submitForm} btnTitle="Submit" btnIcon={<Send className="w-4 h-4" />}>
               <TextInputGroup name="name" defaultValue={user?.name ?? undefined} label="Full Name:" required={userId ? false : true} placeholder="ex: Dushime David..." />
               <TextInputGroup name="phone" defaultValue={user?.phone ?? undefined} label="Phone Number:" required={userId ? false : true} placeholder="ex: 0788568..." />
               <TextInputGroup name="email" disabled={user ? true : false} defaultValue={user?.email ?? undefined} label="Email" type="email" required={userId ? false :true} placeholder="ex: david@gmail.com" />
               {role === "ADMIN" ? <SelectInputGroup name="admin-role" label={`Role: ${user?.adminRole ?? ""}`} values={Object.values(EAdminRole).filter(v => v !== "SUPER_ADMIN" && v !== "NONE").map(v => ({label:v, value:v}))} required={user ? false :true } /> : null}
               <PasswordInputGroup type="password" name="password" label={userId ? "Old Password" :"Password"} placeholder="**********"  required={user ? false : true}/>
               {userId ? <PasswordInputGroup type="new-password" name="new-password" label={"New Password"} placeholder="**********" required={user ? false : true} /> : null}
               <PasswordInputGroup type="password" name="confirm-password" label="Confirm Password" placeholder="**********" required={user ? false : true} />
          </MainForm>
     )
}

export const UserFormToggleBtn = ({title, role, ...btnProps}:{title: string, role:EUserRole} & ComponentProps<typeof EntityButton> ) => {
     const [open,setOpen] = useState(false);
     
     if(!open) return <EntityButton  onClick={() => setOpen(true)} {...btnProps} />
     return (
          <Dialog open={open} onClose={() => {}} className="relative z-50">
               <div className="fixed inset-0 bg-black/50 bg-opacity-30 flex justify-center items-center ">
               <DialogPanel className="bg-white p-6 rounded-lg shadow-lg w-[90vw] lg:w-[40%] max-h-[90%] overflow-y-auto flex flex-col items-center justify-start gap-3" onClick={(e) => e.stopPropagation()}>
                    <div className="w-full flex items-center justify-between gap-2">
                         <h3 className="text-xl text-slate-800 font-bold">{title}</h3>
                         <X size={28} className="text-gray-600 border rounded-full p-1 cursor-pointer hover:text-gray-800" onClick={() => setOpen(false)} />
                    </div>
                    <UserForm role={role} userId={btnProps.entityId} onComplete={() => setOpen(false)} />
               </DialogPanel >
               </div>
          </Dialog>
     )
}