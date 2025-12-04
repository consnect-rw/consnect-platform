import React from 'react';
import { Building2, Target, Eye, Heart, Lightbulb, Users, Handshake, Shield, TrendingUp, FileText, Briefcase, Package, FolderOpen, BarChart, MapPin, Sparkles } from 'lucide-react';
import { AboutInfo } from '@/lib/data/about-info';
import Link from 'next/link';




const valueIcons: Record<string, React.ElementType> = {
  'Transparency': Eye,
  'Innovation': Lightbulb,
  'Collaboration': Users,
  'Reliability': Shield,
  'Growth': TrendingUp
};

const featureIcons: Record<string, React.ElementType> = {
  'Construction Tenders': FileText,
  'Business Partnerships & Offers': Handshake,
  'Company Profiles': Briefcase,
  'Projects Portfolio': FolderOpen,
  'Services & Product Catalogs': Package,
  'Marketplace Visibility': BarChart
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-yellow-600 via-amber-600 to-yellow-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gray-900 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-900 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gray-900 rounded-full mb-6">
              <Building2 className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-semibold text-white">{AboutInfo.companyName}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              About Consnect
            </h1>
            <p className="text-gray-800 text-lg sm:text-xl lg:text-2xl max-w-4xl mx-auto font-medium">
              {AboutInfo.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-800">Who We Are</span>
            </div>
            <h2 className="text-base font-bold text-gray-900 mb-6">
              {AboutInfo.overview.shortDescription}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {AboutInfo.overview.longDescription}
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-600 to-amber-500 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <div className="space-y-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2">Based in {AboutInfo.location.city}</h3>
                    <p className="text-white/90 text-sm">{AboutInfo.location.note}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-3xl p-8 sm:p-10 border-2 border-gray-200">
              <div className="w-16 h-16 bg-yellow-600 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {AboutInfo.mission}
              </p>
            </div>
            <div className="bg-gray-900 rounded-3xl p-8 sm:p-10">
              <div className="w-16 h-16 bg-yellow-600 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                {AboutInfo.vision}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full mb-6">
            <Heart className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-semibold text-yellow-800">What Drives Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Our Core Values</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {AboutInfo.coreValues.map((value, index) => {
            const IconComponent = valueIcons[value.title] || Heart;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-yellow-600 transition-all group">
                <div className="w-14 h-14 bg-yellow-100 group-hover:bg-yellow-600 rounded-xl flex items-center justify-center mb-4 transition-all">
                  <IconComponent className="w-7 h-7 text-gray-900" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Our Story */}
      <div className="bg-gray-900 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 rounded-full mb-6">
              <Building2 className="w-4 h-4 text-gray-900" />
              <span className="text-sm font-semibold text-gray-900">Our Journey</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">The Consnect Story</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center mb-4">
                <span className="text-gray-900 font-bold text-lg">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Background</h3>
              <p className="text-gray-300 leading-relaxed">{AboutInfo.story.background}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center mb-4">
                <span className="text-gray-900 font-bold text-lg">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Inspiration</h3>
              <p className="text-gray-300 leading-relaxed">{AboutInfo.story.inspiration}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center mb-4">
                <span className="text-gray-900 font-bold text-lg">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Today</h3>
              <p className="text-gray-300 leading-relaxed">{AboutInfo.story.today}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full mb-6">
            <Package className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-semibold text-yellow-800">What We Offer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Platform Features</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Comprehensive tools designed to empower construction businesses
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {AboutInfo.platformFeatures.map((feature, index) => {
            const IconComponent = featureIcons[feature.title] || Package;
            return (
              <div key={index} className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 border-2 border-yellow-200 hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-yellow-600 rounded-xl flex items-center justify-center mb-4">
                  <IconComponent className="w-7 h-7 text-gray-900" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target Audience */}
      <div className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full mb-6">
              <Users className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-800">Who We Serve</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Built For Industry Leaders</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {AboutInfo.targetAudience.map((audience, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200 flex items-center gap-3 hover:border-yellow-600 transition-all">
                <div className="w-3 h-3 bg-yellow-600 rounded-full flex-shrink-0"></div>
                <span className="text-gray-900 font-medium">{audience}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Commitment CTA */}
      <div className="bg-gradient-to-br from-yellow-600 via-amber-500 to-yellow-600 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 text-gray-900 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Commitment</h2>
          <p className="text-gray-800 text-lg sm:text-xl leading-relaxed mb-8">
            {AboutInfo.commitment}
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-yellow-600 font-bold rounded-xl hover:shadow-2xl transition-all"
          >
            Join Consnect Today
          </Link>
        </div>
      </div>
    </div>
  );
}