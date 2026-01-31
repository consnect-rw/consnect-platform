"use client";

import queryClient from '@/lib/queryClient';
import { deleteCompany, updateCompany } from '@/server/company/company';
import { TAdminCompanyCard } from '@/types/company/company';
import { ECompanyStatus } from '@prisma/client';
import { Building2, CheckCircle2, XCircle, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'VERIFIED':
      return { color: 'bg-green-100 text-green-800', icon: CheckCircle2 };
    case 'PENDING':
      return { color: 'bg-yellow-100 text-yellow-800', icon: Building2 };
    case 'REJECTED':
      return { color: 'bg-red-100 text-red-800', icon: XCircle };
    default:
      return { color: 'bg-gray-100 text-gray-800', icon: Building2 };
  }
};

const AdminCompanyCard = ({
  company,
}: {
  company: TAdminCompanyCard;
}) => {
  const status = company.verification?.status || 'PENDING';
  const { color, icon: StatusIcon } = getStatusConfig(status);

  const onVerify = async() => {
     const res = await updateCompany(company.id, {
          verification:{
               update:{
                    status: ECompanyStatus.VERIFIED
               }
          }
     });

     if(!res) return toast.error("Error verifying company!");
     queryClient.invalidateQueries();
     return toast.success("Company Verified!");
  }

  const onReject = async() => {
     const res = await updateCompany(company.id, {
          verification:{
               update:{
                    status: ECompanyStatus.REJECTED,
                    message: "You do not comply with the requirements."
               }
          }
     });

     if(!res) return toast.error("Error updating company status!");
     queryClient.invalidateQueries();
     return toast.success("Company Rejected!");
     }

     const onDelete = async () => {
          if(confirm("Deleting the company will delete any information related to the company!")){
               const res = await deleteCompany(company.id);
               if(!res) return toast.error("Error deleting company info!");
               queryClient.invalidateQueries();
               return toast.success("Deleted company info successfully");
          }
     }


  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden">
      {/* Header with Logo & Status */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="w-16 h-16 rounded-xl object-cover border border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
              {company.slogan && (
                <p className="text-sm text-gray-600 mt-1 italic">"{company.slogan}"</p>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${color}`}>
            <StatusIcon className="w-5 h-5" />
            <span className="font-semibold text-sm">
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="px-6 space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-500">Handle:</span>
            <span className="ml-2 font-medium text-gray-900">@{company.handle}</span>
          </div>
          <div>
            <span className="text-gray-500">Email:</span>
            <span className="ml-2 font-medium text-gray-700 truncate block max-w-45">
              {company.email}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Location:</span>
            <span className="ml-2 font-medium text-gray-900">
              {company.location
                ? `${company.location.state ? `${company.location.state}, ` : ''}${company.location.country}`
                : 'Not specified'}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Founded:</span>
            <span className="ml-2 font-medium text-gray-900">
              {company.foundedYear || 'N/A'}
            </span>
          </div>
        </div>

        {/* Activity Counts */}
        <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{company._count.offers}</p>
            <p className="text-xs text-gray-500">Offers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{company._count.catalogs}</p>
            <p className="text-xs text-gray-500">Catalogs</p>
          </div>
          {company.partnerInterests && (
            <div className="ml-auto text-sm font-medium text-yellow-700 bg-yellow-50 px-3 py-1 rounded-lg">
              Interested in Partnership
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6 mt-6 flex gap-3">
        <Link href={`/admin/companies/${company.id}`}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition-colors"
        >
          <Eye className="w-4 h-4" />
          View
        </Link>

        {status === 'PENDING' && (
          <>
            <button
              onClick={onVerify}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Verify
            </button>
            <button
              onClick={onReject}
              className="flex items-center justify-center px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </>
        )}

        <button
          onClick={onDelete}
          className="flex items-center justify-center px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-xl transition-colors shadow-sm"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AdminCompanyCard;