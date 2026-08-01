import { getSessionUser } from "@/server/auth/user";
import { fetchOffers } from "@/server/offer/offer";
import { Prisma } from "@prisma/client";
import { ArrowRight, Inbox, MapPin, Clock, Tag } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { notFound } from "next/navigation";

const SReceivedPageOffer = {
     id: true,
     title: true,
     status: true,
     type: true,
     contractType: true,
     createdAt: true,
     category: { select: { name: true } },
     siteLocation: { select: { city: true, country: true } },
     timeline: { select: { deadline: true } },
     _count: { select: { interests: true } },
} satisfies Prisma.OfferSelect;

const STATUS_STYLES: Record<string, string> = {
     PUBLISHED: "bg-emerald-50 text-emerald-700 border-emerald-200",
     DRAFT:     "bg-gray-100 text-gray-600 border-gray-200",
     CLOSED:    "bg-red-50 text-red-600 border-red-200",
     PAUSED:    "bg-amber-50 text-amber-700 border-amber-200",
};

export default async function ReceivedInterestsPage() {
     const { user } = await getSessionUser();
     if (!user) notFound();

     const where: Prisma.OfferWhereInput = user.company
          ? { companyId: user.company.id }
          : { userId: user.id };

     const { data: offers } = await fetchOffers(SReceivedPageOffer, where, 1000, 0, { createdAt: "desc" });

     const totalInterests = offers.reduce((s, o) => s + o._count.interests, 0);

     return (
          <div className="w-full bg-gray-50 p-4 sm:p-6 lg:p-8">
               {/* Header */}
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                         <div className="w-11 h-11 rounded-xl bg-amber-400 flex items-center justify-center shrink-0 shadow-sm shadow-amber-200">
                              <Inbox className="w-5 h-5 text-gray-900" />
                         </div>
                         <div>
                              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Received Interests</h1>
                              <p className="text-xs text-gray-500 font-medium">Select a work package to review who applied</p>
                         </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                         <div className="text-center bg-white rounded-xl border border-gray-200 px-4 py-2 shadow-sm">
                              <p className="text-xl font-black text-gray-900 leading-none">{offers.length}</p>
                              <p className="text-[10px] font-semibold text-gray-500 mt-0.5 uppercase tracking-wide">Packages</p>
                         </div>
                         <div className="text-center rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 shadow-sm">
                              <p className="text-xl font-black text-amber-700 leading-none">{totalInterests}</p>
                              <p className="text-[10px] font-semibold text-amber-600 mt-0.5 uppercase tracking-wide">Interests</p>
                         </div>
                    </div>
               </div>

               {offers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-gray-200 py-20 px-6 text-center">
                         <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                              <Inbox className="w-8 h-8 text-gray-300" />
                         </div>
                         <h3 className="text-lg font-black text-gray-900 mb-1">No work packages yet</h3>
                         <p className="text-sm text-gray-500 max-w-sm">Publish a work package to start receiving interests from companies on the platform.</p>
                         <Link href="/dashboard/offers" className="mt-6 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-sm rounded-xl transition-colors">
                              Go to Work Packages
                         </Link>
                    </div>
               ) : (
                    <div className="flex flex-col gap-3">
                         {offers.map((offer) => {
                              const statusStyle = STATUS_STYLES[offer.status] ?? STATUS_STYLES.DRAFT;
                              const deadline = offer.timeline?.deadline;
                              const now = Date.now();
                              const deadlineMs = deadline ? new Date(deadline).getTime() : null;
                              const isDeadlinePassed = deadlineMs !== null && deadlineMs < now;
                              const isDeadlineSoon = deadlineMs !== null && !isDeadlinePassed && deadlineMs < now + 7 * 24 * 60 * 60 * 1000;
                              const hasInterests = offer._count.interests > 0;

                              return (
                                   <Link
                                        key={offer.id}
                                        href={`/dashboard/offers/received/${offer.id}`}
                                        className="group flex items-center gap-4 bg-white border border-gray-200 hover:border-amber-300 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:shadow-amber-100/50 transition-all duration-200"
                                   >
                                        {/* Interest count bubble */}
                                        <div className={`w-14 h-14 shrink-0 rounded-xl flex flex-col items-center justify-center font-black border-2 transition-colors ${hasInterests ? "bg-amber-400 border-amber-400 text-gray-900 group-hover:bg-amber-500" : "bg-gray-100 border-gray-200 text-gray-400"}`}>
                                             <span className="text-xl leading-none">{offer._count.interests}</span>
                                             <span className="text-[9px] font-bold uppercase tracking-wide mt-0.5 opacity-70">
                                                  {offer._count.interests === 1 ? "reply" : "replies"}
                                             </span>
                                        </div>

                                        {/* Main content */}
                                        <div className="flex-1 min-w-0">
                                             <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusStyle}`}>
                                                       {offer.status}
                                                  </span>
                                                  {offer.category && (
                                                       <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
                                                            <Tag className="w-3 h-3" />{offer.category.name}
                                                       </span>
                                                  )}
                                                  {offer.contractType && (
                                                       <span className="text-[11px] font-semibold text-gray-500">{offer.contractType.replace(/_/g, " ")}</span>
                                                  )}
                                             </div>
                                             <h3 className="text-base font-black text-gray-900 truncate group-hover:text-amber-700 transition-colors">{offer.title}</h3>
                                             <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                                  {offer.siteLocation && (
                                                       <span className="flex items-center gap-1 text-xs text-gray-500">
                                                            <MapPin className="w-3 h-3" />
                                                            {[offer.siteLocation.city, offer.siteLocation.country].filter(Boolean).join(", ")}
                                                       </span>
                                                  )}
                                                  {deadline ? (
                                                       <span className={`flex items-center gap-1 text-xs font-medium ${isDeadlinePassed ? "text-gray-400" : isDeadlineSoon ? "text-amber-600" : "text-gray-500"}`}>
                                                            <Clock className="w-3 h-3" />
                                                            {isDeadlinePassed ? "Closed" : "Deadline"} {format(new Date(deadline), "MMM d, yyyy")}
                                                            {isDeadlinePassed && <span className="text-[10px] font-black uppercase bg-gray-200 text-gray-500 px-1.5 rounded-full ml-1">Passed</span>}
                                                            {isDeadlineSoon && <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-700 px-1.5 rounded-full ml-1">Soon</span>}
                                                       </span>
                                                  ) : (
                                                       <span className="flex items-center gap-1 text-xs text-gray-400">
                                                            <Clock className="w-3 h-3" />Posted {formatDistanceToNow(new Date(offer.createdAt), { addSuffix: true })}
                                                       </span>
                                                  )}
                                             </div>
                                        </div>

                                        {/* Arrow */}
                                        <div className="shrink-0 w-9 h-9 rounded-xl bg-gray-100 group-hover:bg-amber-400 flex items-center justify-center transition-colors">
                                             <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-900 transition-colors" />
                                        </div>
                                   </Link>
                              );
                         })}
                    </div>
               )}
          </div>
     );
}
