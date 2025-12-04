"use client";

import { apiUrl } from "@/lib/api";
import Endpoints from "@/lib/endpoints";
import queryClient from "@/lib/queryClient";
import { IBaseCategory, ICategoryCreate, ICategoryUpdate } from "@/types/common/category";
import { ECategoryType } from "@/types/common/enums"
import { DataService } from "@/util/data-service";
import { ComponentProps, useState } from "react"
import { toast } from "sonner";
import { MainForm } from "../MainForm";
import { SelectInputGroup, TextAreaInputGroup, TextInputGroup } from "../InputGroups";
import ImageUploader from "@/components/ui/upload/ImageUploader";
import { EntityButton } from "@/components/ui/custom-buttons";
import { Dialog, DialogPanel } from "@headlessui/react";
import { CloudUpload, X } from "lucide-react";
import { EAspectRatio } from "@/types/enums";

export const CategoryForm = ({id, onComplete}:{id?: string, onComplete: () => void}) => {
     const [image,setImage] = useState("");
     const submitForm = async(data:FormData) => {
          const name = data.get("name") as string
          const type = data.get("type") as ECategoryType
          const description = data.get("description") as string

          if(!id) {
               const newCategory:ICategoryCreate = {
                    name, type, description, image
               }
               const response = await DataService.post<ICategoryCreate, IBaseCategory>(apiUrl, Endpoints.COMMON.CATEGORY, newCategory);
               if(!response || !response.success) return toast.error("Error creating the category!", {description: "Please try again later"});
               toast.success("Category created successfully");
               queryClient.invalidateQueries();
               return onComplete();
          }
          const updatedCategory: ICategoryUpdate = {
               ...(name ? {name} : {} ),
               ...(type ? {type} : {} ),
               ...(description ? {description} : {} ),
               ...(image ? {image} : {} ),
          }
          const response = await DataService.put<ICategoryUpdate, IBaseCategory>(apiUrl, `${Endpoints.COMMON.CATEGORY}/${id}`, updatedCategory);
          if(!response || !response.success) return toast.error("Error updating the category!", {description: "Please try again later"});
          toast.success("Category updated successfully");
          queryClient.invalidateQueries();
          return onComplete();
     }

     return (
          <MainForm btnTitle={id ? "Update Category" : "Save Category"} submitData={submitForm}>
               <TextInputGroup name="name" label="Category Name:" placeholder="enter category name..." required={id ? false : true} />
               <SelectInputGroup name="type" label="Category Type" values={Object.values(ECategoryType).map(v => ({label:v, value:v}))} required={id ? false : true} />
               <div className="w-full flex gap-2 items-start ">
                    {
                         image ? <></> :
                         <ImageUploader name="Icon" Icon={CloudUpload} aspect={EAspectRatio.STANDARD} onUploadComplete={res => setImage(res) } />
                    }
               </div>
               <TextAreaInputGroup name="description" label="Description:" maxWords={100} required={false} placeholder="Brief description of the category..." />
          </MainForm>
     )
}

export const CategoryFormToggleBtn = ({title, ...btnProps}:{title: string} & ComponentProps<typeof EntityButton> ) => {
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
                    <CategoryForm id={btnProps.entityId} onComplete={() => setOpen(false)} />
               </DialogPanel >
               </div>
          </Dialog>
     )
}