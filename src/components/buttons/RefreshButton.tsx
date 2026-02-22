"use client";

import queryClient from "@/lib/queryClient";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RefreshCw } from "lucide-react";

interface RefreshButtonProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  showIcon?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  onRefresh?: () => void;
}

export const RefreshButton = ({
  size = "md",
  showText = true,
  showIcon = true,
  variant = "secondary",
  className = "",
  onRefresh,
}: RefreshButtonProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Invalidate all React Query cache
      await queryClient.invalidateQueries();
      // Refresh server components
      router.refresh();
      // Optional callback
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setLoading(false);
    }
  };

  // Size configurations
  const sizeClasses = {
    sm: {
      button: "px-3 py-1.5 text-sm",
      icon: "w-3.5 h-3.5",
      gap: "gap-1.5",
    },
    md: {
      button: "px-4 py-2 text-base",
      icon: "w-4 h-4",
      gap: "gap-2",
    },
    lg: {
      button: "px-6 py-3 text-lg",
      icon: "w-5 h-5",
      gap: "gap-2.5",
    },
  };

  // Variant configurations
     const variantClasses = {
          primary: "bg-yellow-400 text-gray-900 hover:bg-yellow-300 border-2 border-yellow-400 hover:border-yellow-300",
          secondary: "bg-white text-gray-900 hover:bg-gray-50 border-2 border-gray-200 hover:border-yellow-400",
          ghost: "bg-transparent text-gray-700 hover:bg-gray-100 border-2 border-transparent hover:border-gray-200",
     };

     const sizeConfig = sizeClasses[size];
     const variantClass = variantClasses[variant];

  return (
    <button
          onClick={handleRefresh}
          disabled={loading}
          className={`
               inline-flex items-center justify-center
               ${sizeConfig.button}
               ${sizeConfig.gap}
               ${variantClass}
               font-bold rounded-lg
               transition-all duration-200
               disabled:opacity-50 disabled:cursor-not-allowed
               focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2
               ${loading ? "cursor-wait" : "cursor-pointer"}
               ${className}
          `.trim().replace(/\s+/g, " ")}
          title="Refresh data"
          aria-label="Refresh"
    >
      {showIcon && (
        <RefreshCw
          className={`
            ${sizeConfig.icon}
            ${loading ? "animate-spin" : ""}
          `.trim().replace(/\s+/g, " ")}
        />
      )}
      {showText && <span>{loading ? "Refreshing..." : "Refresh"}</span>}
    </button>
  );
}; 