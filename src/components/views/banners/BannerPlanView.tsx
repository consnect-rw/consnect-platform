"use client";

import { fetchBannerPlanById } from "@/server/banners/banner-plan";
import { updateBannerPlan } from "@/server/banners/banner-plan";
import { SBannerPlan, TBannerPlan } from "@/types/banners/banner-plan";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useState } from "react";
import { X, LayoutTemplate, CheckCircle2, XCircle, Clock, Layers, DollarSign, Ruler, MapPin, RotateCcw, Eye, Pencil, Plus, Trash2, AlignVerticalSpaceAround } from "lucide-react";
import { BannerPlanFormButton } from "@/components/forms/banners/BannerPlanForm";
import { BannerFormButton } from "@/components/forms/banners/BannerForm";
import { BannersContainer } from "@/components/containers/banners/BannersContainer";
import { toast } from "sonner";
import queryClient from "@/lib/queryClient";

// ─── Plan detail view ────────────────────────────────────────────────────────
export const BannerPlanView = ({ planId }: { planId: string }) => {
  const { data: plan, isLoading } = useQuery({
    queryKey: ["banner-plan", planId],
    queryFn: () => fetchBannerPlanById(planId, SBannerPlan),
    enabled: !!planId,
  });

  const handleToggleActive = async () => {
    if (!plan) return;
    const res = await updateBannerPlan(planId, { isActive: !plan.isActive });
    if (res) {
      toast.success(`Plan ${res.isActive ? "activated" : "deactivated"}`);
      await queryClient.invalidateQueries();
    } else {
      toast.error("Failed to update plan status");
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!plan) return <div className="text-center py-20 text-gray-400">Plan not found</div>;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <LayoutTemplate className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900">{plan.name}</h2>
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 ${plan.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              {plan.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              {plan.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        {/* CTAs */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          <BannerFormButton planId={planId} showText={false} showIcon size="sm" className="bg-gray-900! hover:bg-gray-800 from-gray-900! to-gray-900!" />
          <BannerPlanFormButton planId={planId} showText={false} showIcon size="sm" />
          <button
            type="button"
            onClick={handleToggleActive}
            className={`p-2 rounded-lg text-xs font-bold transition-colors ${plan.isActive ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
            title={plan.isActive ? "Deactivate" : "Activate"}
          >
            {plan.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Description */}
      {plan.description && (
        <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">{plan.description}</p>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: DollarSign, label: "Price", value: `${plan.currency} ${plan.price}`, color: "amber" },
          { icon: Clock, label: "Duration", value: `${plan.duration} ${plan.durationUnit}`, color: "blue" },
          { icon: Ruler, label: "Dimensions", value: `${plan.width} × ${plan.height}px`, color: "purple" },
          { icon: MapPin, label: "Location", value: plan.location.charAt(0) + plan.location.slice(1).toLowerCase(), color: "green" },
          { icon: RotateCcw, label: "Orientation", value: plan.orientation.charAt(0) + plan.orientation.slice(1).toLowerCase(), color: "orange" },
          { icon: Layers, label: "Banners", value: String(plan._count.banners), color: "gray" },
          ...(plan.pagePosition ? [{ icon: AlignVerticalSpaceAround, label: "Page Position", value: plan.pagePosition, color: "pink" }] : []),
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className={`bg-${color}-50 rounded-xl px-4 py-3 border border-${color}-100`}>
            <div className="flex items-center gap-2 mb-0.5">
              <Icon className={`w-4 h-4 text-${color}-500`} />
              <span className={`text-xs font-semibold text-${color}-600`}>{label}</span>
            </div>
            <p className="text-sm font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Benefits */}
      {plan.benefits.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-2">Benefits</h3>
          <div className="flex flex-wrap gap-2">
            {plan.benefits.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> {b}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Banners in this plan */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-700">Banners ({plan._count.banners})</h3>
          <BannerFormButton planId={planId} showText showIcon={false} size="sm" />
        </div>
        <BannersContainer planId={planId} compact />
      </div>
    </div>
  );
};

// ─── Drawer button ────────────────────────────────────────────────────────────
export const BannerPlanViewBtn = ({
  planId,
  showText = true,
  showIcon = true,
  size = "md",
}: {
  planId: string;
  showText?: boolean;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}) => {
  const [open, setOpen] = useState(false);
  const sizeClasses = size === "sm" ? "p-1.5 text-xs" : size === "lg" ? "p-3 text-base" : "p-2 text-sm";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex items-center gap-1.5 rounded-lg font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors ${sizeClasses}`}
      >
        {showIcon && <Eye className="w-4 h-4" />}
        {showText && "View"}
      </button>

      {/* Right-side Drawer */}
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div className="fixed inset-y-0 right-0 w-full lg:w-[70%] bg-white shadow-2xl flex flex-col animate-slide-in-right">
          {/* Drawer header */}
          <div className="flex items-center justify-between px-6 py-4 border-b-2 border-gray-100 shrink-0">
            <div className="flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-amber-500" />
              <span className="font-black text-gray-900">Plan Details</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Drawer body */}
          <div className="flex-1 overflow-y-auto p-6">
            <BannerPlanView planId={planId} />
          </div>
        </div>
      </Dialog>
    </>
  );
};