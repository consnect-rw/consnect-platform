"use client";

import { UserForm } from "@/components/forms/auth/UserForm";
import { CategoryFormToggleBtn } from "@/components/forms/common/CategoryForm";
import DocumentForm from "@/components/forms/common/DocumentForm";
import LocationForm from "@/components/forms/common/LocationForm";
import SocialMediaForm from "@/components/forms/common/SocialMediaForm";
import { ECategoryType, EDocumentModelType, EDocumentType } from "@/types/common/enums";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function FormsPage () {
     return (
          <div className="flex flex-col items-start gap-4 p-4">
               <CategoryFormToggleBtn categoryType={ECategoryType.SERVICE} className={"flex items-center gap-2 text-base font-bold text-white bg-gradient-to-bl from-amber-600 to-amber-800 rounded-lg py-1.5 px-4"} title="New Category" name="Category" icon={<Plus className="w-4 h-4" />} />
               <div className="w-full lg:w-md shadow-md p-2 rounded-xl">
                    <h2>Document form</h2>
                    <DocumentForm type={EDocumentType.CERTIFICATION} modelType={EDocumentModelType.COMPANY} onComplete={() => {}} />
               </div>
               <div className="w-full lg:w-lg p-2 shadow-md rounded-xl">
                    <LocationForm onSubmit={loc => {console.log(loc)}} />
               </div>
               <div className="w-full lg:w-lg p-2 shadow-md rounded-xl">
                    <SocialMediaForm onComplete={() => {}} companyId="my-company" />
               </div>
               <div className="w-full lg:w-lg p-2 shadow-md rounded-xl">
                    <UserForm  onComplete={() => toast.success("User Created successfully")} />
               </div>
               <div className="w-full lg:w-lg p-2 shadow-md rounded-xl" >
                    <h3 className="text-2xl font-bold text-gray-700">Admin Form:</h3>
                    <UserForm role="ADMIN"  onComplete={() => toast.success("User Created successfully")} />
               </div>
          </div>
     )
}