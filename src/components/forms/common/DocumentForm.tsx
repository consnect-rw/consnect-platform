"use client";

import { Button } from "@/components/ui/button";
import { EntityButton } from "@/components/ui/custom-buttons";
import { Input } from "@/components/ui/input";
import FileUpload from "@/components/ui/upload/FileUpload";
import queryClient from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { createDocument } from "@/server/common/document";
import { TDocument } from "@/types/common/document";
import { deleteSingleImage } from "@/util/s3Helpers";
import { Dialog, DialogPanel } from "@headlessui/react";
import { EDocumentModelType, EDocumentType } from "@prisma/client";
import { CloudUpload, ExternalLink, FileText, Loader2, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 bg-linear-to-br from-white to-amber-50/30 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
               <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-linear-to-br from-amber-400 to-orange-500 rounded-lg shadow-sm shrink-0">
                    <FileText className="w-5 h-5 text-white" />
               </div>
               <div className="flex-1 min-w-0">
                    <Input name="doc-title" className="w-full" placeholder="Document Title..." required={false} onChange={e => setTitle(e.target.value)} />
               </div>
               <FileUpload className="bg-white text-gray-800 border-dashed border-2 py-1.5 text-sm w-full rounded-lg font-bold" name="Add File" icon={<CloudUpload className="w-4 h-4" />} onUploadComplete={res => setDocUrl(res)}  />
               <Button onClick={submit} className="flex items-center gap-2 text-white bg-linear-to-br from-amber-500 to-orange-500" variant={"outline"}><Plus className="w-4 h-4" /> Add</Button>
          </div>
     )
}


export const DocumentFormToggleBtn = ({title, modelType, document, companyId, serviceId, documentType, ...btnProps }:{title: string, modelType: EDocumentModelType, document?:TDocument, companyId?:string, serviceId?:string, documentType: EDocumentType} & ComponentProps<typeof EntityButton>) => {
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
                    <DocumentForm modelType={modelType} companyId={companyId} serviceId={serviceId}  type={documentType}  document={document} onComplete={() => setOpen(false)} />
               </DialogPanel >
               </div>
          </Dialog>
     )
}

export const DocumentInput  = ({doc, onUpload, onDelete}:{doc: {title: string, url?:string}, onUpload: (doc: {title:string, url:string}) => void, onDelete: (doc: {title:string, url?:string}) => void}) => {
     const [deletingFile,setDeletingFile] = useState(false);
     const deleteFile = async () => {
          try {
               setDeletingFile(true);
               if(confirm("Are you sure you want to delete the file")){
                    if(doc.url) {
                         await deleteSingleImage(doc.url);
                         onDelete(doc);
                         return toast.success("Document deleted successfully!");
                    }else {
                         return toast.warning("No document selected");
                    }
               }
               
          } catch (error) {
               console.log(error);
               return toast.error("Error deleting document");
          }finally{
               setDeletingFile(false);
          }
     }
     return (
          <div className={cn("w-full bg-gray-100 rounded-lg p-2 flex items-center justify-between", doc.url ? "bg-green-100": "")}>
               <div className="flex items-center gap-2">
                    <span className="p-2 bg-linear-to-t text-white from-gray-600 to-slate-600 rounded-lg"><FileText className="w-4 h-4" /></span>
                    <span className="text-sm font-medium text-gray-800">{doc.title}</span>
               </div>
               {
                    doc.url ? 
                         <div className="flex items-center gap-2">
                              <Link href={doc.url} target="_blank" className="border border-gray-600/50 rounded-sm p-2 flex items-center gap-2 text-sm text-gray-800 hover:bg-gray-100">View Doc <ExternalLink className="w-5 h-5" /></Link>
                              <button disabled={deletingFile} type="button" title="Delete file" className="text-sm p-2 rounded-sm bg-red-600 text-red-50" onClick={deleteFile}>{ deletingFile ?<Loader2 className="w-4 h-4 animate-spin" />:<Trash2 className="w-4 h-4" />}</button>
                         </div>
                    : <FileUpload name={"Upload"} icon={<CloudUpload className="w-4 h-4" />} onUploadComplete={res => onUpload({title: doc.title, url:res})} />
               }
          </div>
     )
}