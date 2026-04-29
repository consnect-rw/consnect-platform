"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBannerPlans } from "@/server/banners/banner-plan";
import { BannerPlansContainer } from "@/components/containers/banners/BannerPlansContainer";
import { BannerPlanFormButton } from "@/components/forms/banners/BannerPlanForm";
import { LayoutTemplate, CheckCircle2, XCircle, Layers } from "lucide-react";

const SStats = { id: true, isActive: true, _count: { select: { banners: true } } } as const;

export default function AdminBannerPlansPage() {
  const { data } = useQuery({
    queryKey: ["banner-plans-stats"],
    queryFn: () => fetchBannerPlans(SStats, undefined, 1000, 0),
  });

  const plans = data?.data ?? [];
  const total = data?.pagination.total ?? 0;
  const active = plans.filter((p) => p.isActive).length;
  const inactive = plans.filter((p) => !p.isActive).length;
  const totalBanners = plans.reduce((acc, p) => acc + p._count.banners, 0);

  const stats = [
    { label: "Total Plans", value: total, icon: LayoutTemplate, color: "bg-amber-400" },
    { label: "Active Plans", value: active, icon: CheckCircle2, color: "bg-green-400" },
    { label: "Inactive Plans", value: inactive, icon: XCircle, color: "bg-gray-400" },
    { label: "Total Banners", value: totalBanners, icon: Layers, color: "bg-blue-400" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center">
              <LayoutTemplate className="w-7 h-7 text-gray-900" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900">Banner Plans</h1>
              <p className="text-gray-500 text-sm mt-0.5">Manage advertising plan packages</p>
            </div>
          </div>
          <BannerPlanFormButton showText showIcon size="md" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-11 h-11 ${s.color} rounded-xl flex items-center justify-center shrink-0`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Plans Grid */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <BannerPlansContainer />
      </div>
    </div>
  );
}