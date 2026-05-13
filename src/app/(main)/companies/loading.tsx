export default function MainLoading() {
     return (
          <div className="min-h-[70vh] w-full flex flex-col items-center justify-center bg-white">
               {/* Spinning rings */}
               <div className="relative flex items-center justify-center mb-10">
                    <div
                         className="absolute w-28 h-28 rounded-full border-[3px] border-transparent border-t-amber-400 border-r-amber-300 animate-spin"
                         style={{ animationDuration: "2s" }}
                    />
                    <div
                         className="absolute w-20 h-20 rounded-full border-[3px] border-transparent border-b-gray-900 border-l-gray-700 animate-spin"
                         style={{ animationDuration: "1.4s", animationDirection: "reverse" }}
                    />
                    <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center shadow-xl shadow-amber-100 animate-pulse">
                         <span className="text-gray-900 font-black text-xl select-none leading-none">C</span>
                    </div>
               </div>

               {/* Brand wordmark */}
               <div className="flex items-end select-none mb-6">
                    <span className="text-4xl font-black tracking-tight text-gray-900 leading-none">CONS</span>
                    <span className="text-4xl font-black tracking-tight text-amber-500 leading-none">NECT</span>
                    <span className="text-sm font-bold text-amber-600 ml-1.5 mb-0.5">Ltd.</span>
               </div>

               {/* Animated dot-trail */}
               <div className="flex items-center gap-2">
                    {[0, 1, 2, 3, 4].map((i) => (
                         <span
                              key={i}
                              className="block rounded-full animate-bounce"
                              style={{
                                   width: i === 2 ? "10px" : i === 1 || i === 3 ? "8px" : "6px",
                                   height: i === 2 ? "10px" : i === 1 || i === 3 ? "8px" : "6px",
                                   backgroundColor: i === 2 ? "#f59e0b" : i === 1 || i === 3 ? "#fbbf24" : "#fcd34d",
                                   animationDelay: `${i * 0.12}s`,
                                   animationDuration: "0.8s",
                              }}
                         />
                    ))}
               </div>

               <p className="text-xs text-gray-400 font-semibold tracking-[0.25em] uppercase mt-5">
                    Loading
               </p>
          </div>
     );
}
