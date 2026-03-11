"use client";

import { TAdminOfferDetail } from "@/types/offer/offer";
import Link from "next/link";
import { 
     ArrowLeft, Briefcase, FileText, CheckCircle, Clock, AlertCircle,
     Calendar, DollarSign, MapPin, Users, Trash2, Building2, Shield,
     CheckCircle2, XCircle, Package
} from "lucide-react";
import { useState } from "react";
import { deleteOffer, updateOffer } from "@/server/offer/offer";
import { toast } from "sonner";
import queryClient from "@/lib/queryClient";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "@/components/ui/Image";

const PdfViewer = dynamic(() => import("@/components/ui/PdfViewer").then(mod => ({ default: mod.PdfViewer })), { ssr: false });

interface AdminOfferDetailViewProps {
     offer: TAdminOfferDetail;
}

export const AdminOfferDetailView = ({ offer }: AdminOfferDetailViewProps) => {
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
                    toast.success("Offer permanently deleted");
                    queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
                    router.push("/admin/offers");
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
                    queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
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
                                   <h3 className="text-2xl font-black text-gray-900 mb-2 text-center">Permanently Delete Offer?</h3>
                                   <p className="text-gray-600 text-center mb-6">
                                        This action cannot be undone. All associated data including interests, invitations, and documents will be permanently removed from the system.
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
                         href="/admin/offers"
                         className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold mb-6 transition-colors"
                    >
                         <ArrowLeft className="w-5 h-5" />
                         Back to Offers
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
                                        <div className={`px-3 py-1 rounded-md text-sm font-bold ${
                                             offer.visibility === "PUBLIC" ? "bg-green-100 text-green-900" :
                                             offer.visibility === "RESTRICTED" ? "bg-yellow-100 text-yellow-900" :
                                             "bg-gray-100 text-gray-900"
                                        }`}>
                                             {offer.visibility}
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

                              {/* Company Information */}
                              {offer.company && (
                                   <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-6 sm:p-8">
                                        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                             <Building2 className="w-6 h-6 text-blue-600" />
                                             Company Information
                                        </h2>

                                        <div className="flex items-start gap-4">
                                             {offer.company.logoUrl && (
                                                  <Image
                                                       src={offer.company.logoUrl}
                                                       alt={offer.company.name}
                                                       width={80}
                                                       height={80}
                                                       className="rounded-xl object-cover"
                                                  />
                                             )}
                                             <div className="flex-1">
                                                  <Link
                                                       href={`/company/${offer.company.handle}`}
                                                       className="text-xl font-black text-gray-900 hover:text-yellow-600 transition-colors"
                                                  >
                                                       {offer.company.name}
                                                  </Link>
                                                  
                                                  {/* Verification Status */}
                                                  {offer.company.verification && (
                                                       <div className="mt-2 flex items-center gap-2">
                                                            {offer.company.verification.status === "VERIFIED" ? (
                                                                 <>
                                                                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                                      <span className="text-green-600 font-bold text-sm">Verified Company</span>
                                                                 </>
                                                            ) : (
                                                                 <>
                                                                      <XCircle className="w-5 h-5 text-gray-400" />
                                                                      <span className="text-gray-600 font-bold text-sm">
                                                                           {offer.company.verification.status}
                                                                      </span>
                                                                 </>
                                                            )}
                                                            
                                                            {/* Consnect Badge */}
                                                            {offer.company.verification.isBronzeVerified && (
                                                                 <span className="px-2 py-1 bg-orange-100 text-orange-900 text-xs font-bold rounded">
                                                                      BRONZE
                                                                 </span>
                                                            )}
                                                            {offer.company.verification.isSilverVerified && (
                                                                 <span className="px-2 py-1 bg-gray-300 text-gray-900 text-xs font-bold rounded">
                                                                      SILVER
                                                                 </span>
                                                            )}
                                                            {offer.company.verification.isGoldVerified && (
                                                                 <span className="px-2 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded">
                                                                      GOLD
                                                                 </span>
                                                            )}
                                                       </div>
                                                  )}

                                                  <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                                                       {offer.company.email && (
                                                            <div>
                                                                 <p className="text-gray-600 font-medium">Email</p>
                                                                 <a href={`mailto:${offer.company.email}`} className="text-yellow-600 hover:text-yellow-700 font-bold">
                                                                      {offer.company.email}
                                                                 </a>
                                                            </div>
                                                       )}
                                                       {offer.company.phone && (
                                                            <div>
                                                                 <p className="text-gray-600 font-medium">Phone</p>
                                                                 <a href={`tel:${offer.company.phone}`} className="text-yellow-600 hover:text-yellow-700 font-bold">
                                                                      {offer.company.phone}
                                                                 </a>
                                                            </div>
                                                       )}
                                                  </div>
                                             </div>
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
                                                            <div className="flex items-center gap-2 mt-1">
                                                                 <p className="text-xs text-gray-500">Downloads: {doc.downloadCount}</p>
                                                                 <span className="text-xs font-medium text-gray-500 px-2 py-0.5 bg-gray-200 rounded">
                                                                      {doc.accessLevel}
                                                                 </span>
                                                            </div>
                                                       </div>
                                                  </button>
                                             ))}
                                        </div>
                                   </div>
                              )}
                         </div>

                         {/* Sidebar */}
                         <div className="space-y-6">
                              {/* Admin Actions Card */}
                              <div className="bg-white rounded-2xl shadow-sm border-2 border-yellow-400 p-6">
                                   <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-yellow-600" />
                                        Admin Actions
                                   </h3>

                                   <div className="space-y-3">
                                        <Link
                                             href={`/offer/${offer.id}`}
                                             className="w-full px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                        >
                                             <Package className="w-5 h-5" />
                                             View Public Page
                                        </Link>

                                        {offer.company && <Link
                                             href={`/company/${offer.company?.handle}`}
                                             className="w-full px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                        >
                                             <Building2 className="w-5 h-5" />
                                             View Company
                                        </Link>}

                                        <button
                                             onClick={() => setShowDeleteConfirm(true)}
                                             className="w-full px-4 py-3 bg-red-100 hover:bg-red-200 text-red-900 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                        >
                                             <Trash2 className="w-5 h-5" />
                                             Delete Offer
                                        </button>
                                   </div>

                                   {/* Status Management */}
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
                                             {offer.status === "PUBLISHED" && (
                                                  <button
                                                       onClick={() => handleStatusChange("CLOSED")}
                                                       disabled={changingStatus}
                                                       className="w-full px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold rounded-lg transition-all text-sm disabled:opacity-50"
                                                  >
                                                       Close
                                                  </button>
                                             )}
                                             {offer.status !== "CANCELLED" && (
                                                  <button
                                                       onClick={() => handleStatusChange("CANCELLED")}
                                                       disabled={changingStatus}
                                                       className="w-full px-3 py-2 bg-red-100 hover:bg-red-200 text-red-900 font-bold rounded-lg transition-all text-sm disabled:opacity-50"
                                                  >
                                                       Cancel
                                                  </button>
                                             )}
                                        </div>
                                   </div>
                              </div>

                              {/* Statistics Card */}
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
                                             <span className="text-gray-600 font-medium">Documents</span>
                                             <span className="text-2xl font-black text-gray-900">{offer._count.documents}</span>
                                        </div>
                                   </div>
                              </div>

                              {/* Audit Trail */}
                              <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-6">
                                   <h3 className="text-lg font-black text-gray-900 mb-4">Audit Trail</h3>

                                   <div className="space-y-3 text-sm">
                                        <div>
                                             <p className="text-gray-600 font-medium">Created</p>
                                             <p className="text-gray-900 font-bold">{formatDate(offer.createdAt)}</p>
                                        </div>
                                        <div>
                                             <p className="text-gray-600 font-medium">Last Updated</p>
                                             <p className="text-gray-900 font-bold">{formatDate(offer.updatedAt)}</p>
                                        </div>
                                        {offer.deletedAt && (
                                             <div className="pt-3 border-t border-red-200">
                                                  <p className="text-red-600 font-medium">Deleted At</p>
                                                  <p className="text-red-900 font-bold">{formatDate(offer.deletedAt)}</p>
                                             </div>
                                        )}
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
