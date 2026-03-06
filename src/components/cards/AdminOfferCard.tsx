"use client";

import { TAdminOfferCard } from "@/types/offer/offer";
import Link from "next/link";
import { Building2, Calendar, Eye, Trash2, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { deleteOffer, updateOffer } from "@/server/offer/offer";
import { toast } from "sonner";
import queryClient from "@/lib/queryClient";
import Image from "../ui/Image";

interface AdminOfferCardProps {
     offer: TAdminOfferCard;
}

export const AdminOfferCard = ({ offer }: AdminOfferCardProps) => {
     const [deleting, setDeleting] = useState(false);
     const [updating, setUpdating] = useState(false);
     const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

     const hasLogo = offer.company?.logoUrl && offer.company.logoUrl.trim() !== "";
     const isVerified = offer.company?.verification?.status === "VERIFIED";

     const handleDelete = async () => {
          setDeleting(true);
          try {
               const result = await deleteOffer(offer.id);
               if (result) {
                    toast.success("Offer deleted successfully");
                    queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
                    setShowDeleteConfirm(false);
               } else {
                    toast.error("Failed to delete offer");
               }
          } catch (error) {
               toast.error("An error occurred while deleting");
          } finally {
               setDeleting(false);
          }
     };

     const handleStatusChange = async (newStatus: "PUBLISHED" | "CLOSED" | "CANCELLED") => {
          setUpdating(true);
          try {
               const result = await updateOffer(offer.id, { status: newStatus });
               if (result) {
                    toast.success(`Offer status updated to ${newStatus}`);
                    queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
               } else {
                    toast.error("Failed to update status");
               }
          } catch (error) {
               toast.error("An error occurred while updating");
          } finally {
               setUpdating(false);
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

     const getPriorityColor = () => {
          switch (offer.priority) {
               case "URGENT": return "text-red-600 bg-red-50";
               case "HIGH": return "text-orange-600 bg-orange-50";
               case "MEDIUM": return "text-yellow-600 bg-yellow-50";
               case "LOW": return "text-blue-600 bg-blue-50";
               default: return "text-gray-600 bg-gray-50";
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

     const formatDate = (date: Date | null | undefined) => {
          if (!date) return "N/A";
          return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
     };

     return (
          <div className="relative bg-white border-2 border-gray-200 hover:border-yellow-400 transition-all duration-300 rounded-xl overflow-hidden">
               {/* Delete Confirmation Overlay */}
               {showDeleteConfirm && (
                    <div className="absolute inset-0 bg-white bg-opacity-95 z-20 flex items-center justify-center p-6">
                         <div className="text-center max-w-sm">
                              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                   <AlertCircle className="w-6 h-6 text-red-600" />
                              </div>
                              <h4 className="text-lg font-bold text-gray-900 mb-2">Delete Offer?</h4>
                              <p className="text-sm text-gray-600 mb-4">
                                   This will permanently delete this offer and all associated data.
                              </p>
                              <div className="flex items-center gap-2 justify-center">
                                   <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-lg transition-colors text-sm"
                                        disabled={deleting}
                                   >
                                        Cancel
                                   </button>
                                   <button
                                        onClick={handleDelete}
                                        disabled={deleting}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors text-sm disabled:opacity-50"
                                   >
                                        {deleting ? "Deleting..." : "Delete"}
                                   </button>
                              </div>
                         </div>
                    </div>
               )}

               <div className="p-6">
                    {/* Header - Company Info */}
                    <div className="flex items-start gap-3 mb-4">
                         <div className="relative shrink-0">
                              <div className="w-12 h-12 bg-linear-to-br from-gray-100 to-gray-200 border-2 border-gray-200 rounded-lg overflow-hidden">
                                   {hasLogo ? (
                                        <Image
                                             src={offer.company!.logoUrl!}
                                             alt={`${offer.company?.name} logo`}
                                             className="object-cover w-full h-full"
                                        />
                                   ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                             <Building2 className="w-6 h-6 text-gray-400" />
                                        </div>
                                   )}
                              </div>
                         </div>

                         <div className="flex-1 min-w-0">
                              <Link 
                                   href={`/admin/companies/${offer.company?.id}`}
                                   className="text-sm font-bold text-gray-900 hover:text-yellow-600 transition-colors line-clamp-1"
                              >
                                   {offer.company?.name}
                              </Link>
                              <p className="text-xs text-gray-500">
                                   @{offer.company?.handle} 
                                   {isVerified && <span className="text-green-600 ml-1">• Verified</span>}
                              </p>
                         </div>

                         {/* Status Badges */}
                         <div className="flex flex-col gap-1">
                              <div className={`px-2 py-1 rounded-md border text-xs font-bold text-center ${getStatusColor()}`}>
                                   {offer.status}
                              </div>
                              {offer.executionStatus !== "NONE" && (
                                   <div className="px-2 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-md text-center">
                                        {offer.executionStatus.replace("_", " ")}
                                   </div>
                              )}
                         </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-2 leading-tight">
                         {offer.title}
                    </h3>

                    {/* Category, Type & Priority */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                         <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded">
                              {offer.category.name}
                         </span>
                         <span className="px-2 py-1 text-gray-600 text-xs font-medium">
                              {getTypeLabel()}
                         </span>
                         <span className={`px-2 py-1 text-xs font-bold rounded ${getPriorityColor()}`}>
                              {offer.priority}
                         </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4">
                         {offer.description}
                    </p>

                    {/* Info Row */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                         <div>
                              <span className="text-gray-500 font-medium">Created:</span>
                              <span className="text-gray-900 font-bold ml-1">{formatDate(offer.createdAt)}</span>
                         </div>
                         <div>
                              <span className="text-gray-500 font-medium">Deadline:</span>
                              <span className="text-gray-900 font-bold ml-1">{formatDate(offer.timeline?.deadline)}</span>
                         </div>
                         <div>
                              <span className="text-gray-500 font-medium">Interests:</span>
                              <span className="text-gray-900 font-bold ml-1">{offer._count.interests}</span>
                         </div>
                         <div>
                              <span className="text-gray-500 font-medium">Documents:</span>
                              <span className="text-gray-900 font-bold ml-1">{offer._count.documents}</span>
                         </div>
                    </div>

                    {/* Footer - Action Buttons */}
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100 flex-wrap">
                         {/* Status Change Buttons */}
                         {offer.status !== "PUBLISHED" && (
                              <button
                                   onClick={() => handleStatusChange("PUBLISHED")}
                                   disabled={updating}
                                   className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-900 rounded-lg transition-all text-xs font-bold flex items-center gap-1 disabled:opacity-50"
                                   title="Publish offer"
                              >
                                   <CheckCircle className="w-3.5 h-3.5" />
                                   Publish
                              </button>
                         )}

                         {offer.status === "PUBLISHED" && (
                              <button
                                   onClick={() => handleStatusChange("CLOSED")}
                                   disabled={updating}
                                   className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-lg transition-all text-xs font-bold flex items-center gap-1 disabled:opacity-50"
                                   title="Close offer"
                              >
                                   <XCircle className="w-3.5 h-3.5" />
                                   Close
                              </button>
                         )}

                         <div className="flex-1"></div>

                         {/* View Details */}
                         <Link
                              href={`/admin/offers/${offer.id}`}
                              className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg transition-all text-xs font-bold flex items-center gap-1"
                         >
                              <Eye className="w-3.5 h-3.5" />
                              View
                         </Link>

                         {/* Delete */}
                         <button
                              onClick={() => setShowDeleteConfirm(true)}
                              className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-900 rounded-lg transition-all text-xs font-bold flex items-center gap-1"
                              title="Delete offer"
                         >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                         </button>
                    </div>
               </div>
          </div>
     );
};
