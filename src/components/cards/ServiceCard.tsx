import { TService } from "@/types/company/service";
import { Wrench, FileCheck, Tag } from "lucide-react";
import Link from "next/link";

interface ServiceCardProps {
  service: TService;
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-yellow-400 hover:shadow-lg transition-all group">
      {/* Service Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <Wrench className="w-6 h-6 text-gray-900" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
            {service.name}
          </h3>
          {/* Category Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-full">
            <Tag className="w-3.5 h-3.5 text-yellow-600" />
            <span className="text-xs font-bold text-yellow-700 uppercase tracking-wide">
              {service.category.name}
            </span>
          </div>
        </div>
      </div>

      {/* Service Description */}
      <p className="text-gray-700 leading-relaxed mb-4">
        {service.description}
      </p>

      {/* Certifications */}
      {service.certifications && service.certifications.length > 0 && (
        <div className="pt-4 border-t-2 border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-bold text-gray-700">
              Certifications ({service.certifications.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {service.certifications.slice(0, 3).map((cert, idx) => (
              <Link
                key={idx}
                href={cert.docUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors group/cert"
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700 group-hover/cert:text-emerald-800">
                  {cert.title}
                </span>
              </Link>
            ))}
            {service.certifications.length > 3 && (
              <div className="inline-flex items-center px-3 py-1.5 bg-gray-100 rounded-lg">
                <span className="text-xs font-medium text-gray-600">
                  +{service.certifications.length - 3} more
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
