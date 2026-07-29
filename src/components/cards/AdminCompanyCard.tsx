"use client";

import queryClient from '@/lib/queryClient';
import { deleteCompany, updateCompany } from '@/server/company/company';
import { TAdminCompanyCard } from '@/types/company/company';
import { ECompanyStatus } from '@prisma/client';
import { Building2, CheckCircle2, XCircle, Eye, Trash2, MapPin, Mail, Calendar, Package, Tag, Handshake, Clock } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'VERIFIED':
      return { color: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', dot: 'bg-emerald-500', icon: CheckCircle2 };
    case 'PENDING':
      return { color: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200', dot: 'bg-amber-500', icon: Clock };
    case 'REJECTED':
      return { color: 'bg-red-50 text-red-700 ring-1 ring-red-200', dot: 'bg-red-500', icon: XCircle };
    default:
      return { color: 'bg-gray-100 text-gray-700 ring-1 ring-gray-200', dot: 'bg-gray-400', icon: Building2 };
  }
};

const AdminCompanyCard = ({
  company,
}: {
  company: TAdminCompanyCard;
}) => {
  const status = company.verification?.status || 'PENDING';
  const { color, dot, icon: StatusIcon } = getStatusConfig(status);

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
    <div className="group bg-white rounded-2xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-xl hover:shadow-gray-200/60 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Top accent bar */}
      <div className={`h-1 w-full ${status === 'VERIFIED' ? 'bg-emerald-400' : status === 'REJECTED' ? 'bg-red-400' : 'bg-amber-400'}`} />

      {/* Header with Logo & Status */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="w-14 h-14 rounded-xl object-cover border border-gray-200 shrink-0 shadow-sm"
              />
            ) : (
              <div className="w-14 h-14 bg-linear-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-lg font-black text-gray-900 truncate">{company.name}</h3>
              <p className="text-xs font-semibold text-gray-400">@{company.handle}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`shrink-0 px-2.5 py-1.5 rounded-full flex items-center gap-1.5 ${color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            <span className="font-bold text-xs uppercase tracking-wide">
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </span>
          </div>
        </div>

        {company.slogan && (
          <p className="text-sm text-gray-500 italic border-l-2 border-gray-200 pl-3 mb-1 line-clamp-1">&ldquo;{company.slogan}&rdquo;</p>
        )}
      </div>

      {/* Details */}
      <div className="px-5 pb-4 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm bg-gray-50/70 rounded-xl p-3.5 border border-gray-100">
          <div className="flex items-center gap-2 min-w-0">
            <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="font-medium text-gray-700 truncate">{company.email}</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="font-medium text-gray-700 truncate">
              {company.location
                ? `${company.location.state ? `${company.location.state}, ` : ''}${company.location.country}`
                : 'Not specified'}
            </span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="font-medium text-gray-700">
              Founded {company.foundedYear || 'N/A'}
            </span>
          </div>
          {company.partnerInterests && (
            <div className="flex items-center gap-2 min-w-0">
              <Handshake className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="font-bold text-amber-700 text-xs uppercase tracking-wide">Open to Partnership</span>
            </div>
          )}
        </div>

        {/* Activity Counts */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex-1 flex items-center gap-2 bg-blue-50/70 rounded-xl px-3 py-2.5 border border-blue-100">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <Tag className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-black text-gray-900 leading-none">{company._count.offers}</p>
              <p className="text-[11px] font-semibold text-gray-500 mt-0.5">Offers</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-2 bg-violet-50/70 rounded-xl px-3 py-2.5 border border-violet-100">
            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
              <Package className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <p className="text-lg font-black text-gray-900 leading-none">{company._count.catalogs}</p>
              <p className="text-[11px] font-semibold text-gray-500 mt-0.5">Catalogs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 pb-5 flex gap-2">
        <Link href={`/admin/companies/${company.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-xl transition-colors"
        >
          <Eye className="w-4 h-4" />
          View
        </Link>

        {status === 'PENDING' && (
          <>
            <button
              onClick={onVerify}
              title="Verify company"
              className="flex items-center justify-center px-3 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
            <button
              onClick={onReject}
              title="Reject company"
              className="flex items-center justify-center px-3 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold text-sm rounded-xl transition-colors"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </>
        )}

        <button
          onClick={onDelete}
          title="Delete company"
          className="flex items-center justify-center px-3 py-2.5 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 font-bold text-sm rounded-xl transition-colors border border-gray-200 hover:border-red-200"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AdminCompanyCard;