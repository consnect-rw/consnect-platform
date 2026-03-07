export default function AuthLoading() {
     return (
          <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-950">
               {/* Glow halo */}
               <div className="relative flex items-center justify-center mb-8">
                    <div
                         className="absolute w-32 h-32 rounded-full bg-amber-500 opacity-10 blur-2xl animate-pulse"
                         style={{ animationDuration: "1.6s" }}
                    />
                    {/* Outer arc */}
                    <div
                         className="absolute w-24 h-24 rounded-full border-[3px] border-transparent border-t-amber-400 animate-spin"
                         style={{ animationDuration: "1.1s" }}
                    />
                    {/* Inner arc — reverse */}
                    <div
                         className="absolute w-16 h-16 rounded-full border-[3px] border-transparent border-b-amber-600 border-l-amber-500 animate-spin"
                         style={{ animationDuration: "1.7s", animationDirection: "reverse" }}
                    />
                    {/* Core */}
                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                         <span className="text-gray-950 font-black text-base select-none leading-none">C</span>
                    </div>
               </div>

               {/* Wordmark on dark */}
               <div className="flex items-end select-none mb-2">
                    <span className="text-2xl font-black tracking-tight text-white leading-none">CONS</span>
                    <span className="text-2xl font-black tracking-tight text-amber-500 leading-none">NECT</span>
                    <span className="text-xs font-bold text-amber-600 ml-1.5 mb-0.5">Ltd.</span>
               </div>

               <p className="text-[10px] text-gray-600 font-semibold tracking-[0.3em] uppercase mb-8">
                    Connecting the Construction World
               </p>

               {/* Bouncing dots */}
               <div className="flex items-center gap-1.5">
                    {[0, 1, 2, 3].map((i) => (
                         <span
                              key={i}
                              className="block w-2 h-2 rounded-full bg-amber-500 animate-bounce"
                              style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.9s" }}
                         />
                    ))}
               </div>

               <p className="text-[10px] text-gray-700 font-medium tracking-[0.2em] uppercase mt-5">
                    Authenticating
               </p>
          </div>
     );
}
