export default function AdminLoading() {
     return (
          <div className="w-full h-full min-h-[80vh] flex flex-col items-center justify-center bg-white rounded-xl">
               {/* Layered spinning rings */}
               <div className="relative flex items-center justify-center mb-8">
                    {/* Slow amber dashed orbit */}
                    <div
                         className="absolute w-28 h-28 rounded-full border-2 border-dashed border-amber-200 animate-spin"
                         style={{ animationDuration: "6s" }}
                    />
                    {/* Outer solid amber arc */}
                    <div
                         className="absolute w-20 h-20 rounded-full border-[3px] border-transparent border-t-amber-500 border-r-amber-300 animate-spin"
                         style={{ animationDuration: "1s" }}
                    />
                    {/* Inner dark arc — reverse */}
                    <div
                         className="absolute w-12 h-12 rounded-full border-[3px] border-transparent border-b-gray-900 border-l-gray-700 animate-spin"
                         style={{ animationDuration: "0.75s", animationDirection: "reverse" }}
                    />
                    {/* Center badge */}
                    <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center shadow-md animate-pulse">
                         <span className="text-amber-400 font-black text-xs select-none leading-none">A</span>
                    </div>
               </div>

               {/* Admin wordmark */}
               <div className="flex items-end select-none mb-1">
                    <span className="text-xl font-black tracking-tight text-gray-900 leading-none">CONS</span>
                    <span className="text-xl font-black tracking-tight text-amber-500 leading-none">NECT</span>
               </div>
               <p className="text-[10px] font-bold tracking-[0.35em] text-amber-600 uppercase mb-6 select-none">
                    Admin Panel
               </p>

               {/* Row of skeleton blocks */}
               <div className="flex items-end gap-1.5 h-8">
                    {[60, 80, 50, 90, 65, 75, 45].map((h, i) => (
                         <div
                              key={i}
                              className="w-3 bg-amber-100 rounded-sm animate-pulse"
                              style={{
                                   height: `${h}%`,
                                   animationDelay: `${i * 0.1}s`,
                                   animationDuration: "1.2s",
                              }}
                         />
                    ))}
               </div>

               <p className="text-[10px] text-gray-400 font-semibold tracking-[0.25em] uppercase mt-5 animate-pulse">
                    Loading Admin
               </p>
          </div>
     );
}
