"use client";

import { TPublicOfferCard } from "@/types/offer/offer";
import Link from "next/link";
import { Building2, Calendar, DollarSign, MapPin, Users, ArrowRight, Heart } from "lucide-react";
import Image from "../ui/Image";
import { ConsnectBadge } from "../ui/badges/ConsnectBadge";
import { CompanyVerificationBadge } from "../ui/badges/CompanyVerificationBadge";
import { useState } from "react";
import { createOfferInterest } from "@/server/offer/offer-interest";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import queryClient from "@/lib/queryClient";
import { formatMoney } from "@/util/number-fns";

interface PublicOfferCardProps {
     offer: TPublicOfferCard;
}

export const PublicOfferCard = ({ offer }: PublicOfferCardProps) => {
     const { user } = useAuth();
     const [showingInterest, setShowingInterest] = useState(false);

     const hasLogo = offer.company?.logoUrl && offer.company.logoUrl.trim() !== "";
     const isVerified = offer.company?.verification?.status === "VERIFIED";
     const hasGoldBadge = offer.company?.verification?.isGoldVerified;
     const hasSilverBadge = offer.company?.verification?.isSilverVerified;
     const hasBronzeBadge = offer.company?.verification?.isBronzeVerified;
     const showConsnectBadge = hasGoldBadge || hasSilverBadge || hasBronzeBadge;
     const badgeLevel = hasGoldBadge ? "gold" : hasSilverBadge ? "silver" : "bronze";

     const handleShowInterest = async (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          
          if (!user || !user.company) {
               toast.error("Please login and add company information to show interest");
               return;
          }

          setShowingInterest(true);
          try {
               const result = await createOfferInterest({
                    status: "PENDING",
                    message: `${user.company.name} is interested in this offer`,
                    company: { connect: { id: user.company.id } },
                    offer: { connect: { id: offer.id } }
               });

               if (result) {
                    toast.success("Interest submitted successfully!");
                    queryClient.invalidateQueries({ queryKey: ["offers"] });
               } else {
                    toast.error("Failed to submit interest. You may have already shown interest.");
               }
          } catch (error) {
               toast.error("An error occurred while submitting interest");
          } finally {
               setShowingInterest(false);
          }
     };

     const formatBudget = () => {
          if (!offer.pricing) return null;
          const { budgetMin, budgetMax, currency } = offer.pricing;
          const minimumBudget = budgetMin ? formatMoney(budgetMin) : null;
          const maximumBudget = budgetMax ? formatMoney(budgetMax) : null;
          const curr = currency || "USD";
          
          if (budgetMin && budgetMax) {
               return `${curr} ${minimumBudget} - ${maximumBudget}`;
          } else if (budgetMin) {
               return `From ${curr} ${minimumBudget}`;
          } else if (budgetMax) {
               return `Up to ${curr} ${maximumBudget}`;
          }
          return null;
     };

     const formatDeadline = () => {
          if (!offer.timeline?.deadline) return null;
          const deadline = new Date(offer.timeline.deadline);
          const now = new Date();
          const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysLeft < 0) return "Expired";
          if (daysLeft === 0) return "Today";
          if (daysLeft === 1) return "1 day left";
          return `${daysLeft} days left`;
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

     const budget = formatBudget();
     const deadline = formatDeadline();

     return (
          <div className="group relative bg-white border-2 border-gray-200 hover:border-yellow-400 transition-all duration-300 hover:shadow-xl rounded-xl overflow-hidden">
               {/* Consnect Badge - Top Right */}
               {showConsnectBadge && (
                    <div className="absolute top-3 right-3 z-10">
                         <ConsnectBadge level={badgeLevel} size="md" showLabel={false} />
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
                              {isVerified && (
                                   <div className="absolute -bottom-1 -right-1">
                                        <CompanyVerificationBadge size="sm" showLabel={false} />
                                   </div>
                              )}
                         </div>

                         <div className="flex-1 min-w-0">
                              <Link 
                                   href={`/company/${offer.company?.handle}`}
                                   className="text-sm font-bold text-gray-900 hover:text-yellow-600 transition-colors line-clamp-1"
                                   onClick={(e) => e.stopPropagation()}
                              >
                                   {offer.company?.name}
                              </Link>
                              <p className="text-xs text-gray-500">{offer.category.name}</p>
                         </div>

                         {/* Priority Badge */}
                         <div className={`px-2 py-1 rounded-md border text-xs font-bold ${getPriorityColor()}`}>
                              {offer.priority}
                         </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-2 leading-tight">
                         {offer.title}
                    </h3>

                    {/* Type Badge */}
                    <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full mb-3">
                         {getTypeLabel()}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4">
                         {offer.description}
                    </p>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                         {/* Budget */}
                         {budget && (
                              <div className="flex items-center gap-2 text-sm">
                                   <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
                                        <DollarSign className="w-4 h-4 text-yellow-600" />
                                   </div>
                                   <div className="min-w-0">
                                        <p className="text-xs text-gray-500 font-medium">Budget</p>
                                        <p className="text-xs font-bold text-gray-900 truncate">{budget}</p>
                                   </div>
                              </div>
                         )}

                         {/* Deadline */}
                         {deadline && (
                              <div className="flex items-center gap-2 text-sm">
                                   <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                                        <Calendar className="w-4 h-4 text-blue-600" />
                                   </div>
                                   <div className="min-w-0">
                                        <p className="text-xs text-gray-500 font-medium">Deadline</p>
                                        <p className="text-xs font-bold text-gray-900 truncate">{deadline}</p>
                                   </div>
                              </div>
                         )}

                         {/* Location */}
                         {offer.siteLocation && (
                              <div className="flex items-center gap-2 text-sm col-span-2">
                                   <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                                        <MapPin className="w-4 h-4 text-green-600" />
                                   </div>
                                   <div className="min-w-0">
                                        <p className="text-xs text-gray-500 font-medium">Location</p>
                                        <p className="text-xs font-bold text-gray-900 truncate">
                                             {offer.siteLocation.city}, {offer.siteLocation.country}
                                        </p>
                                   </div>
                              </div>
                         )}
                    </div>

                    {/* Footer - Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                         {/* Interest Count */}
                         <div className="flex flex-nowrap items-center gap-1.5 text-xs text-gray-500">
                              <Users className="w-3.5 h-3.5" />
                              <span className="font-medium line-clamp-1 hover:line-clamp-none">{offer._count.interests} interested</span>
                         </div>

                         <div className="flex-1"></div>

                         {/* Interest Button */}
                         <button
                              onClick={handleShowInterest}
                              disabled={showingInterest}
                              className="px-4 py-2 bg-gray-100 hover:bg-yellow-400 text-gray-900 font-bold rounded-lg transition-all text-xs flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                              <Heart className="w-3.5 h-3.5" />
                              {showingInterest ? "Submitting..." : "Interested"}
                         </button>

                         {/* View Details Button */}
                         <Link
                              href={`/offer/${offer.id}`}
                              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-nowrap rounded-lg transition-all text-xs flex items-center gap-2"
                              onClick={(e) => e.stopPropagation()}
                         >
                              View Details
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                         </Link>
                    </div>
               </div>
          </div>
     );
};
