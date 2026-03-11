"use client";

import { TPublicOfferDetail } from "@/types/offer/offer";
import Image from "@/components/ui/Image";
import Link from "next/link";
import { 
     Building2, Calendar, DollarSign, MapPin, Users, ArrowLeft, Heart,
     FileText, CheckCircle, Clock, AlertCircle, Briefcase, Phone, Mail, Globe,
     Banknote, Smartphone, Wallet, CreditCard
} from "lucide-react";
import { CompanyVerificationBadge } from "@/components/ui/badges/CompanyVerificationBadge";
import { ConsnectBadge } from "@/components/ui/badges/ConsnectBadge";
import { useState } from "react";
import { createOfferInterest } from "@/server/offer/offer-interest";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("@/components/ui/PdfViewer").then(mod => ({ default: mod.PdfViewer })), { ssr: false });

interface PublicOfferDetailViewProps {
     offer: TPublicOfferDetail;
}

export const PublicOfferDetailView = ({ offer }: PublicOfferDetailViewProps) => {
     const { user } = useAuth();
     const [showingInterest, setShowingInterest] = useState(false);
     const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

     const hasLogo = offer.company?.logoUrl && offer.company.logoUrl.trim() !== "";
     const isVerified = offer.company?.verification?.status === "VERIFIED";
     const hasGoldBadge = offer.company?.verification?.isGoldVerified;
     const hasSilverBadge = offer.company?.verification?.isSilverVerified;
     const hasBronzeBadge = offer.company?.verification?.isBronzeVerified;
     const showConsnectBadge = hasGoldBadge || hasSilverBadge || hasBronzeBadge;
     const badgeLevel = hasGoldBadge ? "gold" : hasSilverBadge ? "silver" : "bronze";

     const handleShowInterest = async () => {
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
               } else {
                    toast.error("Failed to submit interest. You may have already shown interest.");
               }
          } catch (error) {
               toast.error("An error occurred while submitting interest");
          } finally {
               setShowingInterest(false);
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

     const getPriorityColor = () => {
          switch (offer.priority) {
               case "URGENT": return "text-red-600 bg-red-50 border-red-200";
               case "HIGH": return "text-orange-600 bg-orange-50 border-orange-200";
               case "MEDIUM": return "text-yellow-600 bg-yellow-50 border-yellow-200";
               case "LOW": return "text-blue-600 bg-blue-50 border-blue-200";
               default: return "text-gray-600 bg-gray-50 border-gray-200";
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

     const formatDeadline = () => {
          if (!offer.timeline?.deadline) return null;
          const deadline = new Date(offer.timeline.deadline);
          const now = new Date();
          const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysLeft < 0) return { text: "Expired", color: "text-red-600 bg-red-50", hasExpired:true };
          if (daysLeft === 0) return { text: "Expires Today", color: "text-orange-600 bg-orange-50", hasExpired:false };
          if (daysLeft === 1) return { text: "1 day left", color: "text-yellow-600 bg-yellow-50", hasExpired:false };
          if (daysLeft <= 7) return { text: `${daysLeft} days left`, color: "text-yellow-600 bg-yellow-50", hasExpired:false };
          return { text: `${daysLeft} days left`, color: "text-green-600 bg-green-50", hasExpired:false };
     };

     const budget = formatBudget();
     const deadline = formatDeadline();

     // Determine poster type
     const postedByCompany = !!offer.company;
     const postedByUser = !postedByCompany && !!offer.user;

     // User initials avatar
     const getUserInitials = (name: string) => {
          return name
               .split(" ")
               .filter(Boolean)
               .slice(0, 2)
               .map((n) => n[0].toUpperCase())
               .join("");
     };

     // Payment method display config
     const getPaymentMethodConfig = (method: string) => {
          switch (method) {
               case "BANK_TRANSFER":
                    return { label: "Bank Transfer", icon: Banknote, bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" };
               case "MOMO":
                    return { label: "Mobile Money", icon: Smartphone, bg: "bg-green-50", text: "text-green-700", border: "border-green-200" };
               case "CASH":
                    return { label: "Cash", icon: Wallet, bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" };
               case "CHECK":
                    return { label: "Cheque", icon: CreditCard, bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" };
               default:
                    return { label: method.replace(/_/g, " "), icon: CreditCard, bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" };
          }
     };

     return (
          <div className="min-h-screen bg-gray-50 py-8">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <Link
                         href="/offer"
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
                                   {/* Badges Row */}
                                   <div className="flex items-center gap-2 mb-4 flex-wrap">
                                        <div className={`px-3 py-1 rounded-md border text-sm font-bold ${getPriorityColor()}`}>
                                             {offer.priority} Priority
                                        </div>
                                        <div className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-bold rounded-md">
                                             {getTypeLabel()}
                                        </div>
                                        {deadline && (
                                             <div className={`px-3 py-1 rounded-md text-sm font-bold ${deadline.color}`}>
                                                  <Clock className="w-4 h-4 inline mr-1" />
                                                  {deadline.text}
                                             </div>
                                        )}
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

                                        {offer._count.interests > 0 && (
                                             <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                                                  <div className="w-10 h-10 bg-purple-400 rounded-lg flex items-center justify-center shrink-0">
                                                       <Users className="w-5 h-5 text-white" />
                                                  </div>
                                                  <div>
                                                       <p className="text-sm text-gray-600 font-medium">Interest</p>
                                                       <p className="text-lg font-black text-gray-900">{offer._count.interests} companies</p>
                                                  </div>
                                             </div>
                                        )}
                                   </div>
                              </div>

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
                                             Documents
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
                                                       </div>
                                                       <span className="text-xs font-medium text-gray-500">{doc.accessLevel}</span>
                                                  </button>
                                             ))}
                                        </div>
                                   </div>
                              )}
                         </div>

                         {/* Sidebar */}
                         <div className="space-y-6">
                              {/* Action Card */}
                              <div className="bg-white rounded-2xl shadow-sm border-2 border-yellow-400 p-6">
                                   <button
                                        onClick={handleShowInterest}
                                        disabled={deadline?.hasExpired ? true : showingInterest}
                                        className="w-full px-6 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black rounded-xl transition-all text-lg flex items-center justify-center gap-2 mb-4 disabled:opacity-50"
                                   >
                                        <Heart className="w-5 h-5" />
                                        {showingInterest ? "Submitting..." : "Show Interest"}
                                   </button>

                                   <p className="text-sm text-gray-600 text-center">
                                        Submit your interest to connect with the company
                                   </p>
                              </div>

                              {/* Posted By */}
                              <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-6">
                                   <h3 className="text-lg font-black text-gray-900 mb-4">Posted By</h3>

                                   {postedByCompany && (
                                        <>
                                             <div className="flex items-start gap-3 mb-4">
                                                  <div className="relative shrink-0">
                                                       <div className="w-16 h-16 bg-gray-100 border-2 border-gray-200 rounded-xl overflow-hidden">
                                                            {hasLogo ? (
                                                                 <Image
                                                                      src={offer.company!.logoUrl!}
                                                                      alt={`${offer.company?.name} logo`}
                                                                      className="object-cover w-full h-full"
                                                                 />
                                                            ) : (
                                                                 <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                                      <Building2 className="w-8 h-8 text-gray-400" />
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
                                                            className="text-lg font-black text-gray-900 hover:text-amber-600 transition-colors line-clamp-1 block"
                                                       >
                                                            {offer.company?.name}
                                                       </Link>
                                                       <p className="text-sm text-gray-500">@{offer.company?.handle}</p>
                                                       {showConsnectBadge && (
                                                            <div className="mt-2">
                                                                 <ConsnectBadge level={badgeLevel} size="sm" showLabel={true} />
                                                            </div>
                                                       )}
                                                  </div>
                                             </div>

                                             {/* Contact Info */}
                                             {offer.submissionInfo && (
                                                  <div className="space-y-2.5 pt-4 border-t border-gray-100">
                                                       {offer.submissionInfo.contactEmail && (
                                                            <div className="flex items-center gap-2.5 text-sm">
                                                                 <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                                                                      <Mail className="w-3.5 h-3.5 text-amber-600" />
                                                                 </div>
                                                                 <a href={`mailto:${offer.submissionInfo.contactEmail}`} className="text-gray-700 hover:text-amber-600 font-medium truncate transition-colors">
                                                                      {offer.submissionInfo.contactEmail}
                                                                 </a>
                                                            </div>
                                                       )}
                                                       {offer.submissionInfo.contactPhone && (
                                                            <div className="flex items-center gap-2.5 text-sm">
                                                                 <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                                                                      <Phone className="w-3.5 h-3.5 text-amber-600" />
                                                                 </div>
                                                                 <a href={`tel:${offer.submissionInfo.contactPhone}`} className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
                                                                      {offer.submissionInfo.contactPhone}
                                                                 </a>
                                                            </div>
                                                       )}
                                                       {offer.company?.website && (
                                                            <div className="flex items-center gap-2.5 text-sm">
                                                                 <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                                                                      <Globe className="w-3.5 h-3.5 text-amber-600" />
                                                                 </div>
                                                                 <a href={offer.company.website} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-amber-600 font-medium truncate transition-colors">
                                                                      {offer.company.website.replace(/^https?:\/\/(www\.)?/, "")}
                                                                 </a>
                                                            </div>
                                                       )}
                                                  </div>
                                             )}

                                             <Link
                                                  href={`/company/${offer.company?.handle}`}
                                                  className="mt-4 w-full px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all text-center block text-sm"
                                             >
                                                  View Company Profile
                                             </Link>
                                        </>
                                   )}

                                   {postedByUser && offer.user && (
                                        <>
                                             <div className="flex items-center gap-3 mb-4">
                                                  {/* Initials Avatar */}
                                                  <div className="relative shrink-0">
                                                       <div className="w-16 h-16 rounded-xl bg-amber-400 flex items-center justify-center shadow-md shadow-amber-100">
                                                            <span className="text-gray-900 font-black text-xl leading-none select-none">
                                                                 {getUserInitials(offer.user.name ?? "U")}
                                                            </span>
                                                       </div>
                                                       {/* Individual badge */}
                                                       <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center border-2 border-white">
                                                            <svg className="w-2.5 h-2.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                                                 <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                            </svg>
                                                       </div>
                                                  </div>

                                                  <div className="flex-1 min-w-0">
                                                       <p className="text-lg font-black text-gray-900 leading-tight line-clamp-1">
                                                            {offer.user.name}
                                                       </p>
                                                       <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                                                            Individual
                                                       </span>
                                                  </div>
                                             </div>

                                             {/* User contact from submission info */}
                                             {offer.submissionInfo && (
                                                  <div className="space-y-2.5 pt-4 border-t border-gray-100">
                                                       {offer.submissionInfo.contactEmail && (
                                                            <div className="flex items-center gap-2.5 text-sm">
                                                                 <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                                                                      <Mail className="w-3.5 h-3.5 text-amber-600" />
                                                                 </div>
                                                                 <a href={`mailto:${offer.submissionInfo.contactEmail}`} className="text-gray-700 hover:text-amber-600 font-medium truncate transition-colors">
                                                                      {offer.submissionInfo.contactEmail}
                                                                 </a>
                                                            </div>
                                                       )}
                                                       {offer.submissionInfo.contactPhone && (
                                                            <div className="flex items-center gap-2.5 text-sm">
                                                                 <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                                                                      <Phone className="w-3.5 h-3.5 text-amber-600" />
                                                                 </div>
                                                                 <a href={`tel:${offer.submissionInfo.contactPhone}`} className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
                                                                      {offer.submissionInfo.contactPhone}
                                                                 </a>
                                                            </div>
                                                       )}
                                                  </div>
                                             )}
                                        </>
                                   )}
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
                                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                                             <DollarSign className="w-5 h-5 text-amber-500" />
                                             Payment Details
                                        </h3>

                                        {offer.pricing.paymentTerms && (
                                             <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                                                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Payment Terms</p>
                                                  <p className="text-gray-800 text-sm leading-relaxed font-medium">{offer.pricing.paymentTerms}</p>
                                             </div>
                                        )}

                                        {offer.pricing.paymentMethods.length > 0 && (
                                             <div>
                                                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-3">Accepted Methods</p>
                                                  <div className="space-y-2">
                                                       {offer.pricing.paymentMethods.map((method, idx) => {
                                                            const config = getPaymentMethodConfig(method);
                                                            const Icon = config.icon;
                                                            return (
                                                                 <div
                                                                      key={idx}
                                                                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${config.bg} ${config.border}`}
                                                                 >
                                                                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${config.text} bg-white/70`}>
                                                                           <Icon className="w-4 h-4" />
                                                                      </div>
                                                                      <span className={`text-sm font-bold ${config.text}`}>{config.label}</span>
                                                                 </div>
                                                            );
                                                       })}
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
