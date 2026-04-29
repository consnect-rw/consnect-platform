import { fetchBannerPlans } from "@/server/banners/banner-plan";
import { SBannerPlan } from "@/types/banners/banner-plan";
import type { Metadata } from "next";
import {
  Megaphone, BarChart3, Users, Globe, Zap, ShieldCheck,
  MessageCircle, ChevronRight, Star, TrendingUp, Eye,
} from "lucide-react";
import BannerPlanCard from "@/components/cards/BannerPlanCard";

export const metadata: Metadata = {
  title: "Advertise on Consnect | Reach Rwanda's Business Community",
  description:
    "Promote your brand on Consnect  Rwanda's leading B2B marketplace. Choose from flexible banner advertising plans and reach thousands of businesses, professionals, and decision-makers daily.",
  keywords: [
    "advertise on Consnect", "banner advertising Rwanda", "B2B advertising Rwanda",
    "digital marketing Rwanda", "business advertising Kigali", "Consnect ads",
    "banner plans", "online advertising Rwanda", "reach Rwandan businesses",
  ],
  openGraph: {
    title: "Advertise on Consnect | Reach Rwanda's Business Community",
    description:
      "Reach thousands of Rwandan businesses and professionals. Choose a banner plan that fits your goals and budget.",
    type: "website",
    locale: "en_RW",
  },
  twitter: {
    card: "summary_large_image",
    title: "Advertise on Consnect",
    description: "Flexible banner advertising plans for businesses in Rwanda.",
  },
};

const WHATSAPP_NUMBER = "250789407079";
const WHATSAPP_GENERAL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi Consnect! I'd like to know more about advertising my business on your platform."
)}`;

const STATS = [
  { icon: Users,     value: "10,000+",  label: "Monthly Visitors"       },
  { icon: Globe,     value: "50+",      label: "Business Categories"    },
  { icon: Eye,       value: "500K+",    label: "Monthly Page Views"     },
  { icon: TrendingUp,value: "3×",       label: "Avg. Lead Conversion"   },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Pick a Plan",
    desc: "Browse our banner plans below. Each plan shows placement, dimensions, duration and pricing  everything you need to decide.",
  },
  {
    step: "02",
    title: "Chat with Us",
    desc: "Tap 'Get Started via WhatsApp' on any plan. We'll confirm details, guide your creative, and schedule your campaign.",
  },
  {
    step: "03",
    title: "Go Live",
    desc: "Our team activates your banner. Your brand appears in front of thousands of Rwandan businesses instantly.",
  },
];

const FAQS = [
  {
    q: "What file formats do you accept for banner images?",
    a: "We accept PNG, JPEG, WebP, and GIF (including animated GIFs). Each plan specifies the exact pixel dimensions required.",
  },
  {
    q: "Can I target a specific page or category?",
    a: "Yes! Each plan is tied to a specific page location (Home, Offers, Blog, Company pages, etc.). Choose the plan that matches your audience.",
  },
  {
    q: "What happens when my banner expires?",
    a: "Your banner stops displaying automatically. You can renew at any time by contacting us on WhatsApp.",
  },
  {
    q: "Can I update my banner image during the active period?",
    a: "Yes, one image update is included per active period. Contact us via WhatsApp with your new creative.",
  },
  {
    q: "Do you offer discounts for multiple plans or long durations?",
    a: "Absolutely! Reach out via WhatsApp and we'll craft a custom package tailored to your marketing budget.",
  },
];

export default async function AdvertisePage() {
  const bannerPlansData = await fetchBannerPlans(SBannerPlan, { isActive: true }, 100);
  const plans = bannerPlansData.data ?? [];

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-gray-900 text-white"
        aria-label="Advertise on Consnect hero"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-125 h-125 bg-yellow-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-100 h-100 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_0%,rgba(250,200,0,0.08),transparent_70%)]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28 lg:py-32">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-yellow-400/15 border border-yellow-400/30 rounded-full px-4 py-1.5 mb-6">
              <Megaphone className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-300 text-sm font-bold tracking-wide">Advertising Solutions</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-5">
              Put Your Brand in Front of{" "}
              <span className="text-yellow-400">Rwanda&apos;s Top Businesses</span>
            </h1>

            <p className="text-gray-300 text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl">
              Consnect connects buyers, suppliers, and professionals across Rwanda every day.
              Advertise with us to drive real business results  targeted, affordable, and easy to launch.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href={WHATSAPP_GENERAL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-yellow-500 hover:bg-yellow-400 text-white font-extrabold px-7 py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle className="w-5 h-5" />
                Talk to Us on WhatsApp
              </a>
              <a
                href="#plans"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-7 py-3.5 rounded-xl transition-all duration-200"
              >
                View Plans
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Stats ──────────────────────────────────────────── */}
      {/* <section className="bg-yellow-400" aria-label="Platform statistics">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-yellow-500">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center text-center px-4 py-2">
                <Icon className="w-6 h-6 text-gray-900 mb-1.5" />
                <span className="text-3xl font-black text-gray-900">{value}</span>
                <span className="text-sm font-bold text-yellow-900">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── Why Advertise ────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20" aria-label="Why advertise on Consnect">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
              Why Advertise on <span className="text-yellow-800">Consnect?</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Join leading Rwandan companies already growing their business through our platform.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users,      color: "bg-blue-50 text-blue-600",   title: "Qualified Audience",    desc: "Reach verified businesses, procurement teams, and professionals actively seeking services." },
              { icon: BarChart3,  color: "bg-amber-50 text-amber-600", title: "Measurable Reach",      desc: "Your banner appears on high-traffic pages with clear impression tracking." },
              { icon: Zap,        color: "bg-yellow-50 text-yellow-600",title: "Fast Activation",      desc: "Your campaign goes live within 24 hours of submission and payment." },
              { icon: Globe,      color: "bg-green-50 text-green-600", title: "Multi-Page Exposure",   desc: "Select placements across Home, Offers, Blog, Company pages and more." },
              { icon: ShieldCheck,color: "bg-purple-50 text-purple-600",title: "Brand Safety",         desc: "All banners are reviewed to ensure quality and brand-safe context." },
              { icon: Star,       color: "bg-rose-50 text-rose-600",   title: "Flexible Plans",        desc: "From short-term promotions to long-term brand awareness  we have a plan for every goal." },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 rounded-2xl border border-gray-100 hover:border-yellow-200 hover:shadow-md transition-all bg-white">
                <div className={`shrink-0 w-11 h-11 rounded-xl ${color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plans ────────────────────────────────────────────────── */}
      <section id="plans" className="bg-gray-50 py-16 md:py-20" aria-label="Banner advertising plans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
              Choose Your <span className="text-yellow-800">Banner Plan</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Every plan includes image hosting, placement guarantee, and WhatsApp support. Tap any plan to get started instantly.
            </p>
          </div>

          {plans.length === 0 ? (
            <div className="text-center py-20">
              <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">No plans available right now. Check back soon!</p>
              <a
                href={WHATSAPP_GENERAL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-yellow-600 font-bold hover:underline"
              >
                <MessageCircle className="w-4 h-4" />
                Ask about custom plans
              </a>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <BannerPlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20" aria-label="How advertising works on Consnect">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
              How It <span className="text-yellow-800">Works</span>
            </h2>
            <p className="text-gray-500 text-lg">From selection to live banner  in 3 simple steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line on desktop */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-linear-to-r from-yellow-300 to-amber-400" />
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="relative flex flex-col items-center text-center gap-4">
                <div className="relative z-10 w-24 h-24 rounded-2xl bg-linear-to-br from-yellow-400 to-amber-500 flex flex-col items-center justify-center shadow-lg shadow-amber-200">
                  <span className="text-xs font-black text-amber-900 uppercase tracking-widest">Step</span>
                  <span className="text-3xl font-black text-white">{step}</span>
                </div>
                <h3 className="text-lg font-extrabold text-gray-900">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 md:py-20" aria-label="Frequently asked questions about advertising">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
              Frequently Asked <span className="text-yellow-800">Questions</span>
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none font-bold text-gray-800 hover:text-amber-600 transition-colors">
                  <span>{q}</span>
                  <ChevronRight className="w-4 h-4 shrink-0 transition-transform duration-200 group-open:rotate-90" />
                </summary>
                <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gray-900 py-16 md:py-24" aria-label="Start advertising CTA">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-yellow-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-yellow-400/15 border border-yellow-400/30 rounded-full px-4 py-1.5 mb-6">
            <Megaphone className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-300 text-sm font-bold">Ready to grow?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-tight">
            Start Advertising Today &amp;{" "}
            <span className="text-yellow-400">Grow Your Business</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Our team is ready to help you pick the right plan, prepare your creative, and launch your campaign fast.
          </p>
          <a
            href={WHATSAPP_GENERAL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-yellow-800 hover:bg-amber-400 text-white font-extrabold px-8 py-4 rounded-xl text-lg transition-all duration-200 shadow-xl hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageCircle className="w-6 h-6" />
            Chat with Us on WhatsApp
          </a>
          <p className="text-gray-500 text-sm mt-4">
            +250 789 407 079 · Typically responds within a few hours
          </p>
        </div>
      </section>
    </main>
  );
}