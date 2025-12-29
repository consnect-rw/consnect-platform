"use client";

// components/dashboard/ServiceCard.tsx
import { Pencil, Trash2, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { TService } from '@/types/company/service';



const ServiceCard = ({
  service,
  onEdit,
  onDelete,
}: {
  service: TService;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col h-full">
      {/* Header with Category Badge */}
      <div className="px-6 pt-6">
        <div className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full mb-4">
          {service.category.name}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-4 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {service.name}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 flex-1">
          {service.description}
        </p>

        {/* Certifications */}
        {service.certifications.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Certifications ({service.certifications.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {service.certifications.slice(0, 4).map((cert, idx) => (
                <a
                  key={idx}
                  href={cert.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition"
                >
                  <FileText className="w-4 h-4" />
                  {cert.title}
                </a>
              ))}
              {service.certifications.length > 4 && (
                <span className="text-xs text-gray-500 self-center">
                  +{service.certifications.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Created Date */}
        <p className="text-xs text-gray-500 mt-5">
          Added on {format(new Date(service.createdAt), 'MMM d, yyyy')}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6 mt-6 flex gap-3">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition-colors"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </button>

        <button
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-xl transition-colors shadow-sm"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;