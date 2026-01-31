"use client";

import { TService } from "@/types/company/service";
import { MainForm, MainFormLoader } from "../MainForm";
import { SelectInputGroup, TextAreaInputGroup, TextInputGroup } from "../InputGroups";
import { useQuery } from "@tanstack/react-query";
import { fetchCategorys } from "@/server/common/category";
import { ComponentProps, useState } from "react";
import { EntityButton } from "@/components/ui/custom-buttons";
import { createService, updateService } from "@/server/company/service";
import { toast } from "sonner";
import queryClient from "@/lib/queryClient";
import { Dialog, DialogPanel } from "@headlessui/react";
import { X } from "lucide-react";

export const ServiceForm = ({onComplete,service, companyId}:{onComplete: () => void, service?: TService, companyId: string}) => {
     const {data:categoriesData, isLoading} = useQuery({
          queryKey:["service-categories"],
          queryFn: () => fetchCategorys({name:true, id:true}, {type: "SERVICE"},100)
     });
     const categories = categoriesData?.data ?? [];
     const submitData = async (data: FormData) => {
          const name = data.get("name") as string;
          const description = data.get("description") as string;
          const categoryId = data.get("category") as string;
          if(!service) {
               const newService = await createService({
                    name, description,
                    category:{connect: {id: categoryId}},
                    company: {connect:{id: companyId}}
               });
               if(!newService) return toast.error("Error adding new service!"),
               await queryClient.invalidateQueries();
               toast.success("Company service added successfully");
               return onComplete();
          }
          const updatedService = await updateService(service.id, {
               ...(name ? {name} : {}),
               ...(description ? {description} : {}),
               ...(categoryId ? {category: {connect: {id: categoryId}}} : {})
          });
          if(!updatedService) return toast.error("Error updating company service!"),
          await queryClient.invalidateQueries();
          toast.success("Company service updated successfully");
          return onComplete();
     }
     if(isLoading) return <MainFormLoader />
     return (
          <MainForm submitData={submitData}>
               <SelectInputGroup name="category" label="Service Category" values={categories.map(c => ({label: c.name, value: c.id}))} required={service ? false : true }  />
               <TextInputGroup name="name" label="Specializations or Unique Capabilities" required={service ? false : true} placeholder="enter by comma(,)" defaultValue={service?.name} />
               <TextAreaInputGroup name="description" label="Describe what you do" placeholder="Briefly explain what you so under this category" maxWords={100} required={service ? false : true} defaultValue={service?.description} />
          </MainForm>
     )
}

export const ServiceFormToggleBtn = ({title, companyId, service,...btnProps}:{title: string, service?: TService, companyId:string} & ComponentProps<typeof EntityButton> ) => {
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
                    <ServiceForm service={service} onComplete={() => setOpen(false)} companyId={companyId} />
               </DialogPanel >
               </div>
          </Dialog>
     )
}