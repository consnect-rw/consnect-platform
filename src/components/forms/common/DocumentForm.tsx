"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FileUpload from "@/components/ui/upload/FileUpload";
import { IBaseDocument, IDocumentCreate, IDocumentUpdate } from "@/types/common/document";
import { EDocumentModelType, EDocumentType } from "@/types/common/enums";
import { CloudUpload, FileText, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface IDocumentFormProps {
     type:EDocumentType
     modelType: EDocumentModelType
     document?: IBaseDocument
     serviceId?: string
     companyId?:string
     onSubmit: (doc: IDocumentCreate) => void
}

export default function DocumentForm ({type, modelType, document, onSubmit, companyId, serviceId}:IDocumentFormProps) {
     const [title,setTitle] = useState("");
     const [docUrl, setDocUrl] = useState("");

     const submit = () => {
          if(!title) return toast.warning("Please add document title");
          if(!docUrl) return toast.warning("Please upload a file!");
          const newDoc: IDocumentCreate = {
               title, docUrl, type, modelType,
               ...(companyId ? {company: {connect:{id: companyId}}} :{}),
               ...(serviceId ? {service: {connect:{id: serviceId}}} :{})
          } 
          return onSubmit(newDoc);
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