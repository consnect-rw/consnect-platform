"use client";
import React, { useState } from 'react';
import { FileText, Building2, ChevronDown, ChevronUp, Shield, Mail, Calendar } from 'lucide-react';
import TermsOfUse from '@/lib/data/terms-of-use';
import Link from 'next/link';

export default function TermsOfUsePage() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (id:string) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              
              <div>
                <h1 className="text-xl font-bold text-gray-900">{TermsOfUse.siteName}</h1>
                <p className="text-xs text-gray-500">{TermsOfUse.domain}</p>
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
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-amber-600" />
                <h2 className="font-semibold text-gray-900">Table of Contents</h2>
              </div>
              <nav className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                {TermsOfUse.sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      activeSection === section.id
                        ? 'bg-amber-100 text-amber-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-xs text-gray-400 mr-2">{String(index + 1).padStart(2, '0')}</span>
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 mb-8 shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-8 h-8 text-white" />
                  <span className="text-white/90 font-medium">Legal Document</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                  Terms of Use
                </h1>
                <p className="text-white/90 text-base sm:text-lg mb-6 max-w-2xl">
                  Please read these terms carefully before using the {TermsOfUse.siteName} platform.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-white/90">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <Calendar className="w-4 h-4" />
                    <span>Effective: {TermsOfUse.effectiveDate}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <Mail className="w-4 h-4" />
                    <span>{TermsOfUse.contactEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Quick Nav */}
            <div className="lg:hidden mb-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 border border-gray-200">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-900">
                  <span className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-600" />
                    Quick Navigation
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <nav className="mt-4 space-y-2 pl-2">
                  {TermsOfUse.sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-amber-50 hover:text-amber-700 transition-all"
                    >
                      <span className="text-xs text-gray-400 mr-2">{String(index + 1).padStart(2, '0')}</span>
                      {section.title}
                    </button>
                  ))}
                </nav>
              </details>
            </div>

            {/* Sections */}
            <div className="space-y-4">
              {TermsOfUse.sections.map((section, index) => (
                <div
                  key={section.id}
                  id={section.id}
                  className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 overflow-hidden scroll-mt-24 transition-all hover:shadow-lg"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 text-left">
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                        {section.title}
                      </h2>
                    </div>
                    {expandedSections[section.id] ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  
                  {expandedSections[section.id] && (
                    <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-gray-100">
                      <ul className="space-y-3">
                        {section.content.map((item, idx) => (
                          <li key={idx} className="flex gap-3 text-gray-700 text-sm sm:text-base leading-relaxed">
                            <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-amber-500"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer Card */}
            <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Questions or Concerns?</h3>
                  <p className="text-gray-600 text-sm">
                    If you have any questions about these Terms of Use, please contact us.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`mailto:${TermsOfUse.contactEmail}`}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all text-center"
                >
                  Contact Support
                </a>
                <a
                  href="/"
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all text-center"
                >
                  Back to Platform
                </a>
              </div>
            </div>
          </main>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 text-center sm:text-left">
              © {new Date().getFullYear()} {TermsOfUse.companyName} • Last updated: {TermsOfUse.lastUpdated}
            </p>
            <div className="flex gap-4 text-sm">
              <Link href="/privacy" className="text-amber-600 hover:text-amber-700 font-medium">Privacy Policy</Link>
              <a href="#" className="text-amber-600 hover:text-amber-700 font-medium">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}