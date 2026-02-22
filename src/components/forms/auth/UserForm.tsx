"use client";

import queryClient from "@/lib/queryClient";
import {  IUserCreate } from "@/types/auth/user";

import { toast } from "sonner";
import { MainForm, MainFormLoader } from "../MainForm";
import { PasswordInputGroup, SelectInputGroup, TextInputGroup } from "../InputGroups";
import { Loader2, Send, Trash2, X } from "lucide-react";
import { createUser, deleteUser, fetchUserById, updateUser } from "@/server/auth/user";
import { EAdminRole, EUserRole } from "@prisma/client";
import { EntityButton } from "@/components/ui/custom-buttons";
import { ComponentProps, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { MailSettings } from "@/emails/MailSettings";
import { sendEmail } from "@/server/email/email";

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
     const [deleting,setIsDeleting] = useState(false);

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
               const temp = MailSettings.templates.welcome;
               await sendEmail({
                    to: email,
                    subject: temp.subject,
                    html: await temp.render({name, loginInfo:{email, password}})
               })
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

     const handleDelete = async () => {
          try {
               setIsDeleting(true);
               if(confirm("Are you sure you want to delete this user? This action cannot be undone!")) {
                    if(!userId) return toast.error("User ID is required to delete a user");
                    const res = await deleteUser(userId);
                    if(!res) return toast.error("Error deleting user");
                    queryClient.invalidateQueries();
                    toast.success("User deleted successfully");
                    return onComplete();
               }
          } catch (error) {
               console.error(error);
               toast.error("Error deleting user");
          } finally {
               setIsDeleting(false);
          }
          
     }

     if(isLoading) return <MainFormLoader />
     return (
          <div className="w-full flex flex-col gap-3">
               <MainForm submitData={submitForm} btnTitle="Submit" btnIcon={<Send className="w-4 h-4" />}>
                    <TextInputGroup name="name" defaultValue={user?.name ?? undefined} label="Full Name:" required={userId ? false : true} placeholder="ex: Dushime David..." />
                    <TextInputGroup name="phone" defaultValue={user?.phone ?? undefined} label="Phone Number:" required={userId ? false : true} placeholder="ex: 0788568..." />
                    <TextInputGroup name="email" disabled={user ? true : false} defaultValue={user?.email ?? undefined} label="Email" type="email" required={userId ? false :true} placeholder="ex: david@gmail.com" />
                    {role === "ADMIN" ? <SelectInputGroup name="admin-role" label={`Role: ${user?.adminRole ?? ""}`} values={Object.values(EAdminRole).filter(v => v !== "SUPER_ADMIN" && v !== "NONE").map(v => ({label:v, value:v}))} required={user ? false :true } /> : null}
                    <PasswordInputGroup type="password" name="password" label={userId ? "Old Password" :"Password"} placeholder="**********"  required={user ? false : true}/>
                    {userId ? <PasswordInputGroup type="new-password" name="new-password" label={"New Password"} placeholder="**********" required={user ? false : true} /> : null}
                    <PasswordInputGroup type="password" name="confirm-password" label="Confirm Password" placeholder="**********" required={user ? false : true} />
               </MainForm>
               {userId && <button disabled={deleting} type="button" onClick={handleDelete} className="w-full bg-red-200 py-1.5 rounded-lg justify-center cursor-pointer flex items-center gap-1 text-red-600 hover:text-red-800">{deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete </button>}
          </div>
          
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