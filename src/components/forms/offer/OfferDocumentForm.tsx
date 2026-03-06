"use client";

import SelectInput from "@/components/ui/beta-inputs/SelectInput";
import { EOfferDocumentAccessLevel, EOfferDocumentType } from "@prisma/client";
import { useState } from "react";
import FileUpload from "@/components/ui/upload/FileUpload";
import { toast } from "sonner";
import { deleteSingleImage } from "@/util/s3Helpers";
import { Eye, Trash2, X } from "lucide-react";
import { createOfferDocument, updateOfferDocument } from "@/server/offer/offer-document";
import queryClient from "@/lib/queryClient";

export interface IOfferDocument {
     id: string;
     type?: EOfferDocumentType;
     accessLevel?: EOfferDocumentAccessLevel;
     url?: string
}

interface IOfferDocumentFormProps {
     document?: IOfferDocument;
     onChange?: (data: IOfferDocument) => void;
     offerId?: string,
     documentId?:string
     onDelete?: () => void;
}

export const OfferDocumentForm = ({ document, onChange, offerId, documentId, onDelete}: IOfferDocumentFormProps) => {
     const [documentData, setDocumentData] = useState<IOfferDocument>(document || {
          id: "",
          type: undefined,
          accessLevel: undefined,
          url: undefined
     });
     const [isSaving, setIsSaving] = useState(false);

     const handleDeleteFile = async () => {
          if(!documentData.url) return;
          try {
               await deleteSingleImage(documentData.url);
               toast.success("File deleted successfully");
               setDocumentData({ ...documentData, url: undefined });
               onChange && onChange({ ...documentData, url: undefined });
          } catch (error) {
               console.error("Error deleting file:", error);
               toast.error("Failed to delete file");
          }
     }

     const handleSave = async () => {
          try{
               setIsSaving(true);
               if(offerId) {
                    if(!documentData.type) return toast.error("Document type is required");
                    if(!documentData.accessLevel) return toast.error("Document access level is required");
                    if(!documentData.url) return toast.error("Please upload the document pdf to continue!");

                    const newDoc = await createOfferDocument({
                         offer: {connect: {id: offerId}},
                         type: documentData.type,
                         accessLevel: documentData.accessLevel,
                         url: documentData.url

                    });
                    if(!newDoc) return toast.error("Failed to save document data");
                    toast.success("Document data saved successfully");
                    await queryClient.invalidateQueries();
                    onChange && onChange(newDoc);
               }else if(documentId) {
                    const updatedDocument = await updateOfferDocument(documentId,{
                         ...(documentData.type && {type: documentData.type}),
                         ...(documentData.accessLevel && {accessLevel: documentData.accessLevel}),
                         ...(documentData.url && {url: documentData.url})
                    });
                    if(!updatedDocument) return toast.error("Failed to save document data");
                    toast.success("Document data updated successfully");
                    await queryClient.invalidateQueries();
                    onChange && onChange(updatedDocument);
               }
          }catch(error){
               console.error("Error saving document data:", error);
               toast.error("Failed to save document data");
          }finally{
               setIsSaving(false);
          }
     }
     return (
          <div className="w-full relative border border-gray-600/50 shadow-sm rounded-lg p-2 flex items-end justify-between gap-2">
               <SelectInput 
                    className="min-w-25"
                    defaultValue={documentData.type} 
                    size="sm" name="document-type" 
                    label="Document Type" 
                    options={Object.values(EOfferDocumentType).map(v => ({ value: v, label: v.split("_").join(" ").toLowerCase() }))} 
                    onChange={(v => setDocumentData(prev => ({...prev, type: v as EOfferDocumentType})))} 
               />
               <SelectInput 
                    className="min-w-25"
                    defaultValue={documentData.accessLevel} 
                    size="sm" name="access-level" 
                    label="Access Level" 
                    options={Object.values(EOfferDocumentAccessLevel).map(v => ({ value: v, label: v.split("_").join(" ").toLowerCase() }))} 
                    onChange={(v => setDocumentData(prev => ({...prev, accessLevel: v as EOfferDocumentAccessLevel})))} 
               />
               {documentData.url ? 
                    <div className="flex items-center gap-1">
                         <button type="button" className="cursor-pointer py-1.5 px-1.5 rounded-lg bg-gray-200 text-gray-800 font-medium text-sm" ><Eye className="w-4 h-4"/> View</button>
                         <button type="button" className="cursor-pointer py-1.5 px-1.5 rounded-lg bg-red-200 text-red-600 font-medium text-sm" onClick={handleDeleteFile} ><Trash2 className="w-4 h-4"/></button>
                    </div>
               : <FileUpload onUploadComplete={res => setDocumentData({ ...documentData, url: res })} name={`Upload`} allowedTypes={["application/pdf"]} />}
               {offerId || documentId ? <button disabled={isSaving} onClick={handleSave} type="button" className="cursor-pointer py-1.5 px-1.5 rounded-lg bg-yellow-200 text-yellow-600 font-medium text-sm">{isSaving ? "Saving..." : "Save"}</button> : null}
               <button onClick={onDelete} type="button" className="border border-red-300 text-red-600 absolute top-1 right-1 p-1 rounded-full"><X className="w-4 h-4" /></button>
          </div>
     )
}