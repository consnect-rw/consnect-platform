"use client";

import { ReactNode } from "react";

interface InfoCardProps {
  icon: ReactNode;
  label: string;
  value: string | number | null | undefined;
  className?: string;
}

export const InfoCard = ({ icon, label, value, className = "" }: InfoCardProps) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-yellow-100 rounded-lg shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className="text-sm font-semibold text-gray-900 truncate">
            {value || "Not provided"}
          </p>
        </div>
      </div>
    </div>
  );
};
