"use client";

import queryClient from "@/lib/queryClient";
import { ComponentProps, useEffect, useState } from "react"
import { toast } from "sonner";
import { MainForm } from "../MainForm";
import {  TextAreaInputGroup, TextInputGroup } from "../InputGroups";
import ImageUploader from "@/components/ui/upload/ImageUploader";
import { EntityButton } from "@/components/ui/custom-buttons";
import { Dialog, DialogPanel } from "@headlessui/react";
import { CloudUpload, Trash, X } from "lucide-react";
import { EAspectRatio } from "@/types/enums";
import { createCategory, updateCategory } from "@/server/common/category";
import { ECategoryType } from "@prisma/client";
import Image from "@/components/ui/Image";
import { deleteSingleImage } from "@/util/s3Helpers";
import { TAdminCategoryCard } from "@/types/common/category";

export const CategoryForm = ({category, type, onComplete}:{category?: TAdminCategoryCard, onComplete: () => void, type: ECategoryType}) => {
     const [image,setImage] = useState("");
     const submitForm = async(data:FormData) => {
          const name = data.get("name") as string
          const description = data.get("description") as string

          if(!category) {
               const response = await createCategory({name, type, description, image});
               if(!response) return toast.error("Error creating the category!", {description: "Please try again later"});
               toast.success("Category created successfully");
               queryClient.invalidateQueries();
               return onComplete();
          }

          const response = await updateCategory(category.id ?? "", {
               ...(name ? {name} : {} ),
               ...(description ? {description} : {} ),
               ...(image ? {image} : {} )
          });
          if(!response) return toast.error("Error updating the category!", {description: "Please try again later"});
          toast.success("Category updated successfully");
          queryClient.invalidateQueries();
          return onComplete();
     }

     const deleteImage = async() => {
          try {
               await deleteSingleImage(image);
               setImage("");
               return toast.success("Image deleted successfully");
          } catch (error) {
               console.log(error);
               return toast.error("Error deleting image!");
          }
     }

     useEffect(() => {
          if(category){
               setImage(category.image ?? "");
          }
     }, [category])

     return (
          <MainForm btnTitle={category ? "Update Category" : "Save Category"} submitData={submitForm}>
               <TextInputGroup name="name" label={`Category Name: ${category?.name}`} placeholder="enter category name..." required={category ? false : true} />
               <div className="w-full flex flex-col gap-2 items-start ">
                    {
                         image ? 
                         <>
                         <Image src={image} alt="category image" className="w-32 rounded-lg" />
                         <button onClick={deleteImage} type="button" className="rounded-lg py-1.5 px-3 flex items-center gap-2 bg-red-100 text-red-600"><Trash className="w-4 h-4" /> Delete</button>
                         </> :
                         <ImageUploader name="Icon" Icon={CloudUpload} aspect={EAspectRatio.STANDARD} onUploadComplete={res => setImage(res) } />
                    }
               </div>
               <TextAreaInputGroup defaultValue={category?.description ?? ""} name="description" label="Description:" maxWords={100} required={false} placeholder="Brief description of the category..." />
          </MainForm>
     )
}

export const CategoryFormToggleBtn = ({title, categoryType, category, ...btnProps}:{title: string, categoryType:ECategoryType, category?:TAdminCategoryCard} & ComponentProps<typeof EntityButton> ) => {
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
                    <CategoryForm type={categoryType} category={category} onComplete={() => setOpen(false)} />
               </DialogPanel >
               </div>
          </Dialog>
     )
}