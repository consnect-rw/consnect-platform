"use client";

import { TContactPerson } from "@/types/company/contact-person";
import { useState } from "react";
import { Eye, X, Mail, Phone, FileText, Clock, Award, ExternalLink, Shield } from "lucide-react";

export const AdminContactPersonCard = ({ contact }: { contact: TContactPerson }) => {
  const [showDialog, setShowDialog] = useState(false);

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'PRIMARY': return 'bg-yellow-500';
      case 'SECONDARY': return 'bg-gray-500';
      case 'EMERGENCY': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getLevelTextColor = (level: string) => {
    switch(level) {
      case 'PRIMARY': return 'text-yellow-600';
      case 'SECONDARY': return 'text-gray-600';
      case 'EMERGENCY': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Check if person is IER certified (has registration number)
  const isIERCertified = !!contact.regNumber;

  return (
    <>
      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
        {/* Card Header */}
        <div className="bg-linear-to-r from-gray-50 to-white px-4 py-4 border-b border-gray-100">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center text-lg font-bold text-white shrink-0 shadow-sm">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            
            {/* Name and Role */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-base truncate">{contact.name}</h3>
              <p className="text-sm text-gray-600 truncate">{contact.role}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-semibold ${getLevelTextColor(contact.level)} uppercase`}>
                  {contact.level}
                </span>
                {isIERCertified && (
                  <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    <Shield className="w-3 h-3" />
                    IER Certified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card Body - Contact Info */}
        <div className="px-4 py-3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="truncate">{contact.contactEmail}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{contact.contactPhone}</span>
          </div>
        </div>

        {/* Card Footer - View Action */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <button
            onClick={() => setShowDialog(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white text-sm font-medium rounded-lg transition-all duration-200"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
        </div>
      </div>

      {/* Full Details Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDialog(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Dialog Header */}
            <div className="bg-linear-to-br from-gray-900 via-gray-800 to-black px-6 py-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-500/5 rounded-full -ml-12 -mb-12"></div>
              
              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{contact.name}</h2>
                    <p className="text-yellow-400 font-medium">{contact.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`${getLevelColor(contact.level)} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                        {contact.level}
                      </span>
                      {isIERCertified && (
                        <span className="flex items-center gap-1 text-xs font-medium text-green-400 bg-green-900/30 px-2 py-1 rounded-full">
                          <Shield className="w-3 h-3" />
                          IER Certified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowDialog(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Dialog Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-yellow-600" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Email</p>
                      <p className="text-sm font-medium text-gray-900">{contact.contactEmail}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{contact.contactPhone}</p>
                    </div>
                  </div>
                </div>

                {/* IER Registration (if certified) */}
                {isIERCertified && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      IER Registration
                    </h3>
                    <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-xs font-semibold text-green-700 uppercase mb-1">Registration Number</p>
                          <p className="text-lg font-mono font-bold text-green-900">{contact.regNumber}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      {/* License Documents */}
                      {contact.certificates && contact.certificates.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-green-200">
                          <p className="text-xs font-semibold text-green-700 uppercase mb-2">License Documents</p>
                          <div className="space-y-2">
                            {contact.certificates.map((cert) => (
                              <a
                                key={cert.id}
                                href={cert.docUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-300 hover:border-green-500 hover:shadow-md transition-all duration-200 group"
                              >
                                <div className="w-10 h-10 bg-linear-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shrink-0">
                                  <FileText className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 text-sm truncate group-hover:text-green-700 transition-colors">
                                    {cert.title || cert.type}
                                  </p>
                                  <p className="text-xs text-gray-500 capitalize">{cert.type.replace(/_/g, ' ').toLowerCase()}</p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Professional Information */}
                {(contact.experienceYears || (contact.expertiseAreas && contact.expertiseAreas.length > 0)) && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-600" />
                      Professional Information
                    </h3>
                    <div className="space-y-4">
                      {contact.experienceYears && (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                              <Clock className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase">Experience</p>
                              <p className="text-xl font-bold text-gray-900">{contact.experienceYears} Years</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {contact.expertiseAreas && contact.expertiseAreas.length > 0 && (
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <p className="text-xs font-semibold text-yellow-800 uppercase mb-3">Expertise Areas</p>
                          <div className="flex flex-wrap gap-2">
                            {contact.expertiseAreas.map((area, index) => (
                              <span
                                key={index}
                                className="px-3 py-1.5 bg-white border border-yellow-300 text-gray-800 rounded-lg text-sm font-medium shadow-sm hover:bg-yellow-100 transition-colors"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setShowDialog(false)}
                className="w-full px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
