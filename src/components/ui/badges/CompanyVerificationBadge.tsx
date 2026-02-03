"use client";

import { Check } from "lucide-react";


interface CompanyVerificationBadgeProps {
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  variant?: "default" | "compact";
}

export const CompanyVerificationBadge = ({ 
  size = "md", 
  showLabel = true,
  variant = "default" 
}: CompanyVerificationBadgeProps) => {
  
  const sizes = {
    sm: {
      container: "w-12 h-12",
      icon: "w-6 h-6",
      text: "text-xs",
      badge: "w-5 h-5",
      badgeIcon: "w-3 h-3"
    },
    md: {
      container: "w-24 h-24",
      icon: "w-12 h-12",
      text: "text-sm",
      badge: "w-7 h-7",
      badgeIcon: "w-4 h-4"
    },
    lg: {
      container: "w-32 h-32",
      icon: "w-16 h-16",
      text: "text-base",
      badge: "w-9 h-9",
      badgeIcon: "w-5 h-5"
    },
    xl: {
      container: "w-40 h-40",
      icon: "w-20 h-20",
      text: "text-lg",
      badge: "w-11 h-11",
      badgeIcon: "w-6 h-6"
    }
  };

  const currentSize = sizes[size];

  // Simple icon-only mode when showLabel is false
  if (!showLabel && variant === "default") {
    return (
      <div className="relative w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center group hover:scale-110 transition-transform duration-200 shadow-md">
        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-emerald-500 to-emerald-600 rounded-full shadow-lg">
        <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
        </div>
        <span className="text-white font-bold text-sm">Verified</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Main Badge */}
      <div className="relative group">
        {/* Outer glow ring - animated */}
        <div className="absolute inset-0 bg-linear-to-r from-emerald-400 via-emerald-500 to-emerald-600 rounded-full blur-xl opacity-60 group-hover:opacity-80 animate-pulse"></div>
        
        {/* Badge container */}
        <div className={`relative ${currentSize.container} bg-linear-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-full shadow-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300`}>
          {/* Inner highlight */}
          <div className="absolute inset-2 bg-linear-to-br from-white/30 to-transparent rounded-full"></div>
          
          {/* Check icon */}
          <Check className={`${currentSize.icon} text-white relative z-10 drop-shadow-lg`} strokeWidth={3} />
          
          {/* Sparkle effects */}
          <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-ping"></div>
          <div className="absolute top-4 left-3 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Label */}
      {showLabel && (
        <div className="flex flex-col items-center gap-1">
          <span className={`${currentSize.text} font-extrabold text-gray-900 tracking-tight`}>
            VERIFIED
          </span>
          <span className="text-xs text-gray-600 font-medium">
            Trusted Company
          </span>
        </div>
      )}
    </div>
  );
};
