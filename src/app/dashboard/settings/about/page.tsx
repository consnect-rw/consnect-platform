"use client";

import CompanyRequiredNotice from "@/components/containers/user/CompanyRequireNotice";
import { TextAreaInputGroup } from "@/components/forms/InputGroups";
import { MainFormLoader } from "@/components/forms/MainForm";
import { RichTextEditor } from "@/components/forms/TextEditor";
import RichTextView from "@/components/ui/rich-text-viewer";
import { useAuth } from "@/hooks/useAuth";
import queryClient from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { fetchDescriptions } from "@/server/common/description";
import { updateCompany } from "@/server/company/company";
import { useQuery } from "@tanstack/react-query";
import { Edit, Edit2, Eye, Loader2 } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";

const companyDescriptions = [
     "Overview", "Mission", "Vision", "Detailed"
]

export default function CompanyAboutForm () {
     const {user} = useAuth();
     const [overview, setOverview] = useState("");
     const [mission, setMission] = useState("");
     const [vision, setVision] = useState("");
     const [detailed, setDetailed] = useState("");
     const [submitting,setSubmitting] = useState(false);
     const [inView,setInView] = useState(false);

     const {data: descriptionsData, isLoading}= useQuery({
          queryKey:["company-descriptions", user?.company?.id],
          queryFn:() => user?.company ? fetchDescriptions({title:true, id:true, description:true}, {company:{id: user.company.id}}) : null
     });
     const descriptions = descriptionsData?.data ?? [];

     const submitData = async () => {
          try {
               setSubmitting(true);
               const res = await updateCompany(user?.company?.id ?? "", {
                    descriptions:{
                         deleteMany:{},
                         createMany:{
                              data: [
                                   ...( overview ? [{title:"Overview", description: overview, rank:1,}] : []),
                                   ...(mission ? [{title:"Mission", description: mission, rank:2,}] : []),
                                   ...(vision ? [{title:"Vision", description: vision, rank:3,}] : []),
                                   ...(detailed ? [{title:"Detailed", description: detailed, rank:0,}] : []),
                              ]
                         }
                    }
               });
               if(!res) return toast.error("Error updating company description!");
               queryClient.invalidateQueries();
               toast.success("Successfully update company info!");
               return setInView(true);
          } catch (error) {
               console.log(error);
               return toast.error("Something went wrong!");
          }finally{
               setSubmitting(false);
          }
     }

     useEffect(() => {
          if(descriptions.length > 0) {
               descriptions.forEach(desc => {
                    switch(desc.title) {
                         case "Overview": 
                              setOverview(desc.description);
                              break;
                         case "Mission": 
                              setMission(desc.description);
                              break;
                         case "Vision": 
                              setVision(desc.description);
                              break;
                         case "Detailed": 
                              setDetailed(desc.description);
                              break;
                         default: 
                              setDetailed(desc.description);
                    }
               });
               setInView(true);
          }
     }, [descriptions]);

     if (!user?.company) {
          return (
               <CompanyRequiredNotice message="Please first create your company to continue writing about it"/>
          );
     }

     if(isLoading) return <MainFormLoader />
     return (
          <div className="w-full flex flex-col gap-8">
               <div className="w-full grid grid-cols-2 gap-4">
                    <ViewOpt name="Edit" icon={<Edit className="w-5 h-5" />} onClick={() => setInView(false)} active={!inView} />
                    <ViewOpt name="View" icon={<Eye className="w-5 h-5" />} onClick={() => setInView(true)} active={inView} />
               </div>
               {
                    inView ? 
                         <div className="w-full flex flex-col gap-4">
                              {descriptions.length === 0 ? <p className="text-gray-600 font-medium">Nothing found!</p> : null}
                              {overview ? <CompanyDescription description={{title: "Overview", description:overview, id: ""}} /> :null}
                              {mission ? <CompanyDescription description={{title: "Mission", description:mission, id: ""}} /> :null}
                              {vision ? <CompanyDescription description={{title: "Vision", description:vision, id: ""}} /> :null}
                              {detailed ? <CompanyDetailedDescription description={{title: "Detailed Description", description:detailed, id: ""}} /> :null}
                         </div>
                    :
                    <div className="w-full flex flex-col gap-8 p-4 rounded-xl border border-gray-600/50">
                         <TextAreaInputGroup action={res => setOverview(res)} name="overview" label="Company Overview" maxWords={200} placeholder="Briefly talk about your company..." defaultValue={overview} />
                         <TextAreaInputGroup action={res => setMission(res)} name="mission" label="Mission" maxWords={200} placeholder="Talk about the company mission..." defaultValue={mission} />
                         <TextAreaInputGroup action={res => setVision(res)} name="Vision" label="Vision" maxWords={200} placeholder="Talk about the company vision..." defaultValue={vision} />
                         <div className="flex flex-col w-full gap-4">
                              <span className="text-gray-800 font-medium text-base">Detailed Description:</span>
                              <RichTextEditor defaultValue={detailed} maxHeight="800px" minHeight="400px" onChange={setDetailed} />
                         </div>
                         <button type="button" onClick={submitData} disabled={submitting} className="w-full rounded-lg bg-linear-to-bl from-yellow-600 to-amber-600 text-white font-bold py-3 px-4">{submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Submit"}</button>
          </div>
               }
          </div>
          
     )
}

const CompanyDescription = ({description}:{description: {title:string, id:string, description: string}}) => {
     return (
          <div className="flex flex-col gap-4 items-start p-4 shadow-md rounded-xl">
               <h3 className="text-2xl font-extrabold text-gray-800">{description.title}:</h3>
               <p className="text-sm text-gray-700 whitespace-pre-line">{description.description}</p>
          </div>
     )
}

const CompanyDetailedDescription = ({description}:{description: {title:string, description:string, id:string}}) =>  {
     return (
          <div className="flex flex-col gap-4 items-start p-4 shadow-md rounded-xl">
               <h3 className="text-2xl font-extrabold text-gray-800">{description.title}:</h3>
               <RichTextView content={description.description}  />
          </div>
     )
}

const ViewOpt = ({name,onClick, active, icon}:{name:string, active: boolean, onClick: () => void, icon: ReactNode}) => (
     <span onClick={onClick} className={cn("rounded-xl w-full py-3 px-4 text-lg flex items-center justify-center gap-2 cursor-pointer", !active ? "border border-gray-300 text-gray-700":"bg-linear-to-bl from-gray-800 to-slate-800 text-white")}>
          {icon}
          {name}
     </span>
)