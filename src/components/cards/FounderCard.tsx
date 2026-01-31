"use client";

import { TFounder } from "@/types/company/founder";
import { User, Briefcase } from "lucide-react";
import Image from "../ui/Image";

interface FounderCardProps {
  founder: TFounder;
}

export const FounderCard = ({ founder }: FounderCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
      <div className="flex items-start gap-4">
        {/* Founder Image */}
        <div className="shrink-0">
          {founder.image ? (
            <Image
              src={founder.image}
              alt={founder.name}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover border-2 border-yellow-200"
            />
          ) : (
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-yellow-600" />
            </div>
          )}
        </div>

        {/* Founder Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {founder.name}
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Briefcase className="w-4 h-4 text-yellow-600" />
              <span>{founder.title}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
