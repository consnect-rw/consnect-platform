"use client";

import { useAuth } from '@/hooks/useAuth';
import { Shield, CheckCircle, Clock, XCircle, AlertCircle, Building2, Award, Zap, TrendingUp, ChevronRight } from 'lucide-react';
import { checkCompanyCompletion } from '@/server/company/verification';
import { useQuery } from '@tanstack/react-query';



export default function CompanyVerification() {
  const { user } = useAuth();
  const { data: completionStatus, isLoading } = useQuery({
    queryKey: ['company-completion', user?.company?.id],
    queryFn: () => checkCompanyCompletion(user?.company?.id ?? ""),
    enabled: !!user?.company?.id,
  });

  if (!user?.company) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Company Profile</h3>
            <p className="text-sm text-gray-600 mb-4">
              Add your company information to start using Consnect features.
            </p>
            <a
              href="/dashboard/settings"
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold text-sm rounded-lg transition-colors"
            >
              <Building2 className="w-4 h-4" />
              Add Company
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
          <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-40 mb-3"></div>
        <div className="h-4 bg-gray-100 rounded w-full mb-4"></div>
        <div className="h-32 bg-gray-100 rounded"></div>
      </div>
    );
  }

  const verification = user.company.verification;
  const status = verification?.status || 'PENDING';

  const getBadgeIcon = (earned: boolean) => {
    if (!earned) return null;
    return <Award className="w-4 h-4" />;
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'VERIFIED':
        return {
          icon: CheckCircle,
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          badge: 'bg-green-100 text-green-700',
          title: 'Verified Company',
          description: 'Your company has been successfully verified',
        };
      case 'REJECTED':
        return {
          icon: XCircle,
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          badge: 'bg-red-100 text-red-700',
          title: 'Verification Rejected',
          description: 'Your company verification was not approved',
        };
      default:
        return {
          icon: Clock,
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          badge: 'bg-yellow-100 text-yellow-700',
          title: 'Verification Pending',
          description: 'Your company is being reviewed',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 ${config.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
            <Icon className={`w-7 h-7 ${config.iconColor}`} />
          </div>
          <div className={`px-3 py-1.5 rounded-full ${config.badge} text-xs font-bold flex items-center gap-1.5`}>
            <div className={`w-2 h-2 rounded-full ${config.iconColor.replace('text-', 'bg-')}`}></div>
            {status}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{config.title}</h3>
          <p className="text-sm text-gray-600">{config.description}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Company Info Card */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <Building2 className="w-5 h-5 text-yellow-600 shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Your Company</p>
            <p className="text-base font-bold text-gray-900">{user.company.name}</p>
            {user.company.location && (
              <p className="text-xs text-gray-600 mt-1">
                📍 {user.company.location.city}, {user.company.location.country}
              </p>
            )}
          </div>
        </div>

        {/* Completion Progress */}
        {completionStatus && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-bold text-gray-900">Profile Completion</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{completionStatus.overallPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${getCompletionColor(completionStatus.overallPercentage)}`}
                  style={{ width: `${completionStatus.overallPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Badge Status */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Bronze', earned: completionStatus.badges.bronze.earned },
                { name: 'Silver', earned: completionStatus.badges.silver.earned },
                { name: 'Gold', earned: completionStatus.badges.gold.earned },
              ].map((badge) => (
                <div
                  key={badge.name}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    badge.earned
                      ? 'bg-yellow-50 border-yellow-400'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    {badge.earned && <Award className="w-4 h-4 text-yellow-600" />}
                    <span className={`text-xs font-bold ${badge.earned ? 'text-yellow-700' : 'text-gray-600'}`}>
                      {badge.name}
                    </span>
                  </div>
                  <p className={`text-xs text-center ${badge.earned ? 'text-yellow-600' : 'text-gray-500'}`}>
                    {badge.earned ? '✓ Earned' : 'Locked'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verification Message */}
        {verification?.message && (
          <div
            className={`p-4 rounded-lg border-l-4 ${
              status === 'REJECTED'
                ? 'bg-red-50 border-l-red-500'
                : status === 'PENDING'
                ? 'bg-yellow-50 border-l-yellow-500'
                : 'bg-green-50 border-l-green-500'
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertCircle
                className={`w-5 h-5 mt-0.5 shrink-0 ${
                  status === 'REJECTED'
                    ? 'text-red-600'
                    : status === 'PENDING'
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}
              />
              <p className="text-sm font-medium text-gray-800 leading-relaxed">{verification.message}</p>
            </div>
          </div>
        )}

        {/* Completion Parts */}
        {completionStatus && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-600" />
              Completion Status
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {completionStatus.parts.map((part) => (
                <div
                  key={part.id}
                  className={`p-3 rounded-lg border transition-all ${
                    part.isComplete
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-900">{part.name}</span>
                    <span
                      className={`text-xs font-bold ${
                        part.isComplete ? 'text-green-700' : 'text-gray-600'
                      }`}
                    >
                      {part.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full transition-all ${
                        part.isComplete ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${part.percentage}%` }}
                    ></div>
                  </div>
                  {!part.isComplete && part.missing.length > 0 && (
                    <p className="text-xs text-gray-600">
                      Missing: {part.missing.length} item{part.missing.length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Step */}
        {completionStatus && (
          <div className="p-4 bg-linear-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-3">
              <ChevronRight className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs uppercase font-bold text-yellow-700 tracking-wide mb-1">Next Step</p>
                <p className="text-sm font-medium text-gray-900">{completionStatus.nextStep}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          {status === 'REJECTED' && (
            <button className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-sm rounded-lg transition-colors">
              Resubmit Verification
            </button>
          )}
          <a
            href="/dashboard/settings"
            className="flex-1 px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-lg transition-colors text-center"
          >
            Edit Profile
          </a>
        </div>

        {/* Last Updated */}
        {status === 'PENDING' && verification?.updatedAt && (
          <p className="text-xs text-gray-500 text-center pt-2">
            Last updated: {new Date(verification.updatedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        )}

        {status === 'VERIFIED' && (
          <div className="flex items-center justify-center gap-2 py-3 px-4 bg-green-50 rounded-lg border border-green-200">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-xs font-bold text-green-700">Trusted Partner on Consnect</span>
          </div>
        )}
      </div>
    </div>
  );
}