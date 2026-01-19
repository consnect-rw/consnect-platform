"use client";

import { SelectInputGroup, TextInputGroup } from "@/components/forms/InputGroups";
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

const legalStructures = [
     {label:"Limited Liability Company", value: "LLC"},
     {label:"Corporation", value: "Corporation"},
     {label:"Partnership", value: "Partnership"},
]

export default function SettingsPage () {
     const [image,setImage] = useState("");
     const [legalDocs,setLegalDocs] = useState<{name:string, url: string}[]>([]);
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

          // legal information
          const legalName = data.get("legal-name") as string;
          const tradeName = data.get("trade-name") as string;
          const registrationNumber = data.get("reg-number") as string;
          const tin = data.get("tin") as string;
          const legalStructure = data.get("legal-structure") as string;
          const incDateStr = data.get("incorporation-date") as string;


          if(!user?.company) {
               const incDate = new Date(incDateStr);
               if(!incDate) return toast.warning("Please enter a valid incorporation date!");
               const newCompany = await createCompany({
                    name, handle: name.split(" ").join("-"),
                    phone, email, website, slogan, 
                    companySize: Number(companySize), 
                    foundedYear: Number(foundedYear),
                    user:{connect:{id: user.id}},
                    ...(image ? {logoUrl: image}:{}),
                    verification: {create: {status: ECompanyStatus.PENDING, message:"Pending for verification!"}},
                    legal: {create: {legalName, tradeName, registrationNumber, tin, structure:legalStructure, dateOfIncorporation: incDate }}
               });

               if(newCompany) {
                    queryClient.invalidateQueries();
                    return toast.success("Your company has been recorded successfully!");
               }else {
                    return toast.error("Something went wrong. Please try again later!")
               }
          }

          const incDate = new Date(incDateStr);
          const updatedCompany = await updateCompany(user.company.id,{
               ...(name ? {name, handle:  name.split(" ").join("-"),} : {}),
               ...(phone ? {phone} :{}),
               ...(email ? {email} :{}),
               ...(website ? {website} :{}),
               ...(slogan ? {slogan} :{}),
               ...(foundedYear ? {foundedYear: Number(foundedYear)} :{}),
               ...(image ? {logoUrl: image}:{}),
               ...(companySize ? {companySize: Number(companySize)} :{}),
               legal: {
                    upsert:{
                         create:{legalName, tradeName, registrationNumber, tin, structure:legalStructure, dateOfIncorporation: incDate },
                         update:{
                              ...(legalName ? {legalName} :{}),
                              ...(tradeName ? {tradeName} :{}),
                              ...(registrationNumber ? {registrationNumber} :{}),
                              ...(tin ? {tin} :{}),
                              ...(legalStructure ? {structure: legalStructure} :{}),
                              ...(incDateStr ? {dateOfIncorporation: incDate} :{}),
                         }
                    }
               }
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

     const deleteFile = async (url:string, name:string) => {
          try {
               if(url) {
                    await deleteSingleImage(url);
                    setLegalDocs(prev => (prev.filter(doc => doc.name !== name)));
                    return toast.success("Document deleted successfully!");
               }else {
                    return toast.warning("No document selected");
               }
          } catch (error) {
               console.log(error);
               return toast.error("Error deleting document");
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
                         <TextInputGroup name="name" label={`Company Name`} defaultValue={companyData?.name} required={companyData ? false :true} />
                         <TextInputGroup name="phone" label={`Company Phone`} defaultValue={companyData?.phone} required={companyData ? false :true} />
                         <TextInputGroup name="email" label={`Company Email`} defaultValue={companyData?.email} type="email" required={companyData ? false :true} />
                         <TextInputGroup name="website" label={`Website`} type="url" defaultValue={companyData?.website ?? undefined} required={false} />
                         <TextInputGroup name="slogan" label={`Slogan`} defaultValue={companyData?.slogan ?? undefined} required={false} />
                    </Grid2InputWrapper>
                    
                    <div className="w-full grid rounded-lg grid-cols-2 md:grid-cols-3 p-2 gap-4 shadow-md">
                         <TextInputGroup name="founded-year" type="number" label={`Founder In (year)`} defaultValue={companyData?.foundedYear} required={companyData ? false :true} />
                         <TextInputGroup name="company-size" type="number" label={`Employees Number (size) `} defaultValue={companyData?.companySize} required={companyData ? false :true} />
                    </div>
                    <Grid2InputWrapper title="Legal Information">
                         <TextInputGroup name="legal-name" label="Legal Name" placeholder="enter company legal name..." defaultValue={companyData?.legal?.legalName} required={companyData ? false : true} />
                         <TextInputGroup name="trade-name" label="Trade Name" placeholder="enter trade names..." defaultValue={companyData?.legal?.tradeName} required={companyData ? false : true} />
                         <TextInputGroup name="reg-number" label="Registration Number" placeholder="enter registration number..." defaultValue={companyData?.legal?.registrationNumber} required={companyData ? false : true} />
                         <TextInputGroup name="tin" label="Tax Identification Number(TIN)" placeholder="enter you tin" defaultValue={companyData?.legal?.tin} required={companyData ? false : true} />
                         <SelectInputGroup name="legal-structure" label={`Legal Structure: ${companyData?.legal?.structure ?? ""}`} values={legalStructures} required={companyData ? false : true} />
                         <TextInputGroup name="incorporation-date" label="Date of Incorporation" type="date" defaultValue={companyData?.legal?.dateOfIncorporation.toDateString()} required={companyData ? false : true} />
                    </Grid2InputWrapper>
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

const DocumentInput  = ({doc, onUpload}:{doc: {title: "", url?:""}, onUpload: (res:string) => void}) => {
     return (
          <div className="w-full bg-gray-100 rounded-lg p-2 flex items-center">

          </div>
     )
}