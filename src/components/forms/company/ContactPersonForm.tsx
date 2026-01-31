"use client";

import { MainForm } from "../MainForm";
import { SelectInputGroup, TextInputGroup } from "../InputGroups";
import { toast } from "sonner";
import queryClient from "@/lib/queryClient";
import { createContactPerson, updateContactPerson } from "@/server/company/contact-person";
import { TContactPerson } from "@/types/company/contact-person";
import { ComponentProps, useState } from "react";
import { EntityButton } from "@/components/ui/custom-buttons";
import { Dialog, DialogPanel } from "@headlessui/react";
import { X } from "lucide-react";
import { EContactPersonLevel } from "@prisma/client";

export const ContactPersonForm = ({person, companyId, onComplete}:{person?: TContactPerson, companyId:string, onComplete: () => void}) => {

     const submitData = async(data: FormData) => {
          const name = data.get("name") as string;
          const role = data.get("role") as string;
          const level = data.get("level") as EContactPersonLevel;
          const contactEmail = data.get("contact-email") as string;
          const contactPhone = data.get("contact-phone") as string;

          if(!person) {
               const newFounder = await createContactPerson({
                    name,role, contactEmail, contactPhone, level,
                    company: {connect: {id: companyId}}
               });

               if(!newFounder) return toast.error("Error adding new founder");
               queryClient.invalidateQueries();
               toast.success("successfully added new founder");
               return onComplete();
          }else {
               const updatedFounder = await updateContactPerson(person.id,{
                    ...(name ? {name} : {} ),
                    ...(level ? {level} : {} ),
                    ...(role ? {role} : {} ),
                    ...(contactEmail ? {contactEmail} : {} ),
                    ...(contactPhone? {contactPhone} : {} ),
               });
               if(!updatedFounder) return toast.error("Error updating founder info!");
               queryClient.invalidateQueries();
               toast.success("successfully updated founder information!");
               return onComplete();
          }
     }

     
     return (
          <MainForm submitData={submitData}>
               <TextInputGroup name="name" label={`Founder Name: ${person?.name ?? ""}`} placeholder="ex Dushime David...." required={person ? false: true} />
               <TextInputGroup name="role" label={`Role: ${person?.role ?? ""}`} placeholder="ex Customer Support..." required={person ? false: true} />
               <TextInputGroup name="contact-email" label={`Contact Email: ${person?.contactEmail ?? ""}`} placeholder="ex david@gmail.com..." required={person ? false: true} />
               <TextInputGroup name="contact-phone" label={`Contact Phone: ${person?.contactPhone ?? ""}`} placeholder="ex 07809545..." required={person ? false: true} />
               <SelectInputGroup name="level" label="Level: " values={Object.values(EContactPersonLevel).map(v => ({label: v, value: v}))} required={person ? false : true} />
          </MainForm>
     )
}

export const ContactPersonFormToggleBtn = ({title, companyId, person,...btnProps}:{title: string, person?: TContactPerson, companyId:string} & ComponentProps<typeof EntityButton> ) => {
     const [open,setOpen] = useState(false);
     
     if(!open) return <EntityButton  onClick={() => setOpen(true)} {...btnProps} />
     return (
          <Dialog open={open} onClose={() => {}} className="relative z-50">
               <div className="fixed inset-0 bg-black/50 bg-opacity-30 flex justify-center items-center ">
               <DialogPanel className="bg-white p-6 rounded-lg shadow-lg w-[90vw] lg:w-[40%] max-h-[90%] overflow-y-auto flex flex-col items-center justify-start gap-[10px]" onClick={(e) => e.stopPropagation()}>
                    <div className="w-full flex items-center justify-between gap-[8px]">
                         <h3 className="text-xl text-slate-800 font-bold">{title}</h3>
                         <X size={28} className="text-gray-600 border rounded-full p-1 cursor-pointer hover:text-gray-800" onClick={() => setOpen(false)} />
                    </div>
                    <ContactPersonForm person={person} onComplete={() => setOpen(false)} companyId={companyId} />
               </DialogPanel >
               </div>
          </Dialog>
     )
}