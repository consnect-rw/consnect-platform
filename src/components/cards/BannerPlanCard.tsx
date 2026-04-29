"use client";
import { useState } from "react";
import {
  CheckCircle2, ChevronDown, ChevronUp, MessageCircle,
  Monitor, Smartphone, Square, MapPin, LayoutGrid, Layers,
  Clock, Ruler
} from "lucide-react";
import { TBannerPlan } from "@/types/banners/banner-plan";

const WHATSAPP_NUMBER = "250789407079";

function buildWhatsAppLink(planName: string) {
  const msg = encodeURIComponent(
    `Hi Consnect! 👋 I'm interested in the *${planName}* banner advertising plan. Please share more details.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

function orientationIcon(o: string) {
  if (o === "VERTICAL") return <Smartphone className="w-4 h-4" />;
  if (o === "SQUARE") return <Square className="w-4 h-4" />;
  return <Monitor className="w-4 h-4" />;
}

function locationLabel(loc: string) {
  const map: Record<string, string> = {
    HOME: "Home Page", COMPANY: "Company Pages", OFFER: "Offers Page",
    TENDER: "Tenders Page", BLOG: "Blog Pages", ALL: "All Pages", OTHER: "Other Pages",
  };
  return map[loc] ?? loc;
}

function positionLabel(pos: string) {
  const map: Record<string, string> = {
    TOP: "Top Strip", MIDDLE: "Mid-Page", BOTTOM: "Bottom Strip",
    SIDEBAR: "Sidebar", OTHER: "Other",
  };
  return map[pos] ?? pos;
}

function positionColor(pos: string) {
  const map: Record<string, string> = {
    TOP: "bg-blue-100 text-blue-700",
    MIDDLE: "bg-purple-100 text-purple-700",
    BOTTOM: "bg-emerald-100 text-emerald-700",
    SIDEBAR: "bg-orange-100 text-orange-700",
    OTHER: "bg-gray-100 text-gray-600",
  };
  return map[pos] ?? "bg-gray-100 text-gray-600";
}

export default function BannerPlanCard({ plan }: { plan: TBannerPlan }) {
  const [open, setOpen] = useState(false);

  const durationLabel = `${plan.duration} ${plan.durationUnit}`;

  return (
    <article className="group relative flex flex-col bg-white border-2 border-gray-100 hover:border-yellow-400 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1.5 w-full bg-linear-to-r from-yellow-400 via-amber-500 to-amber-600" />

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-6 gap-4">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-gray-900 leading-tight">{plan.name}</h3>
            {plan.description && (
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">{plan.description}</p>
            )}
          </div>
          <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${positionColor(plan.pagePosition)}`}>
            {positionLabel(plan.pagePosition)}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-end gap-2">
          <span className="text-3xl font-black text-gray-900">
            {plan.currency} {plan.price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500 mb-1 font-semibold">/ {durationLabel}</span>
        </div>

        {/* Quick Specs Row */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
            {orientationIcon(plan.orientation)}
            {plan.orientation.charAt(0) + plan.orientation.slice(1).toLowerCase()}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            {locationLabel(plan.location)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            {durationLabel}
          </span>
        </div>

        {/* Benefits */}
        {plan.benefits.length > 0 && (
          <ul className="flex flex-col gap-2">
            {plan.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Expand / Collapse */}
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className="flex items-center justify-between w-full text-sm font-bold text-amber-600 hover:text-amber-700 border-t border-gray-100 pt-3 mt-auto transition-colors"
          aria-expanded={open}
        >
          <span>{open ? "Hide details" : "View more details"}</span>
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Expanded Details */}
        {open && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col gap-3 text-sm">
            <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Technical Specifications</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400 font-semibold">Dimensions</span>
                <span className="flex items-center gap-1 font-bold text-gray-700">
                  <Ruler className="w-3.5 h-3.5 text-amber-500" />
                  {plan.width} × {plan.height} px
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400 font-semibold">Orientation</span>
                <span className="flex items-center gap-1 font-bold text-gray-700">
                  {orientationIcon(plan.orientation)}
                  {plan.orientation.charAt(0) + plan.orientation.slice(1).toLowerCase()}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400 font-semibold">Placement</span>
                <span className="flex items-center gap-1 font-bold text-gray-700">
                  <Layers className="w-3.5 h-3.5 text-purple-500" />
                  {positionLabel(plan.pagePosition)}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400 font-semibold">Shown On</span>
                <span className="flex items-center gap-1 font-bold text-gray-700">
                  <LayoutGrid className="w-3.5 h-3.5 text-blue-500" />
                  {locationLabel(plan.location)}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-gray-400 font-semibold">Active Duration</span>
              <span className="flex items-center gap-1 font-bold text-gray-700">
                <Clock className="w-3.5 h-3.5 text-green-500" />
                {plan.duration} {plan.durationUnit} from activation date
              </span>
            </div>
            {plan._count.banners > 0 && (
              <p className="text-xs text-gray-400 font-medium border-t border-gray-200 pt-2">
                🔥 {plan._count.banners} active banner{plan._count.banners !== 1 ? "s" : ""} running on this plan
              </p>
            )}
          </div>
        )}
      </div>

      {/* CTA Footer */}
      <div className="px-6 pb-6">
        <a
          href={buildWhatsAppLink(plan.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full py-3 px-6 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] text-sm"
          aria-label={`Get started with ${plan.name} banner plan`}
        >
          <MessageCircle className="w-5 h-5" />
          Get Started via WhatsApp
        </a>
      </div>
    </article>
  );
}
