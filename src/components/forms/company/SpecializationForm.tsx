"use client";

import queryClient from "@/lib/queryClient";
import { createCompanySpecialization, updateCompanySpecialization } from "@/server/company/company-specialization";
import { toast } from "sonner";
import { MainForm } from "../MainForm";
import { TextAreaInputGroup, TextInputGroup } from "../InputGroups";
import { ComponentProps, useState } from "react";
import { EntityButton } from "@/components/ui/custom-buttons";
import { Dialog, DialogPanel } from "@headlessui/react";
import { X } from "lucide-react";

export const SpecializationForm = ({specialization, categoryId, onComplete}: {specialization?: {id:string, name:string, description?: string}, categoryId:string, onComplete: () => void}) => {
     
     const submitData = async (data: FormData) => {
          const name = data.get("name") as string;
          const description = data.get("description") as string;

          if(!specialization) {
               const newSpecialization = await createCompanySpecialization({
                    name,
                    ...(description && {description}),
                    category:{connect:{id: categoryId}}
               });
               if(!newSpecialization) return toast.error("Something went wrong. Please try again"); 
               queryClient.invalidateQueries();
               toast.success("New Specialization Added");
               return onComplete();
          }
          const updatedSpecialization = await updateCompanySpecialization(specialization.id, {
               ...(name && {name}),
               ...(description && {description}),
          })
          if(!updatedSpecialization) return toast.error("Something went wrong. Please try again"); 
          queryClient.invalidateQueries();
          toast.success("Updating successful");
          return onComplete();
     }

     return (
          <MainForm submitData={submitData}>
               <TextInputGroup name="name" label="Specialization Name: " defaultValue={specialization?.name} required={specialization ? false : true} />
               <TextAreaInputGroup name="description" label="Description" placeholder="Briefly describe the specialization" defaultValue={specialization?.description} required={false} maxWords={100} />

          </MainForm>
     )
}

export const SpecializationFormToggleBtn = ({title, categoryId, specialization,  ...btnProps}:{title: string, specialization?: {id:string, name:string, description?: string}, categoryId:string} & ComponentProps<typeof EntityButton> ) => {
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
                    <SpecializationForm categoryId={categoryId} specialization={specialization} onComplete={() => setOpen(false)} />
               </DialogPanel >
               </div>
          </Dialog>
     )
}