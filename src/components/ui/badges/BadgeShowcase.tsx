"use client";

import { CompanyVerificationBadge } from "./CompanyVerificationBadge";
import { ConsnectBadge } from "./ConsnectBadge";

/**
 * Demo component to showcase all badge variations
 * This can be used for testing or as a reference
 */
export const BadgeShowcase = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Company Verification Badge Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Company Verification Badge
          </h2>
          <p className="text-gray-600 mb-8">
            Shown to all verified companies to build trust with customers
          </p>

          {/* Sizes */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">All Sizes</h3>
            <div className="flex flex-wrap items-end gap-8 p-6 bg-gray-50 rounded-xl">
              <CompanyVerificationBadge size="sm" />
              <CompanyVerificationBadge size="md" />
              <CompanyVerificationBadge size="lg" />
              <CompanyVerificationBadge size="xl" />
            </div>
          </div>

          {/* Variants */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Variants</h3>
            <div className="flex flex-wrap items-center gap-8 p-6 bg-gray-50 rounded-xl">
              <div className="flex flex-col items-center gap-2">
                <CompanyVerificationBadge variant="default" size="lg" />
                <span className="text-xs text-gray-600 font-medium">Default</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CompanyVerificationBadge variant="compact" />
                <span className="text-xs text-gray-600 font-medium">Compact</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CompanyVerificationBadge size="md" showLabel={false} />
                <span className="text-xs text-gray-600 font-medium">No Label</span>
              </div>
            </div>
          </div>
        </div>

        {/* Consnect Badge Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Consnect Partner Badges
          </h2>
          <p className="text-gray-600 mb-8">
            Three-tier badge system for trusted companies
          </p>

          {/* Bronze Badges */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-orange-900 mb-4">
              🥉 Bronze Partner Badge
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Companies with RDB/TIN registration uploaded
            </p>
            <div className="flex flex-wrap items-end gap-8 p-6 bg-orange-50 rounded-xl">
              <ConsnectBadge level="bronze" size="sm" />
              <ConsnectBadge level="bronze" size="md" />
              <ConsnectBadge level="bronze" size="lg" />
              <ConsnectBadge level="bronze" size="xl" />
            </div>
          </div>

          {/* Silver Badges */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              🥈 Silver Partner Badge
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Companies with professional license and verified portfolio
            </p>
            <div className="flex flex-wrap items-end gap-8 p-6 bg-slate-50 rounded-xl">
              <ConsnectBadge level="silver" size="sm" />
              <ConsnectBadge level="silver" size="md" />
              <ConsnectBadge level="silver" size="lg" />
              <ConsnectBadge level="silver" size="xl" />
            </div>
          </div>

          {/* Gold Badges */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-yellow-900 mb-4">
              🥇 Gold Partner Badge
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Premium companies with insurance, financials, and CRB reports
            </p>
            <div className="flex flex-wrap items-end gap-8 p-6 bg-yellow-50 rounded-xl">
              <ConsnectBadge level="gold" size="sm" />
              <ConsnectBadge level="gold" size="md" />
              <ConsnectBadge level="gold" size="lg" />
              <ConsnectBadge level="gold" size="xl" />
            </div>
          </div>

          {/* All Variants */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">All Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Default */}
              <div className="p-6 bg-gray-50 rounded-xl">
                <p className="text-sm font-bold text-gray-700 mb-4">Default (Full)</p>
                <div className="flex flex-col items-center gap-4">
                  <ConsnectBadge level="bronze" variant="default" size="md" />
                  <ConsnectBadge level="silver" variant="default" size="md" />
                  <ConsnectBadge level="gold" variant="default" size="md" />
                </div>
              </div>

              {/* Compact */}
              <div className="p-6 bg-gray-50 rounded-xl">
                <p className="text-sm font-bold text-gray-700 mb-4">Compact (Inline)</p>
                <div className="flex flex-col items-start gap-4">
                  <ConsnectBadge level="bronze" variant="compact" />
                  <ConsnectBadge level="silver" variant="compact" />
                  <ConsnectBadge level="gold" variant="compact" />
                </div>
              </div>

              {/* Minimal */}
              <div className="p-6 bg-gray-50 rounded-xl">
                <p className="text-sm font-bold text-gray-700 mb-4">Minimal (Small)</p>
                <div className="flex flex-col items-start gap-4">
                  <ConsnectBadge level="bronze" variant="minimal" />
                  <ConsnectBadge level="silver" variant="minimal" />
                  <ConsnectBadge level="gold" variant="minimal" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Usage Examples
          </h2>
          <p className="text-gray-600 mb-8">
            See how badges look in real contexts
          </p>

          {/* Company Card Example */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">On Company Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 relative">
                <div className="absolute top-4 right-4">
                  <ConsnectBadge level="gold" variant="minimal" />
                </div>
                <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4"></div>
                <h4 className="font-bold text-gray-900 mb-2">Company Name</h4>
                <p className="text-sm text-gray-600">Construction & Engineering</p>
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 relative">
                <div className="absolute top-4 right-4">
                  <CompanyVerificationBadge variant="compact" />
                </div>
                <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4"></div>
                <h4 className="font-bold text-gray-900 mb-2">Company Name</h4>
                <p className="text-sm text-gray-600">Architecture Services</p>
              </div>
            </div>
          </div>

          {/* Header Example */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">In Company Profile Header</h3>
            <div className="bg-gray-100 rounded-xl p-8">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gray-300 rounded-xl"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">Premium Construction Ltd</h3>
                    <ConsnectBadge level="gold" variant="compact" />
                  </div>
                  <p className="text-gray-600">Leading construction company in Rwanda</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
