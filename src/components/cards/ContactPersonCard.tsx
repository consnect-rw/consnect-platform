"use client";

import { TContactPerson } from "@/types/company/contact-person";
import { Mail, Phone, User, Badge } from "lucide-react";

interface ContactPersonCardProps {
  contact: TContactPerson;
}

export const ContactPersonCard = ({ contact }: ContactPersonCardProps) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "PRIMARY":
        return "bg-green-100 text-green-700";
      case "SECONDARY":
        return "bg-blue-100 text-blue-700";
      case "EMERGENCY":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg shrink-0">
            <User className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
            <p className="text-sm text-gray-600">{contact.role}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(contact.level)}`}>
          {contact.level}
        </span>
      </div>

      <div className="space-y-2 mt-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4 text-yellow-600" />
          <span className="truncate">{contact.contactEmail}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4 text-yellow-600" />
          <span>{contact.contactPhone}</span>
        </div>
      </div>
    </div>
  );
};
