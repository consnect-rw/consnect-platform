"use client";

import React, { useState } from 'react';
import { HelpCircle, Search, ChevronDown, MessageCircle, Building2, Users, FileText, Handshake, Package, FolderOpen, Mail, CreditCard, Lock, Settings, Globe, Sparkles } from 'lucide-react';
import ConsnectFAQs from '@/lib/data/faqs';


const categoryIcons: Record<string, React.ElementType> = {
  'getting_started': Sparkles,
  'accounts_and_profiles': Users,
  'tenders': FileText,
  'partnerships': Handshake,
  'company_profiles': Package,
  'projects': FolderOpen,
  'communication': MessageCircle,
  'payments': CreditCard,
  'security_and_privacy': Lock,
  'technical': Settings,
  'general': Globe
};

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('getting_started');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredCategories = ConsnectFAQs.categories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  const toggleFAQ = (categoryId: string, questionIndex: number) => {
    const faqId = `${categoryId}-${questionIndex}`;
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-500 via-yellow-700 to-amber-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <HelpCircle className="w-5 h-5 text-white" />
            <span className="text-sm font-semibold text-white">We're Here to Help</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-white/90 text-lg sm:text-xl max-w-3xl mx-auto mb-8">
            Find answers to common questions about using Consnect for construction tenders and partnerships
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-5 rounded-2xl border-0 shadow-xl text-lg focus:ring-4 focus:ring-white/50 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Category Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 sticky top-24">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-600" />
                Categories
              </h2>
              <nav className="space-y-2">
                {ConsnectFAQs.categories.map((category) => {
                  const IconComponent = categoryIcons[category.id] || HelpCircle;
                  const isActive = activeCategory === category.id;
                  const faqCount = category.faqs.length;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id);
                        document.getElementById(category.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                          : 'text-gray-700 hover:bg-amber-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{category.title}</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        isActive ? 'bg-white/20' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {faqCount}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* FAQ Content */}
          <main className="lg:col-span-3">
            <div className="space-y-8">
              {filteredCategories.map((category) => {
                const IconComponent = categoryIcons[category.id] || HelpCircle;
                
                return (
                  <div key={category.id} id={category.id} className="scroll-mt-24">
                    {/* Category Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                        <p className="text-sm text-gray-500">{category.faqs.length} questions</p>
                      </div>
                    </div>

                    {/* FAQ Items */}
                    <div className="space-y-3">
                      {category.faqs.map((faq, index) => {
                        const faqId = `${category.id}-${index}`;
                        const isExpanded = expandedFAQ === faqId;
                        
                        return (
                          <div
                            key={index}
                            className={`bg-white rounded-xl shadow-sm border-2 transition-all overflow-hidden ${
                              isExpanded
                                ? 'border-amber-500 shadow-amber-100'
                                : 'border-gray-200 hover:border-amber-200'
                            }`}
                          >
                            <button
                              onClick={() => toggleFAQ(category.id, index)}
                              className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-start gap-4 flex-1">
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                  isExpanded
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  Q
                                </div>
                                <span className="font-semibold text-gray-900 text-base sm:text-lg">
                                  {faq.question}
                                </span>
                              </div>
                              <ChevronDown 
                                className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                                  isExpanded ? 'rotate-180' : ''
                                }`} 
                              />
                            </button>
                            
                            {isExpanded && (
                              <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                                <div className="flex gap-4">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-bold text-sm text-white">
                                    A
                                  </div>
                                  <p className="text-gray-700 leading-relaxed flex-1">
                                    {faq.answer}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* No Results */}
            {filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">Try searching with different keywords</p>
              </div>
            )}

            {/* Still Have Questions CTA */}
            <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Still have questions?
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <a
                href="mailto:support@consnect.rw"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                <Mail className="w-5 h-5" />
                Contact Support
              </a>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}