"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBanners } from "@/server/banners/banner";
import { BannersContainer } from "@/components/containers/banners/BannersContainer";
import { BannerFormButton } from "@/components/forms/banners/BannerForm";
import { Megaphone, CheckCircle2, XCircle, Clock } from "lucide-react";

const SBannerStats = { id: true, expireAt: true } as const;

export default function AdminBannersPage() {
  const { data } = useQuery({
    queryKey: ["banners-stats"],
    queryFn: () => fetchBanners(SBannerStats, undefined, 1000, 0),
  });

  const banners = data?.data ?? [];
  const total = data?.pagination.total ?? 0;
  const now = new Date();
  const active = banners.filter((b) => b.expireAt && new Date(b.expireAt) > now).length;
  const expired = banners.filter((b) => b.expireAt && new Date(b.expireAt) < now).length;
  const pending = banners.filter((b) => !b.expireAt).length;

  const stats = [
    { label: "Total Banners", value: total, icon: Megaphone, color: "bg-amber-400" },
    { label: "Active", value: active, icon: CheckCircle2, color: "bg-green-400" },
    { label: "Expired", value: expired, icon: XCircle, color: "bg-red-400" },
    { label: "Pending", value: pending, icon: Clock, color: "bg-gray-400" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center">
              <Megaphone className="w-7 h-7 text-gray-900" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900">Manage Banners</h1>
              <p className="text-gray-500 text-sm mt-0.5">Create and manage advertising banners</p>
            </div>
          </div>
          <BannerFormButton showText showIcon size="md" className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 text-sm" />
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

      {/* Banners List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <BannersContainer />
      </div>
    </div>
  );
}