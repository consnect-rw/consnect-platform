"use client";

import React, { useState } from 'react';
import { Shield, Lock, Eye, Database, Users, Globe, Cookie, Mail, Calendar, Building2, Search, ChevronRight } from 'lucide-react';
import PrivacyPolicy from '@/lib/data/privacy-policy';
import Link from 'next/link';
import { CurrentYear } from '@/components/layout/CurrentYear';

const iconMap: Record<string, React.ElementType> = {
  'information_we_collect': Database,
  'how_we_use_information': Users,
  'how_we_share_information': Globe,
  'data_retention': Calendar,
  'data_security': Lock,
  'your_rights': Shield,
  'cookies': Cookie,
  'international_transfers': Globe,
  'children': Users,
  'changes_to_policy': Calendar,
  'contact': Mail
};

export default function PrivacyPolicyPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const filteredSections = PrivacyPolicy.sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{PrivacyPolicy.siteName}</h1>
                <p className="text-xs text-gray-500">{PrivacyPolicy.domain}</p>
              </div>
            </div>
            <a 
              href="/"
              className="px-4 py-2 text-sm font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all"
            >
              Back to Home
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Hero Section - Different Design */}
        <div className="mb-8 lg:mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md mb-6">
              <Shield className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-semibold text-gray-700">Your Privacy Matters</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                Privacy Policy
              </span>
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-6">
              Learn how we collect, use, and protect your information on the Consnect platform
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>Effective: {PrivacyPolicy.effectiveDate}</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                <Mail className="w-4 h-4 text-amber-600" />
                <span>{PrivacyPolicy.contactEmail}</span>
              </div>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {PrivacyPolicy.overview.map((text, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search privacy topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Sections Grid - Card Layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredSections.map((section) => {
            const IconComponent = iconMap[section.id] || Shield;
            const isSelected = selectedSection === section.id;
            
            return (
              <div
                key={section.id}
                id={section.id}
                className={`bg-white rounded-2xl shadow-md border-2 transition-all hover:shadow-xl cursor-pointer ${
                  isSelected ? 'border-amber-500 shadow-amber-200' : 'border-gray-200'
                }`}
                onClick={() => setSelectedSection(isSelected ? null : section.id)}
              >
                <div className="p-6">
                  {/* Section Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-gray-900 mb-2">{section.title}</h2>
                      {section.content.map((text, idx) => (
                        <p key={idx} className="text-gray-600 text-sm mb-2">{text}</p>
                      ))}
                    </div>
                  </div>

                  {/* Subsections */}
                  {section.subSections && (
                    <div className="space-y-4 mt-6">
                      {section.subSections.map((sub) => (
                        <div key={sub.id} className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <ChevronRight className="w-4 h-4 text-amber-600" />
                            {sub.title}
                          </h3>
                          <ul className="space-y-2 ml-6">
                            {sub.details.map((detail, idx) => (
                              <li key={idx} className="text-gray-700 text-sm flex gap-2">
                                <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-amber-500"></span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA - Different Style */}
        <div className="mt-12 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 -translate-x-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-y-1/2 translate-x-1/2"></div>
          </div>
          <div className="relative z-10 text-center">
            <Eye className="w-16 h-16 text-white mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">
              Questions About Your Privacy?
            </h3>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Our team is here to help you understand how we protect your data and respect your privacy rights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`mailto:${PrivacyPolicy.contactEmail}`}
                className="px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl hover:shadow-2xl transition-all inline-flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Contact Privacy Team
              </a>
              <a
                href="/"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all border-2 border-white/30"
              >
                Return to Platform
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 text-center md:text-left">
              © <CurrentYear /> {PrivacyPolicy.companyName} • Last updated: {PrivacyPolicy.lastUpdated}
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="terms" className="text-yellow-600 hover:text-amber-700 font-medium">Terms of Use</Link>
              <Link href="terms" className="text-yellow-600 hover:text-amber-700 font-medium">Cookie Policy</Link>
              <Link href="/contact" className="text-yellow-600 hover:text-amber-700 font-medium">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}