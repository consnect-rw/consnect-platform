export default function OfferInterestsLoading() {
     return (
          <div className="w-full bg-gray-50 p-4 sm:p-6 lg:p-8">
               {/* Back + header skeleton */}
               <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-gray-200 animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2">
                         <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                         <div className="h-5 w-64 bg-gray-200 rounded-lg animate-pulse" />
                    </div>
                    <div className="w-16 h-14 rounded-xl bg-amber-100 animate-pulse shrink-0" />
               </div>
               {/* Interest card skeletons */}
               <div className="flex flex-col gap-3">
                    {[...Array(4)].map((_, i) => (
                         <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse">
                              <div className="flex items-center gap-3 mb-3">
                                   <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                                   <div className="flex-1 space-y-1.5">
                                        <div className="h-4 w-36 bg-gray-200 rounded-lg" />
                                        <div className="h-3 w-24 bg-gray-100 rounded" />
                                   </div>
                                   <div className="w-16 h-6 rounded-full bg-gray-200" />
                              </div>
                              <div className="h-3 w-full bg-gray-100 rounded mb-1.5" />
                              <div className="h-3 w-4/5 bg-gray-100 rounded" />
                         </div>
                    ))}
               </div>
          </div>
     );
}
