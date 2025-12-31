"use client";

import { Button } from "@/components/ui/button";
import { EntityButton } from "@/components/ui/custom-buttons";
import { Input } from "@/components/ui/input";
import FileUpload from "@/components/ui/upload/FileUpload";
import queryClient from "@/lib/queryClient";
import { createDocument } from "@/server/common/document";
import { TDocument } from "@/types/common/document";
import { Dialog, DialogPanel } from "@headlessui/react";
import { EDocumentModelType, EDocumentType } from "@prisma/client";
import { CloudUpload, FileText, Plus, X } from "lucide-react";
import { ComponentProps, useState } from "react";
import { toast } from "sonner";

interface IDocumentFormProps {
     type:EDocumentType
     modelType: EDocumentModelType
     document?: TDocument
     serviceId?: string
     companyId?:string
     onComplete: () => void
}

export default function DocumentForm ({type, modelType, document, onComplete, companyId, serviceId}:IDocumentFormProps) {
     const [title,setTitle] = useState("");
     const [docUrl, setDocUrl] = useState("");

     const submit = async () => {
          if(!title) return toast.warning("Please add document title");
          if(!docUrl) return toast.warning("Please upload a file!");
          const newDoc = await createDocument({
               title, docUrl, type, modelType,
               ...(companyId ? {company:{connect:{id: companyId}}}: {}),
               ...(serviceId ? {service:{connect:{id: serviceId}}}: {}),
          })
          if(!newDoc) return toast.error("Error adding document!");
          queryClient.invalidateQueries();
          toast.success("Success adding document!");
          return onComplete();
     }
     return (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 bg-gradient-to-br from-white to-amber-50/30 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
               <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg shadow-sm flex-shrink-0">
                    <FileText className="w-5 h-5 text-white" />
               </div>
               <div className="flex-1 min-w-0">
                    <Input name="doc-title" className="w-full" placeholder="Document Title..." required={false} onChange={e => setTitle(e.target.value)} />
               </div>
               <FileUpload className="bg-white text-gray-800 border-dashed border-2 py-1.5 text-sm w-full rounded-lg font-bold" name="Add File" icon={<CloudUpload className="w-4 h-4" />} onUploadComplete={res => setDocUrl(res)}  />
               <Button onClick={submit} className="flex items-center gap-2 text-white bg-gradient-to-br from-amber-500 to-orange-500" variant={"outline"}><Plus className="w-4 h-4" /> Add</Button>
          </div>
     )
}


export const DocumentFormToggleBtn = ({title, modelType, document, companyId, serviceId, documentType, ...btnProps }:{title: string, modelType: EDocumentModelType, document?:TDocument, companyId?:string, serviceId?:string, documentType: EDocumentType} & ComponentProps<typeof EntityButton>) => {
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
                    <DocumentForm modelType={modelType} companyId={companyId} serviceId={serviceId}  type={documentType}  document={document} onComplete={() => setOpen(false)} />
               </DialogPanel >
               </div>
          </Dialog>
     )
}