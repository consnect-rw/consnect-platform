"use client";

import { TCompanyOfferCard } from "@/types/offer/offer";
import Link from "next/link";
import { Calendar, DollarSign, Users, Eye, Edit, Trash2, AlertCircle, Heart } from "lucide-react";
import { useState } from "react";
import { deleteOffer } from "@/server/offer/offer";
import { toast } from "sonner";
import queryClient from "@/lib/queryClient";

interface CompanyOfferCardProps {
     offer: TCompanyOfferCard;
}

export const CompanyOfferCard = ({ offer }: CompanyOfferCardProps) => {
     const [deleting, setDeleting] = useState(false);
     const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

     const handleDelete = async () => {
          setDeleting(true);
          try {
               const result = await deleteOffer(offer.id);
               if (result) {
                    toast.success("Offer deleted successfully");
                    queryClient.invalidateQueries({ queryKey: ["user-offers"] });
                    queryClient.invalidateQueries({ queryKey: ["company-offers"] });
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
               case "URGENT": return "text-red-600";
               case "HIGH": return "text-orange-600";
               case "MEDIUM": return "text-yellow-600";
               case "LOW": return "text-blue-600";
               default: return "text-gray-600";
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
          }
          return null;
     };

     const formatDate = (date: Date | null | undefined) => {
          if (!date) return null;
          return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
     };

     const budget = formatBudget();
     const deadline = formatDate(offer.timeline?.deadline);

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
                                   This action cannot be undone. All interests and invitations will be removed.
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
                    {/* Header - Status Badges */}
                    <div className="flex items-start gap-2 mb-4 flex-wrap">
                         <div className={`px-3 py-1 rounded-md border text-xs font-bold ${getStatusColor()}`}>
                              {offer.status}
                         </div>
                         {offer.executionStatus !== "NONE" && (
                              <div className={`px-3 py-1 rounded-md text-xs font-bold ${getExecutionStatusColor()}`}>
                                   {offer.executionStatus.replace("_", " ")}
                              </div>
                         )}
                         <div className={`px-3 py-1 text-xs font-bold ${getPriorityColor()}`}>
                              {offer.priority} Priority
                         </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-2 leading-tight">
                         {offer.title}
                    </h3>

                    {/* Category & Type */}
                    <div className="flex items-center gap-2 mb-3">
                         <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded">
                              {offer.category.name}
                         </span>
                         <span className="text-xs text-gray-500">•</span>
                         <span className="text-xs text-gray-600 font-medium">
                              {getTypeLabel()}
                         </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4">
                         {offer.description}
                    </p>

                    {/* Info Row */}
                    <div className="flex items-center gap-4 mb-4 text-sm flex-wrap">
                         {/* Budget */}
                         {budget && (
                              <div className="flex items-center gap-1.5">
                                   <DollarSign className="w-4 h-4 text-yellow-600" />
                                   <span className="text-xs font-bold text-gray-900">{budget}</span>
                              </div>
                         )}

                         {/* Deadline */}
                         {deadline && (
                              <div className="flex items-center gap-1.5">
                                   <Calendar className="w-4 h-4 text-blue-600" />
                                   <span className="text-xs font-medium text-gray-600">{deadline}</span>
                              </div>
                         )}

                         {/* Stats */}
                         <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4 text-green-600" />
                              <span className="text-xs font-medium text-gray-600">
                                   {offer._count.interests} interests, {offer._count.invitations} invitations
                              </span>
                         </div>
                    </div>

                    {/* Footer - Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                         {/* Updated Date */}
                         <span className="text-xs text-gray-500 flex-1">
                              Updated {formatDate(offer.updatedAt)}
                         </span>

                         {/* Action Buttons */}
                         <Link
                              href={`/dashboard/offers/received?offerId=${offer.id}`}
                              className="p-2 bg-pink-100 flex items-center gap-1 hover:bg-pink-200 text-gray-900 rounded-lg transition-all"
                              title="Edit offer"
                         >
                              <Heart className="w-4 h-4" />
                              <span className="text-xs font-medium text-gray-600">{offer._count.interests} Interests</span>
                         </Link>
                         <Link
                              href={`/dashboard/offers/form?offerId=${offer.id}`}
                              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-all"
                              title="Edit offer"
                         >
                              <Edit className="w-4 h-4" />
                         </Link>

                         <Link
                              href={`/dashboard/offers/${offer.id}`}
                              className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-lg transition-all"
                              title="View details"
                         >
                              <Eye className="w-4 h-4" />
                         </Link>

                         <button
                              onClick={() => setShowDeleteConfirm(true)}
                              className="p-2 bg-red-100 hover:bg-red-200 text-red-900 rounded-lg transition-all"
                              title="Delete offer"
                         >
                              <Trash2 className="w-4 h-4" />
                         </button>
                    </div>
               </div>
          </div>
     );
};
