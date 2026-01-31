"use client";

import { TService } from "@/types/company/service";
import { Wrench, FileCheck, Tag } from "lucide-react";
import Link from "next/link";

interface ServiceCardProps {
  service: TService;
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-yellow-100 rounded-xl shrink-0">
          <Wrench className="w-6 h-6 text-yellow-600" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {service.name}
          </h3>
          
          {/* Category */}
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-gray-600">{service.category.name}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4">
            {service.description}
          </p>

          {/* Certifications */}
          {service.certifications && service.certifications.length > 0 && (
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <FileCheck className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  Certifications ({service.certifications.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {service.certifications.map((cert, idx) => (
                  <Link
                    key={idx}
                    href={cert.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full hover:bg-green-100 transition-colors"
                  >
                    {cert.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
