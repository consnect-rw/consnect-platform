export default function DashboardLoading() {
     return (
          <div className="w-full h-full min-h-[80vh] flex flex-col items-center justify-center bg-white rounded-xl">
               {/* Stacked spinning rings */}
               <div className="relative flex items-center justify-center mb-8">
                    {/* Slow dashed orbit */}
                    <div
                         className="absolute w-24 h-24 rounded-full border-2 border-dashed border-amber-200 animate-spin"
                         style={{ animationDuration: "5s" }}
                    />
                    {/* Fast amber arc */}
                    <div
                         className="absolute w-16 h-16 rounded-full border-[3px] border-transparent border-t-amber-500 border-r-amber-400 animate-spin"
                         style={{ animationDuration: "0.9s" }}
                    />
                    {/* Counter dark arc */}
                    <div
                         className="absolute w-10 h-10 rounded-full border-[3px] border-transparent border-b-gray-900 animate-spin"
                         style={{ animationDuration: "0.7s", animationDirection: "reverse" }}
                    />
                    {/* Pinging center */}
                    <div className="w-3.5 h-3.5 rounded-full bg-amber-500 animate-ping" />
               </div>

               {/* Mini wordmark */}
               <div className="flex items-end select-none mb-6">
                    <span className="text-xl font-black tracking-tight text-gray-900 leading-none">CONS</span>
                    <span className="text-xl font-black tracking-tight text-amber-500 leading-none">NECT</span>
               </div>

               {/* Skeleton shimmer lines */}
               <div className="w-64 space-y-2.5">
                    <div className="h-2.5 bg-gray-100 rounded-full animate-pulse w-full" />
                    <div className="h-2.5 bg-gray-100 rounded-full animate-pulse w-4/5 mx-auto" style={{ animationDelay: "0.15s" }} />
                    <div className="h-2.5 bg-gray-100 rounded-full animate-pulse w-3/5 mx-auto" style={{ animationDelay: "0.3s" }} />
               </div>

               <p className="text-[10px] text-gray-400 font-semibold tracking-[0.25em] uppercase mt-6 animate-pulse">
                    Loading Dashboard
               </p>
          </div>
     );
}
