"use client";

import queryClient from "@/lib/queryClient";
import { createProductCatalog, updateProductCatalog } from "@/server/company/product-catalog";
import { TProductCatalog } from "@/types/company/product-catalog";
import { deleteSingleImage } from "@/util/s3Helpers";
import { ComponentProps, useEffect, useState } from "react";
import { toast } from "sonner";
import { MainForm } from "../MainForm";
import { TextAreaInputGroup, TextInputGroup } from "../InputGroups";
import Image from "@/components/ui/Image";
import ImageUploader from "@/components/ui/upload/ImageUploader";
import { EAspectRatio } from "@/types/enums";
import { FileCheckCorner, UploadCloud, X } from "lucide-react";
import FileUpload from "@/components/ui/upload/FileUpload";
import Link from "next/link";
import { EntityButton } from "@/components/ui/custom-buttons";
import { Dialog, DialogPanel } from "@headlessui/react";

export const ProductCatalogForm = ({catalog, companyId, onComplete}:{catalog?:TProductCatalog, companyId:string, onComplete: () => void}) => {
     const [image, setImage] = useState(catalog?.image ?? "");
     const [fileUrl, setFileUrl] = useState(catalog?.fileUrl ?? "");
     
     const submitData = async (data: FormData) => {
          const name = data.get("name") as string;
          const description = data.get("description") as string;

          if(!catalog) {
               if(!image) return toast.warning("Please add a cover image!");
               if(!fileUrl) return toast.warning("Please add catalog pdf file");
               if(!name) return toast.warning("Please add Catalog Title");
               if(!description) return toast.warning("Please add a brief description of you catalog");
               const newCatalog = await createProductCatalog({
                    name, description, image, fileUrl,
                    company: {connect: {id: companyId}}
               });

               if(!newCatalog) return toast.error("Error adding your product catalog!", {description: "Please try again later"});
               queryClient.invalidateQueries();
               toast.success("Successfully added new product catalog");
               return onComplete();
          }

          const updatedCatalog = await updateProductCatalog(catalog.id, {
               ...(name ? {name} :{}),
               ...(description ? {description} :{}),
               ...(image && image !== catalog.image ? {image} :{}),
               ...(fileUrl && fileUrl !== catalog.fileUrl ? {fileUrl} :{}),
          });
          if(!updatedCatalog) return toast.error("Error updating  product catalog!", {description: "Please try again later"});
          queryClient.invalidateQueries();
          toast.success("Successfully updated product catalog");
          return onComplete();

     }

     const deleteImage = async () => {
          try {
               if(!image)return 

               await deleteSingleImage(image);
               toast.success("Success deleting cover image");
               return setImage("");
          } catch (error) {
               console.log(error);
               return toast.error("Error deleting cover image")
          }
     }
     const deleteFile = async () => {
          try {
               if(!fileUrl)return 

               await deleteSingleImage(fileUrl)
               toast.success("Success deleting product catalog file");
               return setImage("");
          } catch (error) {
               console.log(error);
               return toast.error("Error deleting product catalog file");
          }
     };
     return (
          <MainForm submitData={submitData}>
               <TextInputGroup name="name"label={`Title: ${catalog?.name ?? ""}`} required={catalog ? false :true} placeholder="ex Construction Materials Provision..." />
               <TextAreaInputGroup name="description" label="Summary: " required={catalog ? false :true} placeholder="" maxWords={200} defaultValue={catalog?.description ?? ""} />
               <div className="w-full flex flex-col gap-2 items-start">
                    {
                         image ? 
                         <>
                              <Image src={image} alt="image" className="w-64 rounded-md" />
                              <button type="button" className="text-sm px-3 py-1.5 rounded-md border cursor-pointer border-gray-300 text-gray-700" onClick={deleteImage}>Delete Image</button>
                         </> :
                         <div className="w-full flex items-start">
                              <ImageUploader aspect={EAspectRatio.STANDARD} name="Catalog Cover Image" Icon={UploadCloud} onUploadComplete={res => setImage(res)} />
                         </div>
                    }
               </div>
               <div className="w-full flex flex-col items-start gap-2">
                    {
                         fileUrl ?  
                              <div className="w-full flex items-center justify-between p-2 rounded-lg shadow-sm">
                                   <Link href={fileUrl} target="_blank">File</Link>
                                   <button onClick={deleteFile} className="text-sm px-3 py-1.5 rounded-md border cursor-pointer border-gray-300 text-gray-700" type="button">Delete File</button>
                              </div>
                         :
                         <FileUpload icon={<FileCheckCorner className="w-5 h-5" />} name="Catalog PDF" onUploadComplete={res => setFileUrl(res)} />
                    }
               </div>
          </MainForm>
     )
}

export const ProductCatalogFormToggleBtn = ({title, companyId, catalog,...btnProps}:{title: string, catalog?: TProductCatalog, companyId:string} & ComponentProps<typeof EntityButton> ) => {
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
                    <ProductCatalogForm catalog={catalog} onComplete={() => setOpen(false)} companyId={companyId} />
               </DialogPanel >
               </div>
          </Dialog>
     )
}