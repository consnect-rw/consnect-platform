import type { Metadata } from "next";
import Image from "next/image";
import { Lock, Mail } from "lucide-react";
import { BILLING_CONTACT_EMAIL, formatPaidUntil } from "@/config/deployment";

export const metadata: Metadata = {
  title: "Service suspended",
  description: "This site is temporarily offline.",
  robots: { index: false, follow: false },
};

const HAZARD_STRIPES =
  "repeating-linear-gradient(-45deg, #f59e0b 0 18px, #0a0a0a 18px 36px)";

function HazardTape({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`h-3 w-full shrink-0 sm:h-4 ${className}`}
      style={{ backgroundImage: HAZARD_STRIPES }}
    />
  );
}

export default function SuspendedPage() {
  const paidUntil = formatPaidUntil();

  const details = [
    { label: "Status", value: "Suspended", highlight: true },
    { label: "Reason", value: "Hosting plan not renewed" },
    ...(paidUntil ? [{ label: "Paid through", value: paidUntil }] : []),
    { label: "Restored", value: "Automatically, once renewal is confirmed" },
  ];

  return (
    <main className="fixed inset-0 z-[9999] flex flex-col overflow-y-auto bg-neutral-950 text-neutral-100">
      <HazardTape />

      {/* Blueprint grid + amber glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl"
      />

      <header className="relative flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-3">
          <Image
            src="/logo/consnect-rb.png"
            alt="Consnect"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
            priority
          />
          <span className="text-lg font-semibold tracking-tight">Consnect</span>
        </div>
        <span className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-amber-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
          </span>
          Offline
        </span>
      </header>

      <section className="relative flex flex-1 items-center px-6 py-10 sm:px-10">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
              <Lock className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-amber-500">
              Error 503 · Deployment paused
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              This site is temporarily{" "}
              <span className="text-amber-400">suspended.</span>
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-neutral-400 sm:text-lg">
              The hosting plan for this deployment has not been renewed for the
              current period, so the site was taken offline automatically. No
              content has been removed - everything comes back as soon as the
              renewal is confirmed.
            </p>

            {BILLING_CONTACT_EMAIL && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={`mailto:${BILLING_CONTACT_EMAIL}?subject=${encodeURIComponent(
                    "Consnect deployment renewal"
                  )}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-neutral-950 transition-colors hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                >
                  <Mail className="h-4 w-4" />
                  Renew deployment
                </a>
                <span className="break-all font-mono text-xs text-neutral-500">
                  {BILLING_CONTACT_EMAIL}
                </span>
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                Deployment
              </span>
              <span className="font-mono text-xs text-neutral-500">consnect.rw</span>
            </div>
            <dl className="divide-y divide-white/5">
              {details.map(({ label, value, highlight }) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between gap-6 px-5 py-4"
                >
                  <dt className="shrink-0 text-sm text-neutral-500">{label}</dt>
                  <dd
                    className={`text-right text-sm font-medium ${
                      highlight ? "text-amber-400" : "text-neutral-200"
                    }`}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <footer className="relative px-6 pb-5 text-center text-xs text-neutral-600 sm:px-10">
        If you are a visitor, please check back later. If you own this site,
        contact your developer to restore service.
      </footer>

      <HazardTape />
    </main>
  );
}
