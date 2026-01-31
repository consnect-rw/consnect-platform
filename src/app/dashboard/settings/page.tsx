"use client";

import { DocumentInput } from "@/components/forms/common/DocumentForm";
import { SelectInputGroup, TextInputGroup } from "@/components/forms/InputGroups";
import { MainForm, MainFormLoader } from "@/components/forms/MainForm";
import { Grid2InputWrapper } from "@/components/forms/wrappers";
import Image from "@/components/ui/Image";
import FileUpload from "@/components/ui/upload/FileUpload";
import ImageUploader from "@/components/ui/upload/ImageUploader";
import { useAuth } from "@/hooks/useAuth";
import queryClient from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { fetchCategorys } from "@/server/common/category";
import { createCompany, fetchCompanyById, updateCompany } from "@/server/company/company";
import { SCompanyUpdate } from "@/types/company/company";
import { EAspectRatio } from "@/types/enums";
import { deleteSingleImage } from "@/util/s3Helpers";
import { ECompanyStatus, EDocumentModelType, EDocumentType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Check, ChevronDown, ChevronRight, CloudUpload, ExternalLink, File, FileText, Loader2, Sparkles, Trash2, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const legalStructures = [
     {label:"Limited Liability Company", value: "LLC"},
     {label:"Corporation", value: "Corporation"},
     {label:"Partnership", value: "Partnership"},
]

const defaultLegalDocs: {title:string, url?:string}[] = [
     {title:" RDB Registration Certificate",},
     {title:" Certificate of Incorporation ",},
     {title:" Trade License ",},
     {title:" Memorandum and Articles of Association  ",},
     {title: "VAT Registration Certificate"}
]

export default function SettingsPage () {
     const [image,setImage] = useState("");
     const [legalDocs,setLegalDocs] = useState<{title:string, url?: string}[]>(defaultLegalDocs);
     const [specializations,setSpecializations] = useState<string[]>([]);
     const {user} = useAuth();
     const {data: companyData, isLoading: fetchingCompanyData}  = useQuery({
          queryKey: ["company-form", user?.company?.id ],
          queryFn: () => user?.company ? fetchCompanyById(user.company.id,SCompanyUpdate): null
     });
     const {data: categoriesData, isLoading: fetchingCategories} = useQuery({
          queryKey: ["company-form-categories"],
          queryFn: () => fetchCategorys({id:true, name:true, subCategories:{select: {id:true, name:true, specializations:{select:{id:true, name:true}}}}}, {type: "COMPANY", parentId: null}, 50)
     });
     const categories =categoriesData?.data ?? [];

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
          const incDateStr = data.get("incorporation-date");


          if(!user?.company) {
               const incDate = incDateStr ? new Date(incDateStr as string) : null;
               if(!incDate) return toast.warning("Please enter a valid incorporation date!");
               const newCompany = await createCompany({
                    name, handle: name.split(" ").join("-"),
                    phone, email, website, slogan, 
                    companySize: Number(companySize), 
                    foundedYear: Number(foundedYear),
                    user:{connect:{id: user.id}},
                    ...(image ? {logoUrl: image}:{}),
                    verification: {create: {status: ECompanyStatus.PENDING, message:"Pending for verification!"}},
                    legal: {create: {
                         legalName, tradeName, registrationNumber, tin, structure:legalStructure, dateOfIncorporation: incDate,
                         legalDocuments: {create: legalDocs.filter((d): d is {title: string, url: string} => Boolean(d.url)).map(d => ({title: d.title, docUrl: d.url, type: EDocumentType.LICENSE, modelType: EDocumentModelType.COMPANY}) )}
                    }},
                    specializations: {connect: specializations.map(s => ({id: s}))}
               });

               if(newCompany) {
                    queryClient.invalidateQueries();
                    return toast.success("Your company has been recorded successfully!");
               }else {
                    return toast.error("Something went wrong. Please try again later!")
               }
          }

          const incDate = incDateStr ? new Date(incDateStr as string) : null;
          if(!companyData?.legal && !incDate) return toast.error("Please enter a valid date of incorporation!")
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
                         create:{
                              legalName, tradeName, registrationNumber, tin, structure:legalStructure, 
                              dateOfIncorporation: incDate ?? new Date(),
                              legalDocuments: {create: legalDocs.filter((d): d is {title: string, url: string} => Boolean(d.url)).map(d => ({title: d.title, docUrl: d.url, type: EDocumentType.LICENSE, modelType: EDocumentModelType.COMPANY}) )}
                         },
                         update:{
                              ...(legalName ? {legalName} :{}),
                              ...(tradeName ? {tradeName} :{}),
                              ...(registrationNumber ? {registrationNumber} :{}),
                              ...(tin ? {tin} :{}),
                              ...(legalStructure ? {structure: legalStructure} :{}),
                              ...(incDate ? {dateOfIncorporation: incDate} :{}),
                              legalDocuments: {
                                   deleteMany: {},
                                   create: legalDocs.filter((d): d is {title: string, url: string} => Boolean(d.url)).map(d => ({title: d.title, docUrl: d.url, type: EDocumentType.LICENSE, modelType: EDocumentModelType.COMPANY}) )
                              }
                         }
                    }
               },
               specializations: {set: specializations.map(s => ({id: s}))}
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

     const onFileDelete = (title:string) => {
          const exItems = legalDocs.filter(doc => doc.title !== title);
          return setLegalDocs([{title},...exItems]);
     }

     const onFileUpload = (doc: {title:string, url:string}) => {
          const exItems = legalDocs.filter(d => d.title !== doc.title);
          return setLegalDocs([...exItems, doc]);
     }

     useEffect(() => {
          if(companyData) {
               setImage(companyData.logoUrl ?? "");
               const companyLegalDocs = companyData.legal?.legalDocuments;
               if(companyLegalDocs && companyLegalDocs.length > 0) {
                    const docNames = new Set(companyLegalDocs.map(d => d.title))
                    const missingDocs  = legalDocs.filter(d => !docNames.has(d.title));
                    setLegalDocs([...missingDocs, ...(companyLegalDocs.map(d => ({title: d.title, url: d.docUrl})))]);
               }
               if(companyData.specializations.length > 0) {
                    setSpecializations(companyData.specializations.map(s => s.id))
                  }
          }
     }, [companyData])
     const isLoading = fetchingCompanyData || fetchingCategories;
     if(isLoading) return (
          <MainFormLoader />
     )
     return (
          <div className="w-full mx-auto">
               <MainForm submitData={submitCompanyInfo}>
                    <Grid2InputWrapper title="">
                         <TextInputGroup name="name" label={`Company Name`} defaultValue={companyData?.name} required={companyData ? false :true} />
                         <TextInputGroup name="phone" label={`Company Phone`} defaultValue={companyData?.phone} required={companyData ? false :true} />
                         <TextInputGroup name="email" label={`Company Email`} defaultValue={companyData?.email} type="email" required={companyData ? false :true} />
                         <TextInputGroup name="website" label={`Website`} type="url" defaultValue={companyData?.website ?? undefined} required={false} />
                         <TextInputGroup name="slogan" label={`Slogan`} defaultValue={companyData?.slogan ?? undefined} required={false} />
                    </Grid2InputWrapper>
                    
                    <div className="w-full grid rounded-lg  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-2 gap-4 shadow-md">
                         <TextInputGroup name="founded-year" type="number" label={`Founder In (year)`} defaultValue={companyData?.foundedYear} required={companyData ? false :true} />
                         <TextInputGroup name="company-size" type="number" label={`Employees Number (size) `} defaultValue={companyData?.companySize} required={companyData ? false :true} />
                    </div>
                    <Grid2InputWrapper title="Legal Information">
                         <TextInputGroup name="legal-name" label="Legal Name" placeholder="enter company legal name..." defaultValue={companyData?.legal?.legalName} required={companyData ? false : true} />
                         <TextInputGroup name="trade-name" label="Trade Name" placeholder="enter trade names..." defaultValue={companyData?.legal?.tradeName} required={companyData ? false : true} />
                         <TextInputGroup name="reg-number" label="Registration Number" placeholder="enter registration number..." defaultValue={companyData?.legal?.registrationNumber} required={companyData ? false : true} />
                         <TextInputGroup name="tin" label="Tax Identification Number(TIN)" placeholder="enter you tin" defaultValue={companyData?.legal?.tin} required={companyData ? false : true} />
                         <SelectInputGroup name="legal-structure" label={`Legal Structure: ${companyData?.legal?.structure ?? ""}`} values={legalStructures} required={companyData ? false : true} />
                         <TextInputGroup name="incorporation-date" label={`Date Incorporation: ${companyData?.legal?.dateOfIncorporation ? format(companyData.legal.dateOfIncorporation, "dd-MM-yyyy"): ""} `} type="date" required={companyData ? false : true} />
                    </Grid2InputWrapper>
                    <Grid2InputWrapper title="Legal and Statutory Documents ">
                         {legalDocs.map(doc => <DocumentInput doc={doc} key={`${doc.title}`} onDelete={() => onFileDelete(doc.title)} onUpload={onFileUpload} />)}
                    </Grid2InputWrapper>
                    <div className="w-full flex flex-col gap-2 items-start">
                         <h3 className="text-gray-800 font-medium text-base">Company Logo</h3>
                         {
                              image ? 
                              <>
                                   <Image src={image} alt="image" className="w-32 rounded-md" />
                                   <button type="button" onClick={deleteImage} className="text-sm px-3 py-1.5 rounded-md border cursor-pointer border-gray-300 text-gray-700">Delete Image</button>
                              </> :
                              <div className="w-full flex items-start">
                              <ImageUploader aspect={EAspectRatio.SQUARE} name="Company Logo" Icon={UploadCloud} onUploadComplete={res => setImage(res)} />
                              </div>
                         }
                    </div>
                    <SpecializationSelector categories={categories} setSpecializations={setSpecializations} specializations={specializations} />
               </MainForm>
          </div>
     )
}



type TSpecialization = {
  id: string;
  name: string;
};

type TSubCategory = {
  id: string;
  name: string;
  specializations: TSpecialization[];
};

type TCategory = {
  id: string;
  name: string;
  subCategories: TSubCategory[];
};

interface SpecializationSelectorProps {
  categories: TCategory[];
  specializations: string[];
  setSpecializations: (value: string[]) => void;
}


export const SpecializationSelector = ({
  categories,
  specializations,
  setSpecializations,
}: SpecializationSelectorProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubCategories, setExpandedSubCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleSubCategory = (subCategoryId: string) => {
    const newExpanded = new Set(expandedSubCategories);
    if (newExpanded.has(subCategoryId)) {
      newExpanded.delete(subCategoryId);
    } else {
      newExpanded.add(subCategoryId);
    }
    setExpandedSubCategories(newExpanded);
  };

  const toggleSpecialization = (specializationId: string) => {
    if (specializations.includes(specializationId)) {
      setSpecializations(specializations.filter(id => id !== specializationId));
    } else {
      setSpecializations([...specializations, specializationId]);
    }
  };

  const isSpecializationSelected = (specializationId: string) => {
    return specializations.includes(specializationId);
  };

  return (
    <div className="w-full flex flex-col gap-3 p-2 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-yellow-600" strokeWidth={2.5} />
        <h3 className="text-lg font-bold text-yellow-800">Specialization</h3>
        {specializations.length > 0 && (
          <span className="ml-auto px-3 py-1 bg-gray-500 text-white text-xs font-bold rounded-full">
            {specializations.length} selected
          </span>
        )}
      </div>

      <div className="w-full space-y-2">
        {categories.map((category, catIndex) => (
          <div
            key={category.id}
            className="rounded-xl border-2 border-gray-100 bg-linear-to-br from-white to-gray-50/30 overflow-hidden transition-all duration-300 hover:border-gray-200 hover:shadow-md"
           
          >
            {/* Category Header */}
            <button
              type="button"
              onClick={() => toggleCategory(category.id)}
              className="w-full px-4 py-3 flex items-center gap-3 bg-linear-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 transition-all duration-300 group"
            >
              <div className="shrink-0 transition-transform duration-300 group-hover:scale-110">
                {expandedCategories.has(category.id) ? (
                  <ChevronDown className="w-5 h-5 text-white" strokeWidth={2.5} />
                ) : (
                  <ChevronRight className="w-5 h-5 text-white" strokeWidth={2.5} />
                )}
              </div>
              <span className="text-sm md:text-base font-bold text-white uppercase tracking-wide">
                {category.name}
              </span>
              <div className="ml-auto w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center shadow-sm">
                <span className="text-xs font-bold text-gray-900">
                  {category.subCategories.reduce(
                    (acc, sub) => acc + sub.specializations.length,
                    0
                  )}
                </span>
              </div>
            </button>

            {/* SubCategories */}
            {expandedCategories.has(category.id) && (
              <div className="p-3 space-y-2 animate-fadeIn">
                {category.subCategories.map((subCategory, subIndex) => (
                  <div
                    key={subCategory.id}
                    className="rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm overflow-hidden transition-all duration-200 hover:shadow-sm"
                  >
                    {/* SubCategory Header */}
                    <button
                      type="button"
                      onClick={() => toggleSubCategory(subCategory.id)}
                      className="w-full px-3 py-2.5 flex items-center gap-2 hover:bg-gray-50 transition-colors duration-200 group/sub"
                    >
                      <div className="shrink-0 transition-transform duration-200 group-hover/sub:scale-110">
                        {expandedSubCategories.has(subCategory.id) ? (
                          <ChevronDown className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
                        )}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {subCategory.name}
                      </span>
                      <div className="ml-auto px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        <span className="text-xs font-bold">
                          {subCategory.specializations.length}
                        </span>
                      </div>
                    </button>

                    {/* Specializations */}
                    {expandedSubCategories.has(subCategory.id) && (
                      <div className="px-3 pb-3 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-fadeIn">
                        {subCategory.specializations.map((specialization, specIndex) => {
                          const isSelected = isSpecializationSelected(specialization.id);
                          return (
                            <button
                              type="button"
                              key={specialization.id}
                              onClick={() => toggleSpecialization(specialization.id)}
                              className={`
                                relative px-3 py-2.5 rounded-lg text-left transition-all duration-300 group/spec
                                ${
                                  isSelected
                                    ? 'bg-linear-to-r from-yellow-400 to-yellow-500 shadow-md scale-[1.02] border-2 border-yellow-600'
                                    : 'bg-gray-50 hover:bg-gray-50 border-2 border-transparent hover:border-gray-300'
                                }
                              `}
                              
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`
                                  shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300
                                  ${
                                    isSelected
                                      ? 'bg-white border-white scale-110'
                                      : 'bg-white border-gray-300 group-hover/spec:border-gray-400'
                                  }
                                `}
                                >
                                  {isSelected && (
                                    <Check className="w-4 h-4 text-yellow-600" strokeWidth={3} />
                                  )}
                                </div>
                                <span
                                  className={`
                                  text-sm font-medium transition-colors duration-300
                                  ${isSelected ? 'text-gray-900 font-bold' : 'text-gray-700'}
                                `}
                                >
                                  {specialization.name}
                                </span>
                              </div>

                              {/* Selection Indicator */}
                              {isSelected && (
                                <div className="absolute inset-0 rounded-lg bg-linear-to-r from-yellow-400/20 to-transparent pointer-events-none animate-pulse"></div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected Summary */}
      {specializations.length > 0 && (
        <div className="mt-4 p-4 rounded-xl bg-linear-to-r from-gray-50 to-yellow-50 border-2 border-gray-200 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-linear-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-sm">
              <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700 mb-1">
                {specializations.length} Specialization{specializations.length !== 1 ? 's' : ''} Selected
              </p>
              <button
                type="button"
                onClick={() => setSpecializations([])}
                className="text-xs font-semibold text-gray-600 hover:text-gray-700 underline transition-colors"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};