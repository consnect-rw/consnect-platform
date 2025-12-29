"use client";

import { TFounder } from "@/types/company/founder";
import { MainForm } from "../MainForm";
import { TextInputGroup } from "../InputGroups";
import { ComponentProps, useState } from "react";
import Image from "@/components/ui/Image";
import { toast } from "sonner";
import { deleteSingleImage } from "@/util/s3Helpers";
import { createFounder, updateFounder } from "@/server/company/founder";
import queryClient from "@/lib/queryClient";
import { ImageUp, UploadCloud, X } from "lucide-react";
import ImageUploader from "@/components/ui/upload/ImageUploader";
import { EntityButton } from "@/components/ui/custom-buttons";
import { Dialog, DialogPanel } from "@headlessui/react";
import { EAspectRatio } from "@/types/enums";

export const FounderForm = ({founder, companyId, onComplete}:{founder?: TFounder, companyId:string, onComplete: () => void}) => {
     const [image,setImage] =useState(founder?.image ?? "");

     const submitData = async(data: FormData) => {
          const name = data.get("name") as string;
          const title = data.get("title") as string;

          if(!founder) {
               const newFounder = await createFounder({
                    name,title, 
                    ...(image ? {image} : {}),
                    company: {connect: {id: companyId}}
               });

               if(!newFounder) return toast.error("Error adding new founder");
               queryClient.invalidateQueries();
               toast.success("successfully added new founder");
               return onComplete();
          }else {
               const updatedFounder = await updateFounder(founder.id,{
                    ...(name ? {name} : {} ),
                    ...(title ? {title} : {} ),
                    ...(image && image !== founder.image ? {image} : {} ),
               });
               if(!updatedFounder) return toast.error("Error updating founder info!");
               queryClient.invalidateQueries();
               toast.success("successfully updated founder information!");
               return onComplete();
          }
     }

     const deleteImage = async () => {
          try {
               if(image) {
                    await deleteSingleImage(image);
                    setImage("");
                    return toast.success("Image deleted successfully!");
               }else {
                    return toast.warning("No Image selected");
               }
          } catch (error) {
               console.log(error);
               return toast.error("Error deleting image");
          }
     }
     return (
          <MainForm submitData={submitData}>
               <TextInputGroup name="name" label={`Founder Name: ${founder?.name ?? ""}`} placeholder="ex Dushime David...." required={founder ? false: true} />
               <TextInputGroup name="title" label={`Title: ${founder?.title ?? ""}`} placeholder="ex Chief Executive Office..." required={founder ? false: true} />
               <div className="w-full flex flex-col gap-2 items-start">
                    {
                         image ? 
                         <>
                              <Image src={image} alt="image" className="w-64 rounded-md" />
                              <button type="button" className="text-sm px-3 py-1.5 rounded-md border cursor-pointer border-gray-300 text-gray-700" onClick={deleteImage}>Delete Image</button>
                         </> :
                         <div className="w-full flex items-start">
                         <ImageUploader aspect={EAspectRatio.SQUARE} name="Founder Image" Icon={UploadCloud} onUploadComplete={res => setImage(res)} />
                         </div>
                    }
               </div>
          </MainForm>
     )
}

export const FounderFormToggleBtn = ({title, companyId, founder,...btnProps}:{title: string, founder?: TFounder, companyId:string} & ComponentProps<typeof EntityButton> ) => {
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
                    <FounderForm founder={founder} onComplete={() => setOpen(false)} companyId={companyId} />
               </DialogPanel >
               </div>
          </Dialog>
     )
}