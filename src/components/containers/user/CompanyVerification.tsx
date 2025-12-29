"use client";

import { useAuth } from '@/hooks/useAuth';
import { Shield, CheckCircle, Clock, XCircle, AlertCircle, Building2 } from 'lucide-react';



export default function CompanyVerification() {
  const { user } = useAuth(); 

  if (!user?.company) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-gray-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Company Profile</h3>
            <p className="text-sm text-gray-600 mb-4">
              Add your company information to start using Consnect features.
            </p>
            <a
              href="/dashboard/settings"
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold text-sm rounded-lg transition-colors"
            >
              <Building2 className="w-4 h-4" />
              Add Company
            </a>
          </div>
        </div>
      </div>
    );
  }

  const verification = user.company.verification;
  const status = verification?.status || 'PENDING';

  const statusConfig = {
    PENDING: {
      icon: Clock,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      badge: 'bg-yellow-100 text-yellow-700',
      title: 'Verification Pending',
      description: 'Your company verification is under review',
    },
    VERIFIED: {
      icon: CheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      badge: 'bg-green-100 text-green-700',
      title: 'Verified Company',
      description: 'Your company has been successfully verified',
    },
    REJECTED: {
      icon: XCircle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      badge: 'bg-red-100 text-red-700',
      title: 'Verification Rejected',
      description: 'Your company verification was not approved',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header with Icon and Status Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${config.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </div>
        <div className={`px-3 py-1 rounded-full ${config.badge} text-xs font-semibold flex items-center gap-1.5`}>
          <div className={`w-1.5 h-1.5 rounded-full ${config.iconColor.replace('text-', 'bg-')}`}></div>
          {status}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{config.title}</h3>
          <p className="text-sm text-gray-600">{config.description}</p>
        </div>

        {/* Company Info */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-900">{user.company.name}</span>
          </div>
          {user.company.location && (
            <p className="text-xs text-gray-600 ml-6">
              {user.company.location.city}, {user.company.location.country}
            </p>
          )}
        </div>

        {/* Verification Message */}
        {verification?.message && (
          <div className={`p-3 rounded-lg ${
            status === 'REJECTED' ? 'bg-red-50 border border-red-100' :
            status === 'PENDING' ? 'bg-yellow-50 border border-yellow-100' :
            'bg-green-50 border border-green-100'
          }`}>
            <div className="flex items-start gap-2">
              <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                status === 'REJECTED' ? 'text-red-600' :
                status === 'PENDING' ? 'text-yellow-600' :
                'text-green-600'
              }`} />
              <p className="text-xs text-gray-700 leading-relaxed">{verification.message}</p>
            </div>
          </div>
        )}

        {/* Action Button */}
        {status === 'REJECTED' && (
          <button className="w-full mt-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold text-sm rounded-lg transition-colors">
            Resubmit Verification
          </button>
        )}

        {status === 'PENDING' && verification?.updatedAt && (
          <p className="text-xs text-gray-500 mt-2">
            Last updated: {new Date(verification.updatedAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        )}

        {status === 'VERIFIED' && (
          <div className="flex items-center gap-2 mt-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-700">
              Trusted Partner on Consnect
            </span>
          </div>
        )}
      </div>
    </div>
  );
}