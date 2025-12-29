"use client";

import { TextInputGroup } from "@/components/forms/InputGroups";
import { MainForm, MainFormLoader } from "@/components/forms/MainForm";
import { Grid2InputWrapper } from "@/components/forms/wrappers";
import Image from "@/components/ui/Image";
import ImageUploader from "@/components/ui/upload/ImageUploader";
import { useAuth } from "@/hooks/useAuth";
import queryClient from "@/lib/queryClient";
import { createCompany, fetchCompanyById, updateCompany } from "@/server/company/company";
import { SCompanyUpdate } from "@/types/company/company";
import { EAspectRatio } from "@/types/enums";
import { deleteSingleImage } from "@/util/s3Helpers";
import { ECompanyStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SettingsPage () {
     const [image,setImage] = useState("");
     const {user} = useAuth();
     const {data: companyData, isLoading}  = useQuery({
          queryKey: ["company-form", user?.company?.id ],
          queryFn: () => user?.company ? fetchCompanyById(user.company.id,SCompanyUpdate): null
     });

     const submitCompanyInfo  = async(data: FormData) => {
          if(!user) return toast.error("Please first login to continue!");
          const name = data.get("name") as string;
          const phone = data.get("phone") as string;
          const email = data.get("email") as string;
          const website = data.get("website") as string;
          const slogan = data.get("slogan") as string;
          const foundedYear = data.get("founded-year");
          const companySize = data.get("company-size");

          if(!user?.company) {
               const newCompany = await createCompany({
                    name, handle: name.split(" ").join("-"),
                    phone, email, website, slogan, 
                    companySize: Number(companySize), 
                    foundedYear: Number(foundedYear),
                    user:{connect:{id: user.id}},
                    ...(image ? {logoUrl: image}:{}),
                    verification: {create: {status: ECompanyStatus.PENDING, message:"Pending for verification!"}}
               });

               if(newCompany) {
                    queryClient.invalidateQueries();
                    return toast.success("Your company has been recorded successfully!");
               }else {
                    return toast.error("Something went wrong. Please try again later!")
               }
          }

          const updatedCompany = await updateCompany(user.company.id,{
               ...(name ? {name, handle:  name.split(" ").join("-"),} : {}),
               ...(phone ? {phone} :{}),
               ...(email ? {email} :{}),
               ...(website ? {website} :{}),
               ...(slogan ? {slogan} :{}),
               ...(foundedYear ? {foundedYear: Number(foundedYear)} :{}),
               ...(image ? {logoUrl: image}:{}),
               ...(companySize ? {companySize: Number(companySize)} :{}),
          });
          if(updatedCompany) {
               queryClient.invalidateQueries();
               return toast.success("Your company has been updated successfully!");
          }else {
               return toast.error("Something went wrong. Please try again later!")
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

     useEffect(() => {
          if(companyData) {
               setImage(companyData.logoUrl ?? "");
          }
     }, [companyData])

     if(isLoading) return (
          <MainFormLoader />
     )
     return (
          <div className="w-full p-4 rounded-xl shadow-md mx-auto">
               <MainForm submitData={submitCompanyInfo}>
                    <Grid2InputWrapper title="">
                         <TextInputGroup name="name" label={`Company Name: ${companyData?.name ?? ""} `} required={companyData ? false :true} />
                         <TextInputGroup name="phone" label={`Company Phone: ${companyData?.phone ?? ""} `} required={companyData ? false :true} />
                         <TextInputGroup name="email" label={`Company Email: ${companyData?.email ?? ""} `} type="email" required={companyData ? false :true} />
                         <TextInputGroup name="website" label={`Website: ${companyData?.website ?? ""} `} type="url" required={false} />
                         <TextInputGroup name="slogan" label={`Slogan: ${companyData?.slogan ?? ""} `} required={false} />
                    </Grid2InputWrapper>
                    
                    <div className="w-full grid rounded-lg grid-cols-2 md:grid-cols-3 p-2 gap-4 shadow-md">
                         <TextInputGroup name="founded-year" type="number" label={`Founder In (year): ${companyData?.foundedYear ?? ""} `} required={companyData ? false :true} />
                         <TextInputGroup name="company-size" type="number" label={`Employees Number (size): ${companyData?.companySize ?? ""} `} required={companyData ? false :true} />
                    </div>
                    <div className="w-full flex flex-col gap-2 items-start">
                         {
                              image ? 
                              <>
                                   <Image src={image} alt="image" className="w-64 rounded-md" />
                                   <button type="button" onClick={deleteImage} className="text-sm px-3 py-1.5 rounded-md border cursor-pointer border-gray-300 text-gray-700">Delete Image</button>
                              </> :
                              <div className="w-full flex items-start">
                              <ImageUploader aspect={EAspectRatio.SQUARE} name="Company Logo" Icon={UploadCloud} onUploadComplete={res => setImage(res)} />
                              </div>
                         }
                    </div>
               </MainForm>
          </div>
     )
}