"use client";

import { Award, Star, Crown, Shield, Sparkles } from "lucide-react";

type BadgeLevel = "bronze" | "silver" | "gold";

interface ConsnectBadgeProps {
  level: BadgeLevel;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  variant?: "default" | "compact" | "minimal";
}

const badgeConfig = {
  bronze: {
    name: "Bronze Partner",
    description: "Registered & Verified",
    gradient: "from-orange-400 via-amber-500 to-orange-600",
    glowColor: "from-orange-300 via-amber-400 to-orange-500",
    ringColor: "border-orange-600",
    textColor: "text-orange-900",
    bgColor: "bg-orange-50",
    icon: Award,
    accentColor: "text-orange-600"
  },
  silver: {
    name: "Silver Partner",
    description: "Licensed & Portfolio Verified",
    gradient: "from-slate-300 via-gray-400 to-slate-500",
    glowColor: "from-slate-200 via-gray-300 to-slate-400",
    ringColor: "border-slate-500",
    textColor: "text-slate-900",
    bgColor: "bg-slate-50",
    icon: Shield,
    accentColor: "text-slate-600"
  },
  gold: {
    name: "Gold Partner",
    description: "Premium Trust & Excellence",
    gradient: "from-yellow-400 via-amber-500 to-yellow-600",
    glowColor: "from-yellow-300 via-amber-400 to-yellow-500",
    ringColor: "border-yellow-600",
    textColor: "text-yellow-900",
    bgColor: "bg-yellow-50",
    icon: Crown,
    accentColor: "text-yellow-600"
  }
};

export const ConsnectBadge = ({ 
  level, 
  size = "md", 
  showLabel = true,
  variant = "default"
}: ConsnectBadgeProps) => {
  const config = badgeConfig[level];
  const IconComponent = config.icon;
  
  const sizes = {
    sm: {
      container: "w-16 h-16",
      icon: "w-8 h-8",
      starIcon: "w-3 h-3",
      text: "text-xs",
      badge: "w-5 h-5",
      badgeIcon: "w-2.5 h-2.5"
    },
    md: {
      container: "w-24 h-24",
      icon: "w-12 h-12",
      starIcon: "w-4 h-4",
      text: "text-sm",
      badge: "w-7 h-7",
      badgeIcon: "w-3.5 h-3.5"
    },
    lg: {
      container: "w-32 h-32",
      icon: "w-16 h-16",
      starIcon: "w-5 h-5",
      text: "text-base",
      badge: "w-9 h-9",
      badgeIcon: "w-4.5 h-4.5"
    },
    xl: {
      container: "w-40 h-40",
      icon: "w-20 h-20",
      starIcon: "w-6 h-6",
      text: "text-lg",
      badge: "w-11 h-11",
      badgeIcon: "w-5.5 h-5.5"
    }
  };

  const currentSize = sizes[size];

  // Simple icon-only mode when showLabel is false
  if (!showLabel && variant === "default") {
    return (
      <div className={`relative w-8 h-8 bg-linear-to-br ${config.gradient} rounded-full shadow-lg flex items-center justify-center border-2 border-white group hover:scale-110 transition-transform duration-200`}>
        <IconComponent className="w-4 h-4 text-white" />
        {/* Subtle glow */}
        <div className={`absolute inset-0 bg-linear-to-r ${config.glowColor} rounded-full blur-md opacity-40 -z-10`}></div>
      </div>
    );
  }

  // Minimal variant - small inline badge
  if (variant === "minimal") {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 ${config.bgColor} ${config.ringColor} border rounded-full`}>
        <IconComponent className={`w-3.5 h-3.5 ${config.accentColor}`} />
        <span className={`${config.textColor} font-bold text-xs uppercase tracking-wide`}>
          {level}
        </span>
      </div>
    );
  }

  // Compact variant - inline badge with icon
  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r ${config.gradient} rounded-full shadow-lg`}>
        <IconComponent className="w-5 h-5 text-white" />
        <div className="flex flex-col">
          <span className="text-white font-extrabold text-xs uppercase tracking-wider">
            {level}
          </span>
          <span className="text-white/90 text-[10px] font-medium">
            Consnect Partner
          </span>
        </div>
        <Sparkles className="w-4 h-4 text-white" />
      </div>
    );
  }

  // Default variant - full badge display
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Main Badge */}
      <div className="relative group">
        {/* Outer glow ring - animated */}
        <div className={`absolute inset-0 bg-linear-to-r ${config.glowColor} rounded-full blur-xl opacity-50 group-hover:opacity-70 animate-pulse`}></div>
        
        {/* Rotating ring */}
        <div className={`absolute inset-0 ${currentSize.container} rounded-full border-4 ${config.ringColor} opacity-30 animate-spin`} style={{ animationDuration: '8s' }}></div>
        
        {/* Badge container */}
        <div className={`relative ${currentSize.container} bg-linear-to-br ${config.gradient} rounded-full shadow-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 border-4 border-white`}>
          {/* Inner highlight */}
          <div className="absolute inset-3 bg-linear-to-br from-white/40 to-transparent rounded-full"></div>
          
          {/* Main icon */}
          <IconComponent className={`${currentSize.icon} text-white relative z-10 drop-shadow-2xl`} />
          
          {/* Top star badge */}
          <div className={`absolute -top-2 left-1/2 -translate-x-1/2 ${currentSize.badge} bg-white rounded-full shadow-xl flex items-center justify-center ${config.ringColor} border-4`}>
            <Star className={`${currentSize.badgeIcon} ${config.accentColor} fill-current`} />
          </div>
          
          {/* Bottom text badge */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white rounded-full shadow-lg border-2 border-gray-200">
            <span className={`text-[10px] font-black uppercase tracking-wider ${config.textColor}`}>
              {level}
            </span>
          </div>
          
          {/* Sparkle effects */}
          <div className="absolute top-3 right-3 w-2 h-2 bg-white rounded-full animate-ping"></div>
          <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-150"></div>
          <div className="absolute top-6 left-2 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
        </div>
      </div>

      {/* Label */}
      {showLabel && (
        <div className="flex flex-col items-center gap-1 text-center">
          <span className={`${currentSize.text} font-extrabold ${config.textColor} tracking-tight uppercase`}>
            {config.name}
          </span>
          <span className="text-xs text-gray-600 font-medium max-w-50">
            {config.description}
          </span>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Consnect
            </span>
            <Sparkles className="w-3 h-3 text-yellow-500" />
          </div>
        </div>
      )}
    </div>
  );
};
