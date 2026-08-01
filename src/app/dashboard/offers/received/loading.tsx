export default function ReceivedLoading() {
     return (
          <div className="w-full bg-gray-50 p-4 sm:p-6 lg:p-8">
               {/* Header skeleton */}
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                         <div className="w-11 h-11 rounded-xl bg-gray-200 animate-pulse shrink-0" />
                         <div className="space-y-2">
                              <div className="h-5 w-44 bg-gray-200 rounded-lg animate-pulse" />
                              <div className="h-3 w-56 bg-gray-100 rounded animate-pulse" />
                         </div>
                    </div>
                    <div className="flex items-center gap-3">
                         <div className="w-20 h-14 rounded-xl bg-gray-200 animate-pulse" />
                         <div className="w-20 h-14 rounded-xl bg-amber-100 animate-pulse" />
                    </div>
               </div>
               {/* Row skeletons */}
               <div className="flex flex-col gap-3">
                    {[...Array(5)].map((_, i) => (
                         <div key={i} className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 animate-pulse">
                              <div className="w-14 h-14 rounded-xl bg-gray-200 shrink-0" />
                              <div className="flex-1 space-y-2">
                                   <div className="flex gap-2">
                                        <div className="h-4 w-16 bg-gray-200 rounded-full" />
                                        <div className="h-4 w-20 bg-gray-100 rounded-full" />
                                   </div>
                                   <div className="h-4 w-2/3 bg-gray-200 rounded-lg" />
                                   <div className="h-3 w-1/2 bg-gray-100 rounded" />
                              </div>
                              <div className="w-9 h-9 rounded-xl bg-gray-100 shrink-0" />
                         </div>
                    ))}
               </div>
          </div>
     );
}
