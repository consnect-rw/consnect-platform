"use client";

import CompanyRequiredNotice from "@/components/containers/user/CompanyRequireNotice";
import { DocumentInput } from "@/components/forms/common/DocumentForm";
import { SelectInputGroup, TextAreaInputGroup, TextInputGroup } from "@/components/forms/InputGroups";
import { MainForm, MainFormLoader } from "@/components/forms/MainForm";
import { ColumnInputWrapper, Grid2InputWrapper } from "@/components/forms/wrappers";
import Image from "@/components/ui/Image";
import ImageUploader from "@/components/ui/upload/ImageUploader";
import { useAuth } from "@/hooks/useAuth";
import queryClient from "@/lib/queryClient";
import { createProject, fetchProjectById, updateProject } from "@/server/company/project";
import { SProject } from "@/types/company/project";
import { deleteSingleImage } from "@/util/s3Helpers";
import { EDocumentModelType, EDocumentType, EProjectPhase } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Building2, CloudUpload, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const DefaultProjectDocuments: {title:string, url?:""}[] = [
     {title: "Completion Certificate"},
     {title: "Project Contact"},
]

export default function CompanyProjectsFormPage () {
     const {user} = useAuth();
     const searchParams = useSearchParams();
     const [images,setImages] = useState<string[]>([])
     const router = useRouter();
     const [projectDocs,setProjectDocs] = useState<{title:string, url?: string}[]>(DefaultProjectDocuments);

     const projectId = searchParams.get("id");
     const {data: project, isLoading} = useQuery({
          queryKey:["project", projectId],
          queryFn: () => projectId ? fetchProjectById(projectId,SProject) : null
     });

     const onFileDelete = (title:string) => {
          const exItems = projectDocs.filter(doc => doc.title !== title);
          return setProjectDocs([{title},...exItems]);
     }

     const onFileUpload = (doc: {title:string, url:string}) => {
          const exItems = projectDocs.filter(d => d.title !== doc.title);
          return setProjectDocs([...exItems, doc]);
     }

     const submitData = async (data: FormData) => {
          const title = data.get("title") as string;
          const phase = data.get("phase") as EProjectPhase;
          const description = data.get("description") as string;
          const clientName = data.get("client-name") as string;
          const clientEmail = data.get("client-email") as string;
          const clientPhone = data.get("client-phone") as string;
          const initiatedOn = data.get("initiated-on") as string;
          const completedOn = data.get("completed-on") as string;

          if(!project) {
               if(!initiatedOn) return toast.warning("Please select a valid initiation date!");

               const newProject = await createProject({
                    title, description, clientEmail, clientName, clientPhone,
                    initiatedOn: new Date(initiatedOn),phase,
                    ...(completedOn ? {completedOn: new Date(completedOn)}  : {}),
                    company: {connect:{id: user?.company?.id}},
                    documents: {create: projectDocs.filter((d): d is {title: string, url: string} => Boolean(d.url)).map(d => ({title: d.title, docUrl: d.url, type: EDocumentType.OTHER, modelType: EDocumentModelType.PROJECT}) )},
                    images
               });

               if(!newProject) return toast.error("Error adding new project");
               queryClient.invalidateQueries();
               toast.success("Success adding new project!");
               return router.push("/dashboard/settings/projects");
          }

          const updatedProject = await updateProject(project.id, {
               ...(title ? {title} :{}),
               ...(description ? {description} :{}),
               ...(clientEmail ? {clientEmail} :{}),
               ...(clientName ? {clientName} :{}),
               ...(clientPhone ? {clientPhone} :{}),
               ...(initiatedOn ? {initiatedOn: new Date(initiatedOn)} :{}),
               ...(completedOn ? {initiatedOn: new Date(completedOn)} :{}),
               documents: {deleteMany: {},create: projectDocs.filter((d): d is {title: string, url: string} => Boolean(d.url)).map(d => ({title: d.title, docUrl: d.url, type: EDocumentType.OTHER, modelType: EDocumentModelType.PROJECT}) )},
               images
          } );
          if(!updatedProject) return toast.error("Error updating project");
          queryClient.invalidateQueries();
          toast.success("Success updating project!");
          return router.push("/dashboard/settings/projects");
     }

     const handleDeleteImage = async(image:string) => {
          try {
               await deleteSingleImage(image);
               setImages(images.filter(i => i !== image));
               toast.success("Image Deleted successfully");
               if(project) {
                    await updateProject(project.id, {
                         images
                    });
                    queryClient.invalidateQueries();
               }
          } catch (error) {
               console.log(error);
               return toast.error("Error deleting image!")
          }
     }

     useEffect(() => {
          if(project){
               setImages(project.images);
               if(project.documents && project.documents.length > 0) {
                    const projectDocuments = project.documents;
                    const docNames = new Set(projectDocuments.map(d => d.title))
                    const missingDocs  = projectDocs.filter(d => !docNames.has(d.title));
                    setProjectDocs([...missingDocs, ...(projectDocuments.map(d => ({title: d.title, url: d.docUrl})))]);
               }
          }
     }, [project])
     if (!user?.company) {
      return <CompanyRequiredNotice message=" You need to add your company information before adding company projects." />
     }
     
     return (
          <div className="w-full rounded-xl bg-white h-full overflow-y-auto p-4 flex flex-col gap-4">
               <div className="w-full max-w-4xl mx-auto shadow-sm rounded-xl p-4 flex flex-col items-center">
                    <h3 className="text-3xl font-extrabold text-gray-800">{projectId ? "Update project" : "Add New project"}</h3>
                    {
                         isLoading ? <MainFormLoader /> :
                         <MainForm submitData={submitData}>
                              <ColumnInputWrapper title="About the project">
                                   <TextInputGroup name="title" label={`Title: ${project?.title ?? ""}`} required={project ? false : true } placeholder="ex Commercial Building ...." />
                                   <SelectInputGroup name="phase" label={`Phase: ${project?.phase ?? ""}`} required={project ? false : true} values={Object.values(EProjectPhase).map(v => ({label: v, value: v}))} />
                                   <TextAreaInputGroup name="description" label="Description" placeholder="Briefly describe the project" maxWords={200} required={project ? false :true} defaultValue={project?.description ?? ""} />
                              </ColumnInputWrapper>
                              <Grid2InputWrapper title="Client Info" >
                                   <TextInputGroup name="client-name" label={`Client Name: ${project?.clientName ?? ""}`} placeholder="ex John Doe" required={project ? false :true} />
                                   <TextInputGroup name="client-email" label={`Client Email: ${project?.clientEmail ?? ""}`} placeholder="ex john@gmail.com" required={project ? false :true} />
                                   <TextInputGroup name="client-phone" label={`Client Phone: ${project?.clientPhone ?? ""}`} placeholder="******" required={project ? false :true} />
                              </Grid2InputWrapper>
                              <Grid2InputWrapper title="Project Dates">
                                   <TextInputGroup type="date" name="initiated-on" label={`Start Date: ${project?.initiatedOn ? format(project?.initiatedOn, "yyyy-MM-dd") : ""}`} required={project ? false : true}  />
                                   <TextInputGroup type="date" name="completed-on" label={`End Date: ${project?.completedOn ? format(project.completedOn, "yyyy-MM-dd") : ""}`}  />
                              </Grid2InputWrapper>
                              <Grid2InputWrapper title="Supporting Documents">
                                   {projectDocs.map(doc => <DocumentInput doc={doc} key={`${doc.title}`} onDelete={() => onFileDelete(doc.title)} onUpload={onFileUpload} />)}
                              </Grid2InputWrapper>
                              <div className="w-full flex flex-col gap-4 items-start">
                                   <h3 className="text-lg font-medium text-gray-800">Project Images:</h3>
                                   {images.length === 0 ? <p className="font-medium text-gray-600">No Images selected!</p> :
                                        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                             {images.map((image, index) => 
                                             <div className="w-full relative" key={`project-image-${index}`}>
                                                  <Image src={image} alt="project-image" className="w-full aspect-auto rounded-lg" />
                                                  <button onClick={() => handleDeleteImage(image)} type="button" className="p-2 rounded cursor-pointer bg-red-600 text-red-50 absolute top-0 right-0 "><Trash2 className="w-5 h-5" /></button>
                                             </div>
                                             )}
                                        </div>
                                   }
                                   <ImageUploader name="Project Image" Icon={CloudUpload} onUploadComplete={res => setImages(prev => [...prev, res])} />
                              </div>
                         </MainForm>
                    }
               </div>
          </div>
     )
}