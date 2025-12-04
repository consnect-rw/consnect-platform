"use client";

import { apiUrl } from "@/lib/api";
import Endpoints from "@/lib/endpoints";
import queryClient from "@/lib/queryClient";
import { ILoginRequest } from "@/types/auth/auth";
import { IAuthUser, IDefaultUser, IUserCreate } from "@/types/auth/user";
import { DataService } from "@/util/data-service";
import { toast } from "sonner";
import { MainForm } from "../MainForm";
import { PasswordInputGroup, TextInputGroup } from "../InputGroups";
import { AuthTextInput } from "../AuthForms";
import { Send } from "lucide-react";

interface IUserFormProps {
     userId?: string
     onComplete: () => void
}

export const UserForm = ({userId, onComplete}:IUserFormProps) => {
     const submitForm = async(data: FormData) => {
          const name = data.get("name") as string;
          const phone = data.get("phone") as string;
          const email = data.get("email") as string;
          const newPassword = userId ? data.get("new-password") as string : "";
          const password = data.get("password") as string;
          const confirmPassword = data.get("confirm-password") as string;

          
          if(!userId) {
               if(!name || !phone || ! email || ! password) return ("Please fill all fields");
               if(password !== confirmPassword) return toast.warning("Please passwords do not match!")
   
               const newUser: IUserCreate = {
                    name, phone, email, password
               }
               const response = await DataService.post<IUserCreate,IDefaultUser>(apiUrl, Endpoints.AUTH.USER, newUser);
               if(!response || !response.success) return toast.error("Erroring creating your account!");
               queryClient.invalidateQueries();
               toast.success("Success creating your account");
               return onComplete();
          }

          const updatedUser: Partial<IUserCreate> = {
               ...(name ? {name} :{}),
               ...(phone ? {phone} :{}),
               ...(name ? {name} :{}),
          }

          if(newPassword) {
               if(newPassword !== confirmPassword ) return toast.warning("New Passwords don not match!")
               updatedUser.password = newPassword;
          }
          const response = await DataService.put<Partial<IUserCreate>, IDefaultUser>(apiUrl, `${Endpoints.AUTH.USER}/${userId}`, updatedUser);
          if(!response || !response.success) return toast.error("Erroring updating your account!");
          queryClient.invalidateQueries();
          toast.success("Success updating your account");
          return onComplete();
     }

     return (
          <MainForm submitData={submitForm} btnTitle="Submit" btnIcon={<Send className="w-4 h-4" />}>
               <TextInputGroup name="name" label="Full Name:" required={userId ? false : true} placeholder="ex: Dushime David..." />
               <TextInputGroup name="phone" label="Phone Number:" required={userId ? false : true} placeholder="ex: 0788568..." />
               <TextInputGroup name="email" label="Email" type="email" required={userId ? false :true} placeholder="ex: david@gmail.com" />
               <PasswordInputGroup type="password" name="password" label={userId ? "Old Password" :"Password"} placeholder="**********" />
               {userId ? <PasswordInputGroup type="new-password" name="new-password" label={"New Password"} placeholder="**********" /> : null}
               <PasswordInputGroup type="password" name="confirm-password" label="Confirm Password" placeholder="**********" />
          </MainForm>
     )
}