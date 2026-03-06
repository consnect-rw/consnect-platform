"use client";

import { TCompanyOfferDetail } from "@/types/offer/offer";
import Link from "next/link";
import { 
     ArrowLeft, Briefcase, FileText, CheckCircle, Clock, AlertCircle,
     Calendar, DollarSign, MapPin, Users, Edit, Trash2, Eye, Mail, Phone,
     Building2, Package
} from "lucide-react";
import { useState } from "react";
import { deleteOffer, updateOffer } from "@/server/offer/offer";
import { toast } from "sonner";
import queryClient from "@/lib/queryClient";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("@/components/ui/PdfViewer").then(mod => ({ default: mod.PdfViewer })), { ssr: false });

interface CompanyOfferDetailViewProps {
     offer: TCompanyOfferDetail;
}

export const CompanyOfferDetailView = ({ offer }: CompanyOfferDetailViewProps) => {
     const router = useRouter();
     const [deleting, setDeleting] = useState(false);
     const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
     const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
     const [changingStatus, setChangingStatus] = useState(false);

     const handleDelete = async () => {
          setDeleting(true);
          try {
               const result = await deleteOffer(offer.id);
               if (result) {
                    toast.success("Offer deleted successfully");
                    queryClient.invalidateQueries({ queryKey: ["user-offers"] });
                    router.push("/dashboard/offers");
               } else {
                    toast.error("Failed to delete offer");
               }
          } catch (error) {
               toast.error("An error occurred while deleting");
          } finally {
               setDeleting(false);
          }
     };

     const handleStatusChange = async (newStatus: string) => {
          setChangingStatus(true);
          try {
               const result = await updateOffer(offer.id, { status: newStatus as any });
               if (result) {
                    toast.success(`Offer status updated to ${newStatus}`);
                    queryClient.invalidateQueries({ queryKey: ["user-offers"] });
                    router.refresh();
               } else {
                    toast.error("Failed to update status");
               }
          } catch (error) {
               toast.error("An error occurred while updating");
          } finally {
               setChangingStatus(false);
          }
     };

     const getStatusColor = () => {
          switch (offer.status) {
               case "PUBLISHED": return "text-green-600 bg-green-50 border-green-200";
               case "DRAFT": return "text-gray-600 bg-gray-50 border-gray-200";
               case "CLOSED": return "text-blue-600 bg-blue-50 border-blue-200";
               case "CANCELLED": return "text-red-600 bg-red-50 border-red-200";
               default: return "text-gray-600 bg-gray-50 border-gray-200";
          }
     };

     const getExecutionStatusColor = () => {
          switch (offer.executionStatus) {
               case "AWARDED": return "text-purple-600 bg-purple-50";
               case "IN_PROGRESS": return "text-blue-600 bg-blue-50";
               case "COMPLETED": return "text-green-600 bg-green-50";
               case "NEGOTIATING": return "text-orange-600 bg-orange-50";
               default: return "text-gray-600 bg-gray-50";
          }
     };

     const getPriorityColor = () => {
          switch (offer.priority) {
               case "URGENT": return "text-red-600 bg-red-50 border-red-200";
               case "HIGH": return "text-orange-600 bg-orange-50 border-orange-200";
               case "MEDIUM": return "text-yellow-600 bg-yellow-50 border-yellow-200";
               case "LOW": return "text-blue-600 bg-blue-50 border-blue-200";
               default: return "text-gray-600 bg-gray-50 border-gray-200";
          }
     };

     const getTypeLabel = () => {
          switch (offer.type) {
               case "WORK_TASK": return "Work Task";
               case "MATERIAL_SUPPLY": return "Material Supply";
               case "EQUIPMENT_RENTAL": return "Equipment Rental";
               case "CONSULTANCY": return "Consultancy";
               case "SUBCONTRACTING": return "Subcontracting";
               case "MAINTENANCE": return "Maintenance";
               default: return offer.type;
          }
     };

     const formatBudget = () => {
          if (!offer.pricing) return null;
          const { budgetMin, budgetMax, currency } = offer.pricing;
          const curr = currency || "USD";
          
          if (budgetMin && budgetMax) {
               return `${curr} ${Number(budgetMin).toLocaleString()} - ${Number(budgetMax).toLocaleString()}`;
          } else if (budgetMin) {
               return `From ${curr} ${Number(budgetMin).toLocaleString()}`;
          } else if (budgetMax) {
               return `Up to ${curr} ${Number(budgetMax).toLocaleString()}`;
          }
          return null;
     };

     const formatDate = (date: Date | null | undefined) => {
          if (!date) return "Not specified";
          return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
     };

     const budget = formatBudget();

     return (
          <div className="min-h-screen bg-gray-50 py-8">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Delete Confirmation Modal */}
                    {showDeleteConfirm && (
                         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                                   <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <AlertCircle className="w-8 h-8 text-red-600" />
                                   </div>
                                   <h3 className="text-2xl font-black text-gray-900 mb-2 text-center">Delete Offer?</h3>
                                   <p className="text-gray-600 text-center mb-6">
                                        This action cannot be undone. All interests, invitations, and documents will be permanently removed.
                                   </p>
                                   <div className="flex gap-3">
                                        <button
                                             onClick={() => setShowDeleteConfirm(false)}
                                             disabled={deleting}
                                             className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-all"
                                        >
                                             Cancel
                                        </button>
                                        <button
                                             onClick={handleDelete}
                                             disabled={deleting}
                                             className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                                        >
                                             {deleting ? "Deleting..." : "Delete"}
                                        </button>
                                   </div>
                              </div>
                         </div>
                    )}

                    {/* Back Button */}
                    <Link
                         href="/dashboard/offers"
                         className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold mb-6 transition-colors"
                    >
                         <ArrowLeft className="w-5 h-5" />
                         Back to My Offers
                    </Link>

                    {/* Main Content Grid */}
                    <div className="grid lg:grid-cols-3 gap-6">
                         {/* Main Column */}
                         <div className="lg:col-span-2 space-y-6">
                              {/* Header Card */}
                              <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-6 sm:p-8">
                                   {/* Status Badges */}
                                   <div className="flex items-center gap-2 mb-4 flex-wrap">
                                        <div className={`px-3 py-1 rounded-md border text-sm font-bold ${getStatusColor()}`}>
                                             {offer.status}
                                        </div>
                                        {offer.executionStatus !== "NONE" && (
                                             <div className={`px-3 py-1 rounded-md text-sm font-bold ${getExecutionStatusColor()}`}>
                                                  {offer.executionStatus.replace("_", " ")}
                                             </div>
                                        )}
                                        <div className={`px-3 py-1 rounded-md border text-sm font-bold ${getPriorityColor()}`}>
                                             {offer.priority} Priority
                                        </div>
                                        <div className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-bold rounded-md">
                                             {getTypeLabel()}
                                        </div>
                                   </div>

                                   {/* Title */}
                                   <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 leading-tight">
                                        {offer.title}
                                   </h1>

                                   {/* Category */}
                                   <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-bold rounded-full mb-6">
                                        {offer.category.name}
                                   </div>

                                   {/* Description */}
                                   <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                        {offer.description}
                                   </p>

                                   {/* Key Info Grid */}
                                   <div className="grid sm:grid-cols-2 gap-4">
                                        {budget && (
                                             <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl">
                                                  <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center shrink-0">
                                                       <DollarSign className="w-5 h-5 text-gray-900" />
                                                  </div>
                                                  <div>
                                                       <p className="text-sm text-gray-600 font-medium">Budget</p>
                                                       <p className="text-lg font-black text-gray-900">{budget}</p>
                                                  </div>
                                             </div>
                                        )}

                                        {offer.timeline?.deadline && (
                                             <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                                                  <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center shrink-0">
                                                       <Calendar className="w-5 h-5 text-white" />
                                                  </div>
                                                  <div>
                                                       <p className="text-sm text-gray-600 font-medium">Deadline</p>
                                                       <p className="text-lg font-black text-gray-900">{formatDate(offer.timeline.deadline)}</p>
                                                  </div>
                                             </div>
                                        )}

                                        {offer.siteLocation && (
                                             <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl sm:col-span-2">
                                                  <div className="w-10 h-10 bg-green-400 rounded-lg flex items-center justify-center shrink-0">
                                                       <MapPin className="w-5 h-5 text-white" />
                                                  </div>
                                                  <div>
                                                       <p className="text-sm text-gray-600 font-medium">Location</p>
                                                       <p className="text-lg font-black text-gray-900">
                                                            {offer.siteLocation.address && `${offer.siteLocation.address}, `}
                                                            {offer.siteLocation.city}, {offer.siteLocation.state && `${offer.siteLocation.state}, `}
                                                            {offer.siteLocation.country}
                                                       </p>
                                                  </div>
                                             </div>
                                        )}
                                   </div>
                              </div>

                              {/* Project Info */}
                              {offer.project && (
                                   <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-6 sm:p-8">
                                        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                             <Building2 className="w-6 h-6 text-blue-600" />
                                             Project Information
                                        </h2>

                                        <div className="space-y-4">
                                             <div>
                                                  <h3 className="text-lg font-bold text-gray-900">{offer.project.title}</h3>
                                                  <p className="text-gray-700 mt-1">{offer.project.description}</p>
                                             </div>

                                             <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                                  <div>
                                                       <p className="text-sm text-gray-600 font-medium">Phase</p>
                                                       <p className="text-gray-900 font-bold">{offer.project.phase.replace("_", " ")}</p>
                                                  </div>
                                                  <div>
                                                       <p className="text-sm text-gray-600 font-medium">Client</p>
                                                       <p className="text-gray-900 font-bold">{offer.project.clientName}</p>
                                                  </div>
                                                  {offer.project.clientEmail && (
                                                       <div>
                                                            <p className="text-sm text-gray-600 font-medium">Client Email</p>
                                                            <a href={`mailto:${offer.project.clientEmail}`} className="text-yellow-600 hover:text-yellow-700 font-bold">
                                                                 {offer.project.clientEmail}
                                                            </a>
                                                       </div>
                                                  )}
                                                  {offer.project.clientPhone && (
                                                       <div>
                                                            <p className="text-sm text-gray-600 font-medium">Client Phone</p>
                                                            <a href={`tel:${offer.project.clientPhone}`} className="text-yellow-600 hover:text-yellow-700 font-bold">
                                                                 {offer.project.clientPhone}
                                                            </a>
                                                       </div>
                                                  )}
                                             </div>

                                             {offer.project.location && (
                                                  <div className="pt-4 border-t border-gray-100">
                                                       <p className="text-sm text-gray-600 font-medium mb-1">Project Location</p>
                                                       <p className="text-gray-900 font-bold">
                                                            {offer.project.location.address && `${offer.project.location.address}, `}
                                                            {offer.project.location.city}, {offer.project.location.state && `${offer.project.location.state}, `}
                                                            {offer.project.location.country}
                                                       </p>
                                                  </div>
                                             )}
                                        </div>
                                   </div>
                              )}

                              {/* Work Details */}
                              {(offer.scopeOfWork || offer.specificTasks.length > 0 || offer.requiredSkills.length > 0) && (
                                   <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-6 sm:p-8">
                                        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                             <Briefcase className="w-6 h-6 text-yellow-600" />
                                             Work Details
                                        </h2>

                                        {offer.scopeOfWork && (
                                             <div className="mb-6">
                                                  <h3 className="text-lg font-bold text-gray-900 mb-2">Scope of Work</h3>
                                                  <p className="text-gray-700 leading-relaxed">{offer.scopeOfWork}</p>
                                             </div>
                                        )}

                                        {offer.specificTasks.length > 0 && (
                                             <div className="mb-6">
                                                  <h3 className="text-lg font-bold text-gray-900 mb-3">Specific Tasks</h3>
                                                  <ul className="space-y-2">
                                                       {offer.specificTasks.map((task, idx) => (
                                                            <li key={idx} className="flex items-start gap-2">
                                                                 <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                                                 <span className="text-gray-700">{task}</span>
                                                            </li>
                                                       ))}
                                                  </ul>
                                             </div>
                                        )}

                                        {offer.requiredSkills.length > 0 && (
                                             <div className="mb-6">
                                                  <h3 className="text-lg font-bold text-gray-900 mb-3">Required Skills</h3>
                                                  <div className="flex flex-wrap gap-2">
                                                       {offer.requiredSkills.map((skill, idx) => (
                                                            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-900 text-sm font-bold rounded-full">
                                                                 {skill}
                                                            </span>
                                                       ))}
                                                  </div>
                                             </div>
                                        )}

                                        {offer.deliverables.length > 0 && (
                                             <div>
                                                  <h3 className="text-lg font-bold text-gray-900 mb-3">Deliverables</h3>
                                                  <ul className="space-y-2">
                                                       {offer.deliverables.map((item, idx) => (
                                                            <li key={idx} className="flex items-start gap-2">
                                                                 <FileText className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                                                                 <span className="text-gray-700">{item}</span>
                                                            </li>
                                                       ))}
                                                  </ul>
                                             </div>
                                        )}
                                   </div>
                              )}

                              {/* Technical Requirements */}
                              {(offer.technicalSpecifications || offer.qualityStandards || offer.safetyRequirements || offer.requiredCertifications.length > 0) && (
                                   <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-6 sm:p-8">
                                        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                             <AlertCircle className="w-6 h-6 text-orange-600" />
                                             Technical Requirements
                                        </h2>

                                        {offer.technicalSpecifications && (
                                             <div className="mb-6">
                                                  <h3 className="text-lg font-bold text-gray-900 mb-2">Technical Specifications</h3>
                                                  <p className="text-gray-700 leading-relaxed">{offer.technicalSpecifications}</p>
                                             </div>
                                        )}

                                        {offer.qualityStandards && (
                                             <div className="mb-6">
                                                  <h3 className="text-lg font-bold text-gray-900 mb-2">Quality Standards</h3>
                                                  <p className="text-gray-700 leading-relaxed">{offer.qualityStandards}</p>
                                             </div>
                                        )}

                                        {offer.safetyRequirements && (
                                             <div className="mb-6">
                                                  <h3 className="text-lg font-bold text-gray-900 mb-2">Safety Requirements</h3>
                                                  <p className="text-gray-700 leading-relaxed">{offer.safetyRequirements}</p>
                                             </div>
                                        )}

                                        {offer.requiredCertifications.length > 0 && (
                                             <div>
                                                  <h3 className="text-lg font-bold text-gray-900 mb-3">Required Certifications</h3>
                                                  <div className="flex flex-wrap gap-2">
                                                       {offer.requiredCertifications.map((cert, idx) => (
                                                            <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-900 text-sm font-bold rounded-full">
                                                                 {cert}
                                                            </span>
                                                       ))}
                                                  </div>
                                             </div>
                                        )}
                                   </div>
                              )}

                              {/* Documents */}
                              {offer.documents.length > 0 && (
                                   <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-6 sm:p-8">
                                        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                             <FileText className="w-6 h-6 text-purple-600" />
                                             Documents ({offer.documents.length})
                                        </h2>

                                        <div className="grid gap-3">
                                             {offer.documents.map((doc) => (
                                                  <button
                                                       key={doc.id}
                                                       onClick={() => setSelectedDocument(doc.url)}
                                                       className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-left"
                                                  >
                                                       <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                                                            <FileText className="w-5 h-5 text-purple-600" />
                                                       </div>
                                                       <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-gray-900 truncate">{doc.type.replace("_", " ")}</p>
                                                            {doc.description && (
                                                                 <p className="text-sm text-gray-600 truncate">{doc.description}</p>
                                                            )}
                                                            <p className="text-xs text-gray-500 mt-1">Downloads: {doc.downloadCount}</p>
                                                       </div>
                                                       <span className="text-xs font-medium text-gray-500 px-2 py-1 bg-gray-200 rounded">
                                                            {doc.accessLevel}
                                                       </span>
                                                  </button>
                                             ))}
                                        </div>
                                   </div>
                              )}

                              {/* Interests */}
                              {offer.interests.length > 0 && (
                                   <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-6 sm:p-8">
                                        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                             <Users className="w-6 h-6 text-green-600" />
                                             Companies Interested ({offer.interests.length})
                                        </h2>

                                        <div className="space-y-3">
                                             {offer.interests.filter(i => i.company).map((interest) => (
                                                  <div key={interest.id} className="p-4 bg-gray-50 rounded-xl">
                                                       <div className="flex items-start justify-between gap-3 mb-2">
                                                            <div className="flex-1">
                                                                 <Link
                                                                      href={`/company/${interest.company!.handle}`}
                                                                      className="font-bold text-gray-900 hover:text-yellow-600 transition-colors"
                                                                 >
                                                                      {interest.company!.name}
                                                                 </Link>
                                                                 <p className="text-sm text-gray-600">{interest.message}</p>
                                                            </div>
                                                            <div className={`px-2 py-1 rounded text-xs font-bold ${
                                                                 interest.status === "PENDING" ? "bg-yellow-100 text-yellow-900" :
                                                                 interest.status === "ACCEPTED" ? "bg-green-100 text-green-900" :
                                                                 "bg-red-100 text-red-900"
                                                            }`}>
                                                                 {interest.status}
                                                            </div>
                                                       </div>
                                                       <div className="flex items-center gap-4 text-xs text-gray-500">
                                                            <span>{formatDate(interest.createdAt)}</span>
                                                            {interest.company!.email && (
                                                                 <a href={`mailto:${interest.company!.email}`} className="flex items-center gap-1 hover:text-yellow-600">
                                                                      <Mail className="w-3 h-3" />
                                                                      Contact
                                                                 </a>
                                                            )}
                                                       </div>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>
                              )}
                         </div>

                         {/* Sidebar */}
                         <div className="space-y-6">
                              {/* Actions Card */}
                              <div className="bg-white rounded-2xl shadow-sm border-2 border-yellow-400 p-6">
                                   <h3 className="text-lg font-black text-gray-900 mb-4">Actions</h3>

                                   <div className="space-y-3">
                                        <Link
                                             href={`/dashboard/offers/form?offerId=${offer.id}`}
                                             className="w-full px-4 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                        >
                                             <Edit className="w-5 h-5" />
                                             Edit Offer
                                        </Link>

                                        <Link
                                             href={`/offer/${offer.id}`}
                                             className="w-full px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                        >
                                             <Eye className="w-5 h-5" />
                                             View Public Page
                                        </Link>

                                        <button
                                             onClick={() => setShowDeleteConfirm(true)}
                                             className="w-full px-4 py-3 bg-red-100 hover:bg-red-200 text-red-900 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                        >
                                             <Trash2 className="w-5 h-5" />
                                             Delete Offer
                                        </button>
                                   </div>

                                   {/* Status Change */}
                                   <div className="mt-6 pt-6 border-t border-gray-200">
                                        <p className="text-sm font-bold text-gray-700 mb-3">Change Status</p>
                                        <div className="space-y-2">
                                             {offer.status !== "PUBLISHED" && (
                                                  <button
                                                       onClick={() => handleStatusChange("PUBLISHED")}
                                                       disabled={changingStatus}
                                                       className="w-full px-3 py-2 bg-green-100 hover:bg-green-200 text-green-900 font-bold rounded-lg transition-all text-sm disabled:opacity-50"
                                                  >
                                                       Publish
                                                  </button>
                                             )}
                                             {offer.status !== "CLOSED" && (
                                                  <button
                                                       onClick={() => handleStatusChange("CLOSED")}
                                                       disabled={changingStatus}
                                                       className="w-full px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold rounded-lg transition-all text-sm disabled:opacity-50"
                                                  >
                                                       Close
                                                  </button>
                                             )}
                                        </div>
                                   </div>
                              </div>

                              {/* Stats Card */}
                              <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-6">
                                   <h3 className="text-lg font-black text-gray-900 mb-4">Statistics</h3>

                                   <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                             <span className="text-gray-600 font-medium">Interests</span>
                                             <span className="text-2xl font-black text-gray-900">{offer._count.interests}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                             <span className="text-gray-600 font-medium">Invitations</span>
                                             <span className="text-2xl font-black text-gray-900">{offer._count.invitations}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                             <span className="text-gray-600 font-medium">Created</span>
                                             <span className="text-sm font-bold text-gray-900">{formatDate(offer.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                             <span className="text-gray-600 font-medium">Updated</span>
                                             <span className="text-sm font-bold text-gray-900">{formatDate(offer.updatedAt)}</span>
                                        </div>
                                   </div>
                              </div>

                              {/* Timeline */}
                              {offer.timeline && (
                                   <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-6">
                                        <h3 className="text-lg font-black text-gray-900 mb-4">Timeline</h3>

                                        <div className="space-y-3 text-sm">
                                             {offer.timeline.startDate && (
                                                  <div>
                                                       <p className="text-gray-600 font-medium">Start Date</p>
                                                       <p className="text-gray-900 font-bold">{formatDate(offer.timeline.startDate)}</p>
                                                  </div>
                                             )}
                                             {offer.timeline.endDate && (
                                                  <div>
                                                       <p className="text-gray-600 font-medium">End Date</p>
                                                       <p className="text-gray-900 font-bold">{formatDate(offer.timeline.endDate)}</p>
                                                  </div>
                                             )}
                                             {offer.timeline.deadline && (
                                                  <div>
                                                       <p className="text-gray-600 font-medium">Deadline</p>
                                                       <p className="text-gray-900 font-bold">{formatDate(offer.timeline.deadline)}</p>
                                                  </div>
                                             )}
                                             {offer.timeline.duration && (
                                                  <div>
                                                       <p className="text-gray-600 font-medium">Duration</p>
                                                       <p className="text-gray-900 font-bold">
                                                            {offer.timeline.duration} {offer.timeline.durationUnit?.toLowerCase()}
                                                       </p>
                                                  </div>
                                             )}
                                        </div>
                                   </div>
                              )}

                              {/* Pricing Details */}
                              {offer.pricing && (offer.pricing.paymentTerms || offer.pricing.paymentMethods.length > 0) && (
                                   <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-6">
                                        <h3 className="text-lg font-black text-gray-900 mb-4">Payment Details</h3>

                                        {offer.pricing.paymentTerms && (
                                             <div className="mb-4">
                                                  <p className="text-sm text-gray-600 font-medium mb-1">Payment Terms</p>
                                                  <p className="text-gray-900 leading-relaxed">{offer.pricing.paymentTerms}</p>
                                             </div>
                                        )}

                                        {offer.pricing.paymentMethods.length > 0 && (
                                             <div>
                                                  <p className="text-sm text-gray-600 font-medium mb-2">Accepted Methods</p>
                                                  <div className="flex flex-wrap gap-2">
                                                       {offer.pricing.paymentMethods.map((method, idx) => (
                                                            <span key={idx} className="px-2 py-1 bg-green-100 text-green-900 text-xs font-bold rounded">
                                                                 {method.replace("_", " ")}
                                                            </span>
                                                       ))}
                                                  </div>
                                             </div>
                                        )}
                                   </div>
                              )}
                         </div>
                    </div>
               </div>

               {/* PDF Viewer Modal */}
               {selectedDocument && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
                         <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col">
                              <PdfViewer
                                   pdfUrl={selectedDocument}
                                   title="Offer Document"
                                   onClose={() => setSelectedDocument(null)}
                              />
                         </div>
                    </div>
               )}
          </div>
     );
};
