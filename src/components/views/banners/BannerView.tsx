"use client";

import { fetchBannerById } from "@/server/banners/banner";
import { SBanner } from "@/types/banners/banner";
import { updateBanner, deleteBanner } from "@/server/banners/banner";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useState } from "react";
import { X, Eye, CheckCircle2, XCircle, Trash2, CalendarClock, Building2, User2, ExternalLink, LayoutTemplate } from "lucide-react";
import { BannerFormButton } from "@/components/forms/banners/BannerForm";
import queryClient from "@/lib/queryClient";
import { toast } from "sonner";
import Image from "@/components/ui/Image";

const addDuration = (duration: number, unit: string): Date => {
  const d = new Date();
  switch (unit.toLowerCase()) {
    case "day": case "days": d.setDate(d.getDate() + duration); break;
    case "week": case "weeks": d.setDate(d.getDate() + duration * 7); break;
    case "month": case "months": d.setMonth(d.getMonth() + duration); break;
    case "year": case "years": d.setFullYear(d.getFullYear() + duration); break;
  }
  return d;
};

export const BannerView = ({ bannerId }: { bannerId: string }) => {
  const { data: banner, isLoading } = useQuery({
    queryKey: ["banner", bannerId],
    queryFn: () => fetchBannerById(bannerId, SBanner),
    enabled: !!bannerId,
  });

  const handleActivate = async () => {
    if (!banner?.plan) return toast.error("Banner has no plan");
    const expireAt = addDuration(banner.plan.duration, banner.plan.durationUnit);
    const res = await updateBanner(bannerId, { expireAt });
    if (res) { toast.success("Banner activated"); await queryClient.invalidateQueries(); }
    else toast.error("Failed to activate banner");
  };

  const handleDeactivate = async () => {
    const res = await updateBanner(bannerId, { expireAt: new Date() });
    if (res) { toast.success("Banner deactivated"); await queryClient.invalidateQueries(); }
    else toast.error("Failed to deactivate banner");
  };

  const handleDelete = async () => {
    if (!banner) return;
    if (!confirm(`Delete banner "${banner.title}"?`)) return;
    const res = await deleteBanner(bannerId);
    if (res) { toast.success("Banner deleted"); await queryClient.invalidateQueries(); }
    else toast.error("Failed to delete banner");
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!banner) return <div className="text-center py-20 text-gray-400">Banner not found</div>;

  const isExpired = banner.expireAt ? new Date(banner.expireAt) < new Date() : false;
  const plan = banner.plan;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-gray-900">{banner.title}</h2>
          {banner.expireAt ? (
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 ${isExpired ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
              {isExpired ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              {isExpired ? "Expired" : `Active until ${new Date(banner.expireAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 bg-blue-100 text-blue-600">
              <CheckCircle2 className="w-3.5 h-3.5" /> No Expiry Set
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <BannerFormButton bannerId={bannerId} showText={false} showIcon size="sm" className="bg-gray-900! hover:bg-gray-800 from-gray-900! to-gray-900!" />
          {(isExpired || !banner.expireAt) && plan ? (
            <button type="button" onClick={handleActivate} className="flex items-center gap-1.5 py-1.5 px-3 text-xs rounded-lg font-bold bg-green-600 hover:bg-green-700 text-white transition-colors">
              <CheckCircle2 className="w-3.5 h-3.5" /> Activate
            </button>
          ) : (
            <button type="button" onClick={handleDeactivate} className="flex items-center gap-1.5 py-1.5 px-3 text-xs rounded-lg font-bold bg-amber-500 hover:bg-amber-600 text-white transition-colors">
              <XCircle className="w-3.5 h-3.5" /> Deactivate
            </button>
          )}
          <button type="button" onClick={handleDelete} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Banner Image */}
      {banner.imageUrl && plan && (
        <div className="flex justify-center bg-gray-50 rounded-xl border border-gray-200 p-3">
          <div
            className="rounded-lg overflow-hidden"
            style={{
              aspectRatio: `${plan.width}/${plan.height}`,
              maxHeight: "55vh",
              width: plan.height > plan.width ? "auto" : "100%",
            }}
          >
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              width={plan.width}
              height={plan.height}
              className="w-full h-full object-cover"
              style={{ maxHeight: "55vh" }}
            />
          </div>
        </div>
      )}
      {!banner.imageUrl && (
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 h-40 flex items-center justify-center text-gray-400 text-sm font-medium">
          No image uploaded
        </div>
      )}

      {/* Meta Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {plan && (
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <div className="flex items-center gap-2 mb-2">
              <LayoutTemplate className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-black text-amber-700 uppercase tracking-wide">Plan</span>
            </div>
            <p className="font-bold text-gray-900">{plan.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{plan.width}×{plan.height}px · {plan.location} · {plan.orientation}</p>
            {plan.pagePosition && <p className="text-xs text-pink-500 font-medium mt-0.5">{plan.pagePosition}</p>}
          </div>
        )}
        {banner.destinationUrl && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-black text-gray-500 uppercase tracking-wide">Destination</span>
            </div>
            <a href={banner.destinationUrl} target="_blank" rel="noreferrer" className="text-sm text-amber-600 hover:underline font-medium break-all">
              {banner.destinationUrl}
            </a>
          </div>
        )}
        {banner.company && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-black text-gray-500 uppercase tracking-wide">Company</span>
            </div>
            <p className="font-bold text-gray-900">{banner.company.name}</p>
          </div>
        )}
        {banner.user && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <User2 className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-black text-gray-500 uppercase tracking-wide">Owner</span>
            </div>
            <p className="font-bold text-gray-900">{banner.user.name}</p>
          </div>
        )}
        {banner.expireAt && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <CalendarClock className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-black text-gray-500 uppercase tracking-wide">Expiry</span>
            </div>
            <p className={`font-bold ${isExpired ? "text-red-600" : "text-gray-900"}`}>
              {new Date(banner.expireAt).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── View Button ─────────────────────────────────────────────────────────────
export const BannerViewBtn = ({
  bannerId,
  showText = true,
  showIcon = true,
  size = "md",
}: {
  bannerId: string;
  showText?: boolean;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}) => {
  const [open, setOpen] = useState(false);
  const sizes = { sm: "py-1 px-2 text-xs gap-1", md: "py-2 px-4 text-sm gap-1.5", lg: "py-2.5 px-5 text-base gap-2" };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex items-center rounded-lg font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors ${sizes[size]}`}
      >
        {showIcon && <Eye className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />}
        {showText && "View"}
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-y-0 right-0 w-full lg:w-[70%] bg-white shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-black text-gray-900">Banner Details</h2>
            <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <DialogPanel className="flex-1 overflow-y-auto p-6">
            <BannerView bannerId={bannerId} />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};
