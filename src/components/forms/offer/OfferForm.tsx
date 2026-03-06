"use client";

import { useQuery } from "@tanstack/react-query";
import { SelectInputGroup, TextAreaInputGroup, TextInputGroup } from "../InputGroups";
import { MainFormLoader } from "../MainForm";
import { Grid2InputWrapper } from "../wrappers";
import { fetchOfferById } from "@/server/offer/offer";
import { fetchCategorys } from "@/server/common/category";
import { EDurationUnit, EOFferContractType, EOfferPriority, EOfferStatus, OfferType, OfferVisibility } from "@prisma/client";
import { fetchProjects } from "@/server/company/project";
import { ChangeEvent, useEffect, useState } from "react";
import { WordsInput } from "@/components/ui/upload/WordsInput";
import { IOfferDocument, OfferDocumentForm } from "./OfferDocumentForm";
import { generateToken } from "@/util/token-fns";
import { ChevronLeft, ChevronRight, Check, MapPin, FolderPlus } from "lucide-react";
import { createOffer, updateOffer } from "@/server/offer/offer";
import { toast } from "sonner";
import queryClient from "@/lib/queryClient";
import { SOfferEdit } from "@/types/offer/offer";

enum EPaymentMethod {
     BANK_TRANSFER = "BANK_TRANSFER",
     MOMO = "MOMO",
     CASH = "CASH",
     CHECK = "CHECK",
}

type ProjectOption = "existing" | "new" | "location";

const FORM_STEPS = [
     { id: 1, title: "Classification", shortTitle: "Class" },
     { id: 2, title: "Basic Info", shortTitle: "Basic" },
     { id: 3, title: "Work Details", shortTitle: "Work" },
     { id: 4, title: "Project Info", shortTitle: "Project" },
     { id: 5, title: "Timeline", shortTitle: "Time" },
     { id: 6, title: "Pricing", shortTitle: "Price" },
     { id: 7, title: "Submission", shortTitle: "Submit" },
     { id: 8, title: "Documents", shortTitle: "Docs" },
];

export const OfferForm = ({onComplete, offerId, companyId}:{onComplete: () => void, offerId?:string, companyId:string}) => {
     const [currentStep, setCurrentStep] = useState(1);
     const [loading, setLoading] = useState(false);
     
     // Step 1: Classification
     const [categoryId, setCategoryId] = useState("");
     const [offerType, setOfferType] = useState("");
     
     // Step 2: Basic Information
     const [title, setTitle] = useState("");
     const [description, setDescription] = useState("");
     const [priority, setPriority] = useState("");
     const [status, setStatus] = useState("");
     const [visibility, setVisibility] = useState("");
     const [contractType, setContractType] = useState("");
     
     // Step 3: Work Details
     const [scopeOfWork, setScopeOfWork] = useState("");
     const [qualityStandards, setQualityStandards] = useState("");
     const [technicalSpecifications, setTechnicalSpecifications] = useState("");
     const [tasks, setTasks] = useState<string[]>([]);
     const [safetyRequirements, setSafetyRequirements] = useState("");
     const [skills, setSkills] = useState<string[]>([]);
     const [requiredCertifications, setRequiredCertifications] = useState<string[]>([]);
     const [deliverables, setDeliverables] = useState<string[]>([]);
     
     // Step 4: Project Information
     const [projectOption, setProjectOption] = useState<ProjectOption>("existing");
     const [projectId, setProjectId] = useState("");
     const [newProjectTitle, setNewProjectTitle] = useState("");
     const [newProjectDescription, setNewProjectDescription] = useState("");
     const [clientName, setClientName] = useState("");
     const [clientEmail, setClientEmail] = useState("");
     const [clientPhone, setClientPhone] = useState("");
     const [initiatedOn, setInitiatedOn] = useState("");
     const [country, setCountry] = useState("");
     const [city, setCity] = useState("");
     const [state, setState] = useState("");
     const [zipCode, setZipCode] = useState("");
     const [address, setAddress] = useState("");
     
     // Step 5: Timeline
     const [startDate, setStartDate] = useState("");
     const [endDate, setEndDate] = useState("");
     const [deadline, setDeadline] = useState("");
     const [duration, setDuration] = useState("");
     const [durationUnit, setDurationUnit] = useState("");
     
     // Step 6: Pricing
     const [budgetMin, setBudgetMin] = useState("");
     const [budgetMax, setBudgetMax] = useState("");
     const [currency, setCurrency] = useState("");
     const [paymentTerms, setPaymentTerms] = useState("");
     const [paymentMethods, setPaymentMethods] = useState<EPaymentMethod[]>([]);
     
     // Step 7: Submission
     const [proposalFormat, setProposalFormat] = useState("");
     const [autoClose, setAutoClose] = useState("");
     const [contactEmail, setContactEmail] = useState("");
     const [contactPhone, setContactPhone] = useState("");
     const [submissionNotes, setSubmissionNotes] = useState("");
     
     // Step 8: Documents
     const [documents, setDocuments] = useState<IOfferDocument[]>([]);

     const {data: offerData, isLoading: fetchingOfferData} = useQuery({
          queryKey: ["offer-form-data", offerId],
          queryFn: () => offerId ? fetchOfferById(offerId, SOfferEdit) : null
     });

     const {data: categoriesData, isLoading: fetchingCategories} = useQuery({
          queryKey: ["offer-form-categories"],
          queryFn: () => fetchCategorys({name:true, id:true}, {type: "TENDER"}, 100)
     });
     
     const {data: projectsData, isLoading: fetchingProjects} = useQuery({
          queryKey: ["offer-form-projects", companyId],
          queryFn:() => fetchProjects({id:true, title:true}, {
               AND: [
                    {companyId: companyId},
                    {phase: "EXECUTION"}]
          }, 20)
     })
     
     const offerCategories = categoriesData?.data || [];
     const offer = offerData || null;
     const projects = projectsData?.data || [];
     const isLoading = fetchingOfferData || fetchingCategories || fetchingProjects;

     // Pre-populate form state when editing an existing offer
     useEffect(() => {
          if (!offer) return;

          // Step 1: Classification
          if (offer.categoryId) setCategoryId(offer.categoryId);
          if (offer.type) setOfferType(offer.type);

          // Step 2: Basic Info
          if (offer.title) setTitle(offer.title);
          if (offer.description) setDescription(offer.description);
          if (offer.priority) setPriority(offer.priority);
          if (offer.status) setStatus(offer.status);
          if (offer.visibility) setVisibility(offer.visibility);
          if (offer.contractType) setContractType(offer.contractType);

          // Step 3: Work Details
          if (offer.scopeOfWork) setScopeOfWork(offer.scopeOfWork);
          if (offer.qualityStandards) setQualityStandards(offer.qualityStandards);
          if (offer.technicalSpecifications) setTechnicalSpecifications(offer.technicalSpecifications);
          if (offer.specificTasks?.length) setTasks(offer.specificTasks);
          if (offer.safetyRequirements) setSafetyRequirements(offer.safetyRequirements);
          if (offer.requiredSkills?.length) setSkills(offer.requiredSkills);
          if (offer.requiredCertifications?.length) setRequiredCertifications(offer.requiredCertifications);
          if (offer.deliverables?.length) setDeliverables(offer.deliverables);

          // Step 4: Project Info
          if (offer.project) {
               setProjectOption("existing");
               setProjectId(offer.project.id);
               setNewProjectTitle(offer.project.title ?? "");
               setNewProjectDescription(offer.project.description ?? "");
               setClientName(offer.project.clientName ?? "");
               setClientEmail(offer.project.clientEmail ?? "");
               setClientPhone(offer.project.clientPhone ?? "");
               if (offer.project.initiatedOn) {
                    setInitiatedOn(new Date(offer.project.initiatedOn).toISOString().split("T")[0]);
               }
               // Project location → site location fallback
               const loc = offer.project.location;
               if (loc) {
                    setCountry(loc.country ?? "");
                    setCity(loc.city ?? "");
                    setState(loc.state ?? "");
                    setZipCode(loc.zipCode ?? "");
                    setAddress(loc.address ?? "");
               }
          } else if (offer.siteLocation) {
               setProjectOption("location");
               setCountry(offer.siteLocation.country ?? "");
               setCity(offer.siteLocation.city ?? "");
               setState(offer.siteLocation.state ?? "");
               setZipCode(offer.siteLocation.zipCode ?? "");
               setAddress(offer.siteLocation.address ?? "");
          }

          // Step 5: Timeline
          if (offer.timeline) {
               const tl = offer.timeline;
               if (tl.startDate) setStartDate(new Date(tl.startDate).toISOString().split("T")[0]);
               if (tl.endDate) setEndDate(new Date(tl.endDate).toISOString().split("T")[0]);
               if (tl.deadline) setDeadline(new Date(tl.deadline).toISOString().split("T")[0]);
               if (tl.duration) setDuration(String(tl.duration));
               if (tl.durationUnit) setDurationUnit(tl.durationUnit);
          }

          // Step 6: Pricing
          if (offer.pricing) {
               const pr = offer.pricing;
               if (pr.budgetMin != null) setBudgetMin(String(pr.budgetMin));
               if (pr.budgetMax != null) setBudgetMax(String(pr.budgetMax));
               if (pr.currency) setCurrency(pr.currency);
               if (pr.paymentTerms) setPaymentTerms(pr.paymentTerms);
               if (pr.paymentMethods?.length) setPaymentMethods(pr.paymentMethods as EPaymentMethod[]);
          }

          // Step 7: Submission Info
          if (offer.submissionInfo) {
               const si = offer.submissionInfo;
               if (si.proposalFormat) setProposalFormat(si.proposalFormat);
               if (si.contactEmail) setContactEmail(si.contactEmail);
               if (si.contactPhone) setContactPhone(si.contactPhone);
               if (si.submissionGuidelines) setSubmissionNotes(si.submissionGuidelines);
               setAutoClose(si.autoClose ? "Yes" : "No");
          }

          // Step 8: Documents
          if (offer.documents?.length) {
               setDocuments(offer.documents.map(d => ({
                    id: d.id,
                    type: d.type ?? undefined,
                    url: d.url ?? undefined,
                    description: d.description ?? undefined,
                    fileType: d.fileType ?? undefined,
                    fileSize: d.fileSize ?? undefined,
                    accessLevel: d.accessLevel ?? undefined,
               })));
          }
     // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [offerData]);

     const handleAddDocument = () => {
          const id = generateToken();
          setDocuments(prev => [...prev, {id}]);
     }

     const handleSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
          event.preventDefault();
          setLoading(true);
          
          try {
               if (!offerId) {
                    // Create new offer using state values
                    const offerData: any = {
                         title,
                         description,
                         type: offerType as OfferType,
                         priority: priority as EOfferPriority,
                         status: status as EOfferStatus,
                         visibility: visibility as OfferVisibility,
                         contractType: contractType as EOFferContractType,
                         category: { connect: { id: categoryId } },
                         company: { connect: { id: companyId } },
                         ...(scopeOfWork && { scopeOfWork }),
                         ...(qualityStandards && { qualityStandards }),
                         ...(technicalSpecifications && { technicalSpecifications }),
                         ...(safetyRequirements && { safetyRequirements }),
                         ...(tasks.length > 0 && { specificTasks: tasks }),
                         ...(skills.length > 0 && { requiredSkills: skills }),
                         ...(deliverables.length > 0 && { deliverables }),
                         ...(requiredCertifications.length > 0 && { requiredCertifications }),
                    };

                    // Handle project based on option
                    if (projectOption === "existing" && projectId) {
                         offerData.project = { connect: { id: projectId } };
                    } else if (projectOption === "new" && newProjectTitle) {
                         offerData.project = {
                              create: {
                                   title: newProjectTitle,
                                   description: newProjectDescription || "",
                                   phase: "EXECUTION",
                                   clientName: clientName || "",
                                   clientEmail: clientEmail || "",
                                   clientPhone: clientPhone || "",
                                   initiatedOn: initiatedOn ? new Date(initiatedOn) : new Date(),
                                   companyId: companyId,
                              }
                         };
                    }

                    // Handle location
                    if (country && city) {
                         offerData.siteLocation = {
                              create: {
                                   country,
                                   city,
                                   ...(state && { state }),
                                   ...(zipCode && { zipCode }),
                                   ...(address && { address }),
                              }
                         };
                    }

                    // Handle timeline
                    if (startDate || endDate || deadline || duration) {
                         offerData.timeline = {
                              create: {
                                   ...(startDate && { startDate: new Date(startDate) }),
                                   ...(endDate && { endDate: new Date(endDate) }),
                                   ...(deadline && { deadline: new Date(deadline) }),
                                   ...(duration && { duration: parseInt(duration) }),
                                   ...(durationUnit && { durationUnit: durationUnit as EDurationUnit }),
                              }
                         };
                    }

                    // Handle pricing
                    if (budgetMin || budgetMax || paymentTerms) {
                         offerData.pricing = {
                              create: {
                                   ...(budgetMin && { budgetMin: parseFloat(budgetMin) }),
                                   ...(budgetMax && { budgetMax: parseFloat(budgetMax) }),
                                   ...(currency && { currency }),
                                   ...(paymentTerms && { paymentTerms }),
                                   ...(paymentMethods.length > 0 && { paymentMethods }),
                              }
                         };
                    }

                    // Handle submission info
                    if (proposalFormat || contactEmail || contactPhone || submissionNotes) {
                         offerData.submissionInfo = {
                              create: {
                                   ...(proposalFormat && { proposalFormat }),
                                   ...(contactEmail && { contactEmail }),
                                   ...(contactPhone && { contactPhone }),
                                   ...(submissionNotes && { submissionGuidelines: submissionNotes }),
                                   autoClose: autoClose === "Yes",
                              }
                         };
                    }

                    const response = await createOffer(offerData);
                    
                    if (!response) {
                         toast.error("Error creating offer!", { description: "Please try again later" });
                         return;
                    }

                    toast.success("Offer created successfully");
                    queryClient.invalidateQueries();
                    onComplete();
               } else {
                    // Update existing offer using state values
                    const updateData: any = {
                         ...(title && { title }),
                         ...(description && { description }),
                         ...(offerType && { type: offerType as OfferType }),
                         ...(priority && { priority: priority as EOfferPriority }),
                         ...(status && { status: status as EOfferStatus }),
                         ...(visibility && { visibility: visibility as OfferVisibility }),
                         ...(contractType && { contractType: contractType as EOFferContractType }),
                         ...(scopeOfWork && { scopeOfWork }),
                         ...(qualityStandards && { qualityStandards }),
                         ...(technicalSpecifications && { technicalSpecifications }),
                         ...(safetyRequirements && { safetyRequirements }),
                         ...(tasks.length > 0 && { specificTasks: tasks }),
                         ...(skills.length > 0 && { requiredSkills: skills }),
                         ...(deliverables.length > 0 && { deliverables }),
                         ...(requiredCertifications.length > 0 && { requiredCertifications }),
                    };

                    const response = await updateOffer(offerId, updateData);
                    
                    if (!response) {
                         toast.error("Error updating offer!", { description: "Please try again later" });
                         return;
                    }

                    toast.success("Offer updated successfully");
                    queryClient.invalidateQueries();
                    onComplete();
               }
          } catch (error) {
               console.error("Error submitting offer:", error);
               toast.error("An error occurred", { description: "Please try again" });
          } finally {
               setLoading(false);
          }
     }

     const goToStep = (step: number) => {
          setCurrentStep(step);
     }

     const goToNextStep = () => {
          if (currentStep < FORM_STEPS.length) {
               setCurrentStep(prev => prev + 1);
          }
     }

     const goToPrevStep = () => {
          if (currentStep > 1) {
               setCurrentStep(prev => prev - 1);
          }
     }

     if(isLoading) return <MainFormLoader />
     
     return (
          <div className="w-full bg-white rounded-xl shadow-lg">
               {/* Progress Bar */}
               <div className="w-full px-6 pt-6 pb-4 border-b border-gray-200">
                    <div className="w-full flex items-center justify-between mb-2">
                         <h2 className="text-2xl font-black text-gray-900">
                              {offer ? "Update Offer" : "Create New Offer"}
                         </h2>
                         <div className="text-sm font-medium text-gray-600">
                              Step {currentStep} of {FORM_STEPS.length}
                         </div>
                    </div>
                    
                    {/* Progress Steps */}
                    <div className="relative w-full flex items-center justify-between mt-6">
                         {/* Progress Line */}
                         <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 -z-10">
                              <div 
                                   className="h-full bg-yellow-400 transition-all duration-500 ease-out"
                                   style={{ width: `${((currentStep - 1) / (FORM_STEPS.length - 1)) * 100}%` }}
                              />
                         </div>

                         {/* Step Dots */}
                         {FORM_STEPS.map((step) => (
                              <button
                                   key={step.id}
                                   type="button"
                                   onClick={() => goToStep(step.id)}
                                   className="flex flex-col items-center gap-2 group"
                              >
                                   <div 
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                                             currentStep === step.id
                                                  ? "bg-yellow-400 text-gray-900 ring-4 ring-yellow-100 scale-110"
                                                  : currentStep > step.id
                                                  ? "bg-yellow-400 text-gray-900"
                                                  : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"
                                        }`}
                                   >
                                        {currentStep > step.id ? (
                                             <Check className="w-5 h-5" />
                                        ) : (
                                             step.id
                                        )}
                                   </div>
                                   <span className={`text-xs font-medium hidden md:block transition-colors ${
                                        currentStep === step.id ? "text-yellow-600" : "text-gray-500"
                                   }`}>
                                        {step.shortTitle}
                                   </span>
                              </button>
                         ))}
                    </div>
               </div>

               {/* Form Content */}
               <form onSubmit={handleSubmit} className="p-6">
                    <div className="min-h-96">
                         {currentStep === 1 && (
                              <div className="space-y-6 animate-in fade-in duration-300">
                                   <div className="border-l-4 border-yellow-400 pl-4 mb-6">
                                        <h3 className="text-xl font-black text-gray-900">Offer Classification</h3>
                                        <p className="text-sm text-gray-600 mt-1">Select the category and type of your offer</p>
                                   </div>
                                   <Grid2InputWrapper>
                                        <SelectInputGroup 
                                             name="category" 
                                             label={`Category${categoryId ? `: ${offerCategories.find(c => c.id === categoryId)?.name ?? ""}` : ""}`}
                                             values={offerCategories.map(c => ({label:c.name, value:c.id}))} 
                                             required={!offer}
                                             action={(value) => setCategoryId(value)}
                                        />
                                        <SelectInputGroup 
                                             name="type" 
                                             label={`Offer Type${offerType ? `: ${offerType.split("_").join(" ")}` : ""}`}
                                             values={Object.values(OfferType).map(v => ({value:v, label: v.split("_").join(" ")}))} 
                                             required={!offer}
                                             action={(value) => setOfferType(value)}
                                        />
                                   </Grid2InputWrapper>
                              </div>
                         )}

                         {currentStep === 2 && (
                              <div className="space-y-6 animate-in fade-in duration-300">
                                   <div className="border-l-4 border-yellow-400 pl-4 mb-6">
                                        <h3 className="text-xl font-black text-gray-900">Basic Information</h3>
                                        <p className="text-sm text-gray-600 mt-1">Provide essential details about your offer</p>
                                   </div>
                                   <TextInputGroup 
                                        name="title" 
                                        label="Offer Title" 
                                        placeholder="ex: Construction Consulting Services" 
                                        required 
                                        defaultValue={title}
                                        action={(value) => setTitle(value as string)}
                                   />
                                   <TextAreaInputGroup 
                                        name="description" 
                                        label="Description" 
                                        placeholder="Brief description of the offer" 
                                        required={false} 
                                        maxWords={200}
                                        defaultValue={description}
                                        action={(value) => setDescription(value)}
                                   />
                                   <Grid2InputWrapper>
                                        <SelectInputGroup 
                                             name="priority" 
                                             label={`Priority${priority ? `: ${priority}` : ""}`}
                                             values={Object.values(EOfferPriority).map(v => ({value:v, label: v}))} 
                                             required={!offer}
                                             action={(value) => setPriority(value)}
                                        />
                                        <SelectInputGroup 
                                             name="status" 
                                             label={`Status${status ? `: ${status}` : ""}`}
                                             values={Object.values(EOfferStatus).map(v => ({value:v, label: v}))} 
                                             required={!offer}
                                             action={(value) => setStatus(value)}
                                        />
                                        <SelectInputGroup 
                                             name="visibility" 
                                             label={`Visibility${visibility ? `: ${visibility}` : ""}`}
                                             values={Object.values(OfferVisibility).map(v => ({value:v, label: v}))} 
                                             required={!offer}
                                             action={(value) => setVisibility(value)}
                                        />
                                        <SelectInputGroup 
                                             name="contract-type" 
                                             label={`Contract Type${contractType ? `: ${contractType.split("_").join(" ")}` : ""}`}
                                             values={Object.values(EOFferContractType).map(v => ({value:v, label: v.split("_").join(" ")}))} 
                                             required={!offer}
                                             action={(value) => setContractType(value)}
                                        />
                                   </Grid2InputWrapper>
                              </div>
                         )}

                         {currentStep === 3 && (
                              <div className="space-y-6 animate-in fade-in duration-300">
                                   <div className="border-l-4 border-yellow-400 pl-4 mb-6">
                                        <h3 className="text-xl font-black text-gray-900">Work Details</h3>
                                        <p className="text-sm text-gray-600 mt-1">Define the scope and requirements</p>
                                   </div>
                                   <TextAreaInputGroup 
                                        name="scope-of-work" 
                                        label="Scope of Work" 
                                        placeholder="Describe the scope of work" 
                                        required={false} 
                                        maxWords={200}
                                        defaultValue={scopeOfWork}
                                        action={(value) => setScopeOfWork(value)}
                                   />
                                   <TextAreaInputGroup 
                                        name="quality-standards" 
                                        label="Quality Standards" 
                                        placeholder="Describe the quality standards" 
                                        required={false} 
                                        maxWords={200}
                                        defaultValue={qualityStandards}
                                        action={(value) => setQualityStandards(value)}
                                   />
                                   <TextAreaInputGroup 
                                        name="technical-specifications" 
                                        label="Technical Specifications" 
                                        placeholder="Describe the technical specifications" 
                                        required={false} 
                                        maxWords={200}
                                        defaultValue={technicalSpecifications}
                                        action={(value) => setTechnicalSpecifications(value)}
                                   />
                                   <WordsInput name="tasks" words={tasks} onChange={setTasks} type="text" label="Specific Tasks" />
                                   <TextAreaInputGroup 
                                        name="safety-requirements" 
                                        label="Safety Requirements" 
                                        placeholder="Describe the safety requirements" 
                                        required={false} 
                                        maxWords={200}
                                        defaultValue={safetyRequirements}
                                        action={(value) => setSafetyRequirements(value)}
                                   />
                                   <WordsInput name="required-skills" words={skills} onChange={setSkills} type="text" label="Required Skills" />
                                   <WordsInput name="required-certifications" words={requiredCertifications} onChange={setRequiredCertifications} type="text" label="Required Certifications" />
                                   <WordsInput name="deliverables" words={deliverables} onChange={setDeliverables} type="text" label="Deliverables" />
                              </div>
                         )}

                         {currentStep === 4 && (
                              <div className="space-y-6 animate-in fade-in duration-300">
                                   <div className="border-l-4 border-yellow-400 pl-4 mb-6">
                                        <h3 className="text-xl font-black text-gray-900">Project Information</h3>
                                        <p className="text-sm text-gray-600 mt-1">Link to a project or add location details</p>
                                   </div>
                                   
                                   {/* Project Options */}
                                   <div className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                                        <button
                                             type="button"
                                             onClick={() => setProjectOption("existing")}
                                             className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                                                  projectOption === "existing"
                                                       ? "bg-yellow-400 text-gray-900 shadow-md"
                                                       : "bg-white text-gray-700 hover:bg-gray-100"
                                             }`}
                                        >
                                             Select Existing
                                        </button>
                                        <button
                                             type="button"
                                             onClick={() => setProjectOption("new")}
                                             className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                                                  projectOption === "new"
                                                       ? "bg-yellow-400 text-gray-900 shadow-md"
                                                       : "bg-white text-gray-700 hover:bg-gray-100"
                                             }`}
                                        >
                                             <FolderPlus className="w-4 h-4" />
                                             New Project
                                        </button>
                                        <button
                                             type="button"
                                             onClick={() => setProjectOption("location")}
                                             className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                                                  projectOption === "location"
                                                       ? "bg-yellow-400 text-gray-900 shadow-md"
                                                       : "bg-white text-gray-700 hover:bg-gray-100"
                                             }`}
                                        >
                                             <MapPin className="w-4 h-4" />
                                             Location Only
                                        </button>
                                   </div>

                                   {projectOption === "existing" && (
                                        <SelectInputGroup 
                                             name="project" 
                                             label={`Select Project${projectId ? `: ${projects.find(p => p.id === projectId)?.title ?? ""}` : ""}`}
                                             values={projects.map(p => ({value:p.id, label: p.title}))} 
                                             required={false}
                                             action={(value) => setProjectId(value)}
                                        />
                                   )}

                                   {projectOption === "new" && (
                                        <div className="space-y-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                                             <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                                  <FolderPlus className="w-5 h-5 text-blue-600" />
                                                  New Project Details
                                             </h4>
                                             <TextInputGroup 
                                                  name="new-project-title" 
                                                  label="Project Title" 
                                                  placeholder="Enter project title" 
                                                  required={false}
                                                  defaultValue={newProjectTitle}
                                                  action={(value) => setNewProjectTitle(value as string)}
                                             />
                                             <TextAreaInputGroup 
                                                  name="new-project-description" 
                                                  label="Project Description" 
                                                  placeholder="Brief description" 
                                                  required={false} 
                                                  maxWords={150}
                                                  defaultValue={newProjectDescription}
                                                  action={(value) => setNewProjectDescription(value)}
                                             />
                                             <Grid2InputWrapper>
                                                  <TextInputGroup 
                                                       name="client-name" 
                                                       label="Client Name" 
                                                       placeholder="Client name" 
                                                       required={false}
                                                       defaultValue={clientName}
                                                       action={(value) => setClientName(value as string)}
                                                  />
                                                  <TextInputGroup 
                                                       name="client-email" 
                                                       label="Client Email" 
                                                       type="email" 
                                                       placeholder="client@example.com" 
                                                       required={false}
                                                       defaultValue={clientEmail}
                                                       action={(value) => setClientEmail(value as string)}
                                                  />
                                                  <TextInputGroup 
                                                       name="client-phone" 
                                                       label="Client Phone" 
                                                       type="tel" 
                                                       placeholder="+1234567890" 
                                                       required={false}
                                                       defaultValue={clientPhone}
                                                       action={(value) => setClientPhone(value as string)}
                                                  />
                                                  <TextInputGroup 
                                                       name="initiated-on" 
                                                       label="Initiated On" 
                                                       type="date" 
                                                       required={false}
                                                       defaultValue={initiatedOn}
                                                       action={(value) => setInitiatedOn(value as string)}
                                                  />
                                             </Grid2InputWrapper>
                                        </div>
                                   )}

                                   {(projectOption === "location" || projectOption === "new") && (
                                        <div className="space-y-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                                             <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                                  <MapPin className="w-5 h-5 text-green-600" />
                                                  Site Location
                                             </h4>
                                             <Grid2InputWrapper>
                                                  <TextInputGroup 
                                                       name="country" 
                                                       label="Country" 
                                                       placeholder="Country" 
                                                       required={false}
                                                       defaultValue={country}
                                                       action={(value) => setCountry(value as string)}
                                                  />
                                                  <TextInputGroup 
                                                       name="city" 
                                                       label="City" 
                                                       placeholder="City" 
                                                       required={false}
                                                       defaultValue={city}
                                                       action={(value) => setCity(value as string)}
                                                  />
                                                  <TextInputGroup 
                                                       name="state" 
                                                       label="State/Province" 
                                                       placeholder="State" 
                                                       required={false}
                                                       defaultValue={state}
                                                       action={(value) => setState(value as string)}
                                                  />
                                                  <TextInputGroup 
                                                       name="zip-code" 
                                                       label="Zip Code" 
                                                       placeholder="Zip code" 
                                                       required={false}
                                                       defaultValue={zipCode}
                                                       action={(value) => setZipCode(value as string)}
                                                  />
                                             </Grid2InputWrapper>
                                             <TextInputGroup 
                                                  name="address" 
                                                  label="Full Address" 
                                                  placeholder="Street address" 
                                                  required={false}
                                                  defaultValue={address}
                                                  action={(value) => setAddress(value as string)}
                                             />
                                        </div>
                                   )}
                              </div>
                         )}

                         {currentStep === 5 && (
                              <div className="space-y-6 animate-in fade-in duration-300">
                                   <div className="border-l-4 border-yellow-400 pl-4 mb-6">
                                        <h3 className="text-xl font-black text-gray-900">Timeline</h3>
                                        <p className="text-sm text-gray-600 mt-1">Set important dates and duration</p>
                                   </div>
                                   <Grid2InputWrapper>
                                        <TextInputGroup 
                                             name="start-date" 
                                             label="Start Date" 
                                             type="date" 
                                             required={false}
                                             defaultValue={startDate}
                                             action={(value) => setStartDate(value as string)}
                                        />
                                        <TextInputGroup 
                                             name="end-date" 
                                             label="End Date" 
                                             type="date" 
                                             required={false}
                                             defaultValue={endDate}
                                             action={(value) => setEndDate(value as string)}
                                        />
                                        <TextInputGroup 
                                             name="deadline" 
                                             label="Submission Deadline" 
                                             type="date" 
                                             required={false}
                                             defaultValue={deadline}
                                             action={(value) => setDeadline(value as string)}
                                        />
                                        <div className="col-span-2 grid grid-cols-2 gap-4">
                                             <TextInputGroup 
                                                  name="duration" 
                                                  label="Duration" 
                                                  type="number" 
                                                  placeholder="e.g., 6" 
                                                  required={false}
                                                  defaultValue={duration}
                                                  action={(value) => setDuration(value as string)}
                                             />
                                             <SelectInputGroup 
                                                  name="duration-unit" 
                                                  label={`Duration Unit${durationUnit ? `: ${durationUnit}` : ""}`}
                                                  values={Object.values(EDurationUnit).map(v => ({value:v, label: v}))} 
                                                  required={false}
                                                  action={(value) => setDurationUnit(value)}
                                             />
                                        </div>
                                   </Grid2InputWrapper>
                              </div>
                         )}

                         {currentStep === 6 && (
                              <div className="space-y-6 animate-in fade-in duration-300">
                                   <div className="border-l-4 border-yellow-400 pl-4 mb-6">
                                        <h3 className="text-xl font-black text-gray-900">Pricing & Payment</h3>
                                        <p className="text-sm text-gray-600 mt-1">Define budget and payment terms</p>
                                   </div>
                                   <Grid2InputWrapper>
                                        <TextInputGroup 
                                             name="budget-min" 
                                             label="Minimum Budget" 
                                             type="number" 
                                             placeholder="0.00" 
                                             required={false}
                                             defaultValue={budgetMin}
                                             action={(value) => setBudgetMin(value as string)}
                                        />
                                        <TextInputGroup 
                                             name="budget-max" 
                                             label="Maximum Budget" 
                                             type="number" 
                                             placeholder="0.00" 
                                             required={false}
                                             defaultValue={budgetMax}
                                             action={(value) => setBudgetMax(value as string)}
                                        />
                                        <TextInputGroup 
                                             name="currency" 
                                             label="Currency" 
                                             placeholder="USD" 
                                             required={false}
                                             defaultValue={currency}
                                             action={(value) => setCurrency(value as string)}
                                        />
                                   </Grid2InputWrapper>
                                   <TextAreaInputGroup 
                                        name="payment-terms" 
                                        label="Payment Terms" 
                                        placeholder="Describe the payment terms and conditions" 
                                        required={false} 
                                        maxWords={200}
                                        defaultValue={paymentTerms}
                                        action={(value) => setPaymentTerms(value)}
                                   />
                                   <WordsInput 
                                        name="payment-methods" 
                                        type="select" 
                                        label="Payment Methods" 
                                        words={paymentMethods} 
                                        onChange={words => setPaymentMethods(words as EPaymentMethod[])} 
                                   />
                              </div>
                         )}

                         {currentStep === 7 && (
                              <div className="space-y-6 animate-in fade-in duration-300">
                                   <div className="border-l-4 border-yellow-400 pl-4 mb-6">
                                        <h3 className="text-xl font-black text-gray-900">Submission Information</h3>
                                        <p className="text-sm text-gray-600 mt-1">How companies should submit proposals</p>
                                   </div>
                                   <Grid2InputWrapper>
                                        <TextInputGroup 
                                             name="proposal-format" 
                                             label="Proposal Format" 
                                             placeholder="PDF, Word, etc." 
                                             required={false}
                                             defaultValue={proposalFormat}
                                             action={(value) => setProposalFormat(value as string)}
                                        />
                                        <SelectInputGroup 
                                             name="auto-close" 
                                             label={`Auto Close After Deadline${autoClose ? `: ${autoClose}` : ""}`}
                                             values={[{value:"Yes", label:"Yes"}, {value:"No", label:"No"}]} 
                                             required={false}
                                             action={(value) => setAutoClose(value)}
                                        />
                                        <TextInputGroup 
                                             name="contact-email" 
                                             label="Contact Email" 
                                             type="email" 
                                             placeholder="contact@company.com" 
                                             required={false}
                                             defaultValue={contactEmail}
                                             action={(value) => setContactEmail(value as string)}
                                        />
                                        <TextInputGroup 
                                             name="contact-phone" 
                                             label="Contact Phone" 
                                             type="tel" 
                                             placeholder="+1234567890" 
                                             required={false}
                                             defaultValue={contactPhone}
                                             action={(value) => setContactPhone(value as string)}
                                        />
                                   </Grid2InputWrapper>
                                   <TextAreaInputGroup 
                                        name="submission-notes" 
                                        label="Submission Guidelines" 
                                        placeholder="Additional instructions for companies submitting proposals" 
                                        required={false} 
                                        maxWords={200}
                                        defaultValue={submissionNotes}
                                        action={(value) => setSubmissionNotes(value)}
                                   />
                              </div>
                         )}

                         {currentStep === 8 && (
                              <div className="space-y-6 animate-in fade-in duration-300">
                                   <div className="border-l-4 border-yellow-400 pl-4 mb-6">
                                        <h3 className="text-xl font-black text-gray-900">Offer Documents</h3>
                                        <p className="text-sm text-gray-600 mt-1">Attach relevant documents (optional)</p>
                                   </div>
                                   
                                   {documents.length > 0 && (
                                        <div className="grid md:grid-cols-2 gap-4">
                                             {documents.map((doc, index) => (
                                                  <OfferDocumentForm 
                                                       key={doc.id} 
                                                       document={doc} 
                                                       onChange={updatedDoc => {
                                                            const newDocs = [...documents];
                                                            newDocs[index] = updatedDoc;
                                                            setDocuments(newDocs);
                                                       }}
                                                       onDelete={() => {
                                                            setDocuments(documents.filter((d) => d.id !== doc.id));
                                                       }}
                                                  />
                                             ))}
                                        </div>
                                   )}
                                   
                                   <button 
                                        type="button" 
                                        onClick={handleAddDocument}
                                        className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 font-semibold hover:border-yellow-400 hover:text-yellow-600 hover:bg-yellow-50 transition-all"
                                   >
                                        + Add Document
                                   </button>

                                   {documents.length === 0 && (
                                        <div className="text-center py-12 text-gray-500">
                                             <p className="text-sm">No documents added yet</p>
                                             <p className="text-xs mt-1">Click "Add Document" to attach files</p>
                                        </div>
                                   )}
                              </div>
                         )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                         <button
                              type="button"
                              onClick={goToPrevStep}
                              disabled={currentStep === 1}
                              className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                         >
                              <ChevronLeft className="w-5 h-5" />
                              Previous
                         </button>

                         <div className="text-sm font-medium text-gray-600">
                              {FORM_STEPS[currentStep - 1].title}
                         </div>

                         {currentStep < FORM_STEPS.length ? (
                              <button
                                   type="button"
                                   onClick={goToNextStep}
                                   className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-gray-900 bg-yellow-400 hover:bg-yellow-300 transition-all"
                              >
                                   Next
                                   <ChevronRight className="w-5 h-5" />
                              </button>
                         ) : (
                              <button
                                   type="submit"
                                   disabled={loading}
                                   className="flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-white bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                              >
                                   {loading ? (
                                        <>
                                             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                             Saving...
                                        </>
                                   ) : (
                                        <>
                                             <Check className="w-5 h-5" />
                                             Save Offer
                                        </>
                                   )}
                              </button>
                         )}
                    </div>
               </form>
          </div>
     )
}