"use client";

import { TBannerPlan } from "@/types/banners/banner-plan";
import { updateBannerPlan, deleteBannerPlan } from "@/server/banners/banner-plan";
import { BannerPlanFormButton } from "@/components/forms/banners/BannerPlanForm";
import { BannerFormButton } from "@/components/forms/banners/BannerForm";
import { BannerPlanViewBtn } from "@/components/views/banners/BannerPlanView";
import queryClient from "@/lib/queryClient";
import { toast } from "sonner";
import {
  LayoutTemplate, CheckCircle2, XCircle, DollarSign,
  Clock, Ruler, MapPin, Layers, Trash2, AlignVerticalSpaceAround,
} from "lucide-react";

export const AdminBannerPlanCard = ({ plan }: { plan: TBannerPlan }) => {
  const handleToggleActive = async () => {
    const res = await updateBannerPlan(plan.id, { isActive: !plan.isActive });
    if (res) {
      toast.success(`Plan ${res.isActive ? "activated" : "deactivated"}`);
      await queryClient.invalidateQueries();
    } else {
      toast.error("Failed to update plan status");
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete plan "${plan.name}"? This cannot be undone.`)) return;
    const res = await deleteBannerPlan(plan.id);
    if (res) {
      toast.success("Plan deleted");
      await queryClient.invalidateQueries();
    } else {
      toast.error("Failed to delete plan");
    }
  };

  return (
    <div className={`bg-white rounded-2xl border-2 shadow-sm hover:shadow-md transition-all flex flex-col ${plan.isActive ? "border-gray-200" : "border-dashed border-gray-300 opacity-75"}`}>
      {/* Card Header */}
      <div className="p-5 pb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <LayoutTemplate className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-black text-gray-900 text-base leading-tight">{plan.name}</h3>
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${plan.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              {plan.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              {plan.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        {/* Banner count badge */}
        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full shrink-0 border border-amber-200">
          <Layers className="w-3.5 h-3.5" />
          {plan._count.banners} {plan._count.banners === 1 ? "banner" : "banners"}
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 py-3 grid grid-cols-2 gap-2 border-t border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <DollarSign className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="font-bold">{plan.currency} {plan.price}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Clock className="w-4 h-4 text-blue-500 shrink-0" />
          <span>{plan.duration} {plan.durationUnit}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Ruler className="w-4 h-4 text-purple-500 shrink-0" />
          <span>{plan.width}×{plan.height}px</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPin className="w-4 h-4 text-green-500 shrink-0" />
          <span>{plan.location.charAt(0) + plan.location.slice(1).toLowerCase()}</span>
        </div>
        {plan.pagePosition && (
          <div className="flex items-center gap-2 text-sm text-gray-700 col-span-2">
            <AlignVerticalSpaceAround className="w-4 h-4 text-pink-500 shrink-0" />
            <span className="truncate">{plan.pagePosition}</span>
          </div>
        )}
      </div>

      {/* Benefits preview */}
      {plan.benefits.length > 0 && (
        <div className="px-5 py-3 flex flex-wrap gap-1.5">
          {plan.benefits.slice(0, 3).map((b, i) => (
            <span key={i} className="text-xs bg-amber-50 text-amber-600 font-medium px-2 py-0.5 rounded-full">{b}</span>
          ))}
          {plan.benefits.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-500 font-medium px-2 py-0.5 rounded-full">+{plan.benefits.length - 3} more</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="px-5 py-3 mt-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BannerPlanViewBtn planId={plan.id} showText={false} showIcon size="sm" />
          <BannerPlanFormButton planId={plan.id} showText={false} showIcon size="sm" />
          <BannerFormButton planId={plan.id} showIcon size="sm"
            className="flex items-center gap-1.5 py-1 px-2 text-xs rounded-lg font-semibold bg-gray-900 hover:bg-gray-800 from-gray-900! to-gray-900! text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleActive}
            className={`p-1.5 rounded-lg transition-colors text-xs font-bold ${plan.isActive ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
            title={plan.isActive ? "Deactivate" : "Activate"}
          >
            {plan.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
            title="Delete plan"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
