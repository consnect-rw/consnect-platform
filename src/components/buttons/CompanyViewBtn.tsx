"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Building2, MapPin, Mail, Phone, Globe, Users, Calendar, Briefcase, Award, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { fetchCompanyById } from "@/server/company/company";
import { SCompanyDrawerView, TCompanyDrawerView } from "@/types/offer/offer-interest";

interface CompanyViewBtnProps {
     companyId: string;
     companyName?: string;
     variant?: "default" | "ghost" | "outline";
     size?: "sm" | "md";
}

export const CompanyViewBtn = ({ companyId, companyName, variant = "outline", size = "sm" }: CompanyViewBtnProps) => {
     const [open, setOpen] = useState(false);
     const [company, setCompany] = useState<TCompanyDrawerView | null>(null);
     const [loading, setLoading] = useState(false);

     const handleOpen = async () => {
          setOpen(true);
          if (!company) {
               setLoading(true);
               try {
                    const data = await fetchCompanyById(companyId, SCompanyDrawerView);
                    setCompany(data);
               } catch {
                    // silently fail - drawer shows empty state
               } finally {
                    setLoading(false);
               }
          }
     };

     const buttonClass = (() => {
          const base = "inline-flex items-center gap-1.5 font-bold rounded-lg transition-all";
          const sz = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
          if (variant === "default") return `${base} ${sz} bg-yellow-400 hover:bg-yellow-500 text-gray-900`;
          if (variant === "ghost") return `${base} ${sz} hover:bg-gray-100 text-gray-700`;
          return `${base} ${sz} border border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 text-gray-700`;
     })();

     const getVerificationBadge = (v: TCompanyDrawerView["verification"]) => {
          if (!v) return null;
          if (v.isGoldVerified) return <Badge className="bg-yellow-400 text-gray-900 hover:bg-yellow-400 font-bold text-xs">GOLD</Badge>;
          if (v.isSilverVerified) return <Badge className="bg-gray-300 text-gray-900 hover:bg-gray-300 font-bold text-xs">SILVER</Badge>;
          if (v.isBronzeVerified) return <Badge className="bg-orange-200 text-orange-900 hover:bg-orange-200 font-bold text-xs">BRONZE</Badge>;
          return null;
     };

     return (
          <>
               <button onClick={handleOpen} className={buttonClass} title={`View ${companyName || "company"} profile`}>
                    <Eye className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
                    View Profile
               </button>

               <Sheet open={open} onOpenChange={setOpen}>
                    <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-0 border-l-2 border-yellow-400">
                         {/* Header */}
                         <SheetHeader className="p-6 pb-0 sticky top-0 bg-white z-10 border-b border-gray-100">
                              <SheetTitle className="text-xl font-black text-gray-900">Company Profile</SheetTitle>
                         </SheetHeader>

                         {loading ? (
                              <div className="flex flex-col items-center justify-center h-64 gap-4">
                                   <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                                   <p className="text-gray-500 font-medium text-sm">Loading profile...</p>
                              </div>
                         ) : !company ? (
                              <div className="flex flex-col items-center justify-center h-64 gap-3 px-6">
                                   <Building2 className="w-12 h-12 text-gray-300" />
                                   <p className="text-gray-500 font-medium text-center">Could not load company information.</p>
                              </div>
                         ) : (
                              <div className="p-6 space-y-6">
                                   {/* Company Identity */}
                                   <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200 shrink-0 bg-gray-50 flex items-center justify-center">
                                             {company.logoUrl ? (
                                                  <Image src={company.logoUrl} alt={company.name} width={64} height={64} className="object-cover w-full h-full" />
                                             ) : (
                                                  <Building2 className="w-8 h-8 text-gray-400" />
                                             )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                             <Link href={`/company/${company.handle}`} target="_blank" className="text-lg font-black text-gray-900 hover:text-yellow-600 transition-colors leading-tight block">
                                                  {company.name}
                                             </Link>
                                             {company.slogan && <p className="text-sm text-gray-500 mt-0.5 italic">{company.slogan}</p>}
                                             
                                             {/* Verification badges */}
                                             <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                  {company.verification?.status === "VERIFIED" ? (
                                                       <div className="flex items-center gap-1">
                                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                            <span className="text-xs font-bold text-green-700">Verified</span>
                                                       </div>
                                                  ) : (
                                                       <div className="flex items-center gap-1">
                                                            <XCircle className="w-4 h-4 text-gray-400" />
                                                            <span className="text-xs font-medium text-gray-500">Unverified</span>
                                                       </div>
                                                  )}
                                                  {getVerificationBadge(company.verification)}
                                             </div>
                                        </div>
                                   </div>

                                   {/* Overview */}
                                   {company.descriptions?.[0]?.description && (
                                        <>
                                             <Separator />
                                             <div>
                                                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-2">Overview</h4>
                                                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">{company.descriptions[0].description}</p>
                                             </div>
                                        </>
                                   )}

                                   {/* Key Stats */}
                                   <Separator />
                                   <div className="grid grid-cols-2 gap-3">
                                        {company.foundedYear && (
                                             <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                                                  <Calendar className="w-4 h-4 text-yellow-600 shrink-0" />
                                                  <div>
                                                       <p className="text-xs text-gray-500">Founded</p>
                                                       <p className="text-sm font-bold text-gray-900">{company.foundedYear}</p>
                                                  </div>
                                             </div>
                                        )}
                                        {company.companySize && (
                                             <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                                                  <Users className="w-4 h-4 text-yellow-600 shrink-0" />
                                                  <div>
                                                       <p className="text-xs text-gray-500">Team Size</p>
                                                       <p className="text-sm font-bold text-gray-900">{company.companySize}+</p>
                                                  </div>
                                             </div>
                                        )}
                                        {company.location && (
                                             <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl col-span-2">
                                                  <MapPin className="w-4 h-4 text-yellow-600 shrink-0" />
                                                  <div>
                                                       <p className="text-xs text-gray-500">Location</p>
                                                       <p className="text-sm font-bold text-gray-900">
                                                            {[company.location.city, company.location.state, company.location.country].filter(Boolean).join(", ")}
                                                       </p>
                                                  </div>
                                             </div>
                                        )}
                                   </div>

                                   {/* Specializations */}
                                   {company.specializations?.length > 0 && (
                                        <>
                                             <Separator />
                                             <div>
                                                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                                                       <Award className="w-4 h-4 text-yellow-600" />
                                                       Specializations
                                                  </h4>
                                                  <div className="flex flex-wrap gap-2">
                                                       {company.specializations.map((s, i) => (
                                                            <Badge key={i} variant="outline" className="text-xs font-medium border-gray-300 text-gray-700">
                                                                 {s.name}
                                                            </Badge>
                                                       ))}
                                                  </div>
                                             </div>
                                        </>
                                   )}

                                   {/* Services */}
                                   {company.services?.length > 0 && (
                                        <>
                                             <Separator />
                                             <div>
                                                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                                                       <Briefcase className="w-4 h-4 text-yellow-600" />
                                                       Services
                                                  </h4>
                                                  <div className="space-y-1.5">
                                                       {company.services.map((s, i) => (
                                                            <div key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                                                 <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-1.5 shrink-0" />
                                                                 <span className="font-medium">{s.name}</span>
                                                            </div>
                                                       ))}
                                                  </div>
                                             </div>
                                        </>
                                   )}

                                   {/* Contact */}
                                   <Separator />
                                   <div>
                                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-3">Contact</h4>
                                        <div className="space-y-2.5">
                                             {company.email && (
                                                  <a href={`mailto:${company.email}`} className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-yellow-600 transition-colors group">
                                                       <div className="w-7 h-7 bg-gray-100 group-hover:bg-yellow-100 rounded-lg flex items-center justify-center shrink-0 transition-colors">
                                                            <Mail className="w-3.5 h-3.5" />
                                                       </div>
                                                       <span className="truncate">{company.email}</span>
                                                  </a>
                                             )}
                                             {company.phone && (
                                                  <a href={`tel:${company.phone}`} className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-yellow-600 transition-colors group">
                                                       <div className="w-7 h-7 bg-gray-100 group-hover:bg-yellow-100 rounded-lg flex items-center justify-center shrink-0 transition-colors">
                                                            <Phone className="w-3.5 h-3.5" />
                                                       </div>
                                                       <span>{company.phone}</span>
                                                  </a>
                                             )}
                                             {company.website && (
                                                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-yellow-600 transition-colors group">
                                                       <div className="w-7 h-7 bg-gray-100 group-hover:bg-yellow-100 rounded-lg flex items-center justify-center shrink-0 transition-colors">
                                                            <Globe className="w-3.5 h-3.5" />
                                                       </div>
                                                       <span>Visit Website</span>
                                                  </a>
                                             )}
                                             {company.contactPersons?.map((p, i) => (
                                                  <div key={i} className="p-3 bg-gray-50 rounded-xl text-sm">
                                                       <p className="font-bold text-gray-900">{p.name}</p>
                                                       <p className="text-gray-500 text-xs">{p.role}</p>
                                                       {p.contactEmail && (
                                                            <a href={`mailto:${p.contactEmail}`} className="text-yellow-600 hover:underline text-xs mt-0.5 block">{p.contactEmail}</a>
                                                       )}
                                                  </div>
                                             ))}
                                        </div>
                                   </div>

                                   {/* Full Profile Link */}
                                   <Link
                                        href={`/company/${company.handle}`}
                                        target="_blank"
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black rounded-xl transition-all text-sm"
                                   >
                                        <Building2 className="w-4 h-4" />
                                        View Full Profile
                                   </Link>
                              </div>
                         )}
                    </SheetContent>
               </Sheet>
          </>
     );
};
