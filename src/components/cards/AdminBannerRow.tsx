"use client";
import { updateBanner, deleteBanner } from "@/server/banners/banner";
import { BannerFormButton } from "@/components/forms/banners/BannerForm";
import { BannerViewBtn } from "@/components/views/banners/BannerView";
import queryClient from "@/lib/queryClient";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Trash2, CalendarClock, Building2, User2, ExternalLink, Clock } from "lucide-react";
import Image from "../ui/Image";
import { TBanner } from "@/types/banners/banner";


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

const StatusBadge = ({ expireAt }: { expireAt: Date | null }) => {
  if (!expireAt) return (
    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
      <Clock className="w-3 h-3" /> Pending
    </span>
  );
  const now = new Date();
  const expired = new Date(expireAt) < now;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${expired ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
      {expired ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
      {expired ? "Expired" : `Active · ${new Date(expireAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
    </span>
  );
};

export const AdminBannerRow = ({ banner }: { banner: TBanner }) => {
  const isPending = !banner.expireAt;
  const isExpired = banner.expireAt ? new Date(banner.expireAt) < new Date() : false;
  const plan = banner.plan;

  const handleActivate = async () => {
    if (!plan) return toast.error("Banner has no plan");
    const expireAt = addDuration(plan.duration, plan.durationUnit);
    const res = await updateBanner(banner.id, { expireAt });
    if (res) {
      toast.success("Banner activated");
      await queryClient.invalidateQueries();
    } else toast.error("Failed to activate banner");
  };

  const handleDeactivate = async () => {
    const res = await updateBanner(banner.id, { expireAt: new Date() });
    if (res) {
      toast.success("Banner deactivated");
      await queryClient.invalidateQueries();
    } else toast.error("Failed to deactivate banner");
  };

  const handleDelete = async () => {
    if (!confirm(`Delete banner "${banner.title}"? This cannot be undone.`)) return;
    const res = await deleteBanner(banner.id);
    if (res) {
      toast.success("Banner deleted");
      await queryClient.invalidateQueries();
    } else toast.error("Failed to delete banner");
  };

  return (
    <div className={`bg-white rounded-xl border hover:shadow-md transition-all flex items-center gap-4 p-4 ${isExpired ? "border-red-200 opacity-75" : isPending ? "border-gray-200" : "border-gray-200"}`}>
      {/* Thumbnail */}
      <div className="shrink-0 w-20 h-14 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
        {banner.imageUrl ? (
          <Image src={banner.imageUrl} alt={banner.title} width={80} height={56} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h4 className="font-bold text-gray-900 text-sm truncate">{banner.title}</h4>
          <StatusBadge expireAt={banner.expireAt} />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
          {plan && (
            <span className="flex items-center gap-1">
              <CalendarClock className="w-3.5 h-3.5 text-amber-500" />
              {plan.name}
            </span>
          )}
          {banner.company && (
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-blue-500" />
              {banner.company.name}
            </span>
          )}
          {banner.user && !banner.company && (
            <span className="flex items-center gap-1">
              <User2 className="w-3.5 h-3.5 text-purple-500" />
              {banner.user.name}
            </span>
          )}
          {banner.destinationUrl && (
            <a href={banner.destinationUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-amber-600 transition-colors max-w-45 truncate">
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{banner.destinationUrl.replace(/^https?:\/\//, "")}</span>
            </a>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="shrink-0 flex items-center gap-2">
        <BannerViewBtn bannerId={banner.id} showText={false} showIcon size="sm" />
        <BannerFormButton bannerId={banner.id} showText={false} showIcon size="sm" />
        {(isExpired || isPending) && plan ? (
          <button
            type="button"
            onClick={handleActivate}
            className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
            title="Activate"
          >
            <CheckCircle2 className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleDeactivate}
            className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
            title="Deactivate"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={handleDelete}
          className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
