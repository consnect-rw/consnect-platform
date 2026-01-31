import React from "react";
import Link from "next/link";
import { GettingStartedGuide } from "@/lib/data/get-started";

export default function GetStartedPage() {
  const {
    title,
    subtitle,
    introduction,
    steps,
    successTips,
    commonMistakesToAvoid,
    recommendedTools,
    conclusion,
  } = GettingStartedGuide;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300/40 via-gray-100 to-gray-300/40 relative overflow-hidden">
      {/* Floating UI Elements */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-400/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-56 h-56 bg-gray-400/20 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 px-6 py-20 max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 drop-shadow-sm">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mt-4 max-w-3xl mx-auto">
            {subtitle}
          </p>
          <p className="text-base text-gray-600 mt-6 max-w-2xl mx-auto">
            {introduction}
          </p>
        </div>

        {/* Steps Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Step-by-Step Guide</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {steps.map((step) => (
              <div
                key={step.step}
                className="p-6 bg-white/70 rounded-2xl shadow-md backdrop-blur border border-gray-200 hover:shadow-xl transition"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Step {step.step}: {step.title}
                </h3>
                <p className="text-gray-700 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Success Tips */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Tips for Success</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {successTips.map((tip, index) => (
              <div
                key={index}
                className="p-6 bg-yellow-100/60 rounded-2xl shadow-md border border-yellow-200 hover:shadow-xl transition"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {tip.title}
                </h3>
                <p className="text-gray-700 text-sm">{tip.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mistakes to Avoid */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Common Mistakes to Avoid</h2>
          <div className="space-y-4">
            {commonMistakesToAvoid.map((item, index) => (
              <div
                key={index}
                className="p-5 bg-white/60 rounded-xl border shadow-sm hover:shadow-lg transition"
              >
                <p className="text-gray-800 font-medium">❌ {item.issue}</p>
                <p className="text-gray-600 text-sm mt-1">{item.fix}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Tools */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recommended Tools</h2>
          <p className="text-gray-600 mb-4">{recommendedTools.description}</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedTools.features.map((tool, index) => (
              <li
                key={index}
                className="p-4 bg-gray-200/60 rounded-xl shadow-sm hover:bg-gray-300/60 transition"
              >
                {tool}
              </li>
            ))}
          </ul>
        </section>

        {/* Call To Action */}
        <section className="text-center mt-20">
          <p className="text-gray-700 max-w-2xl mx-auto mb-10 text-lg">{conclusion}</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-xl shadow hover:bg-yellow-600 transition"
            >
              Create an Account
            </Link>
            <Link
              href="/auth/login"
              className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl shadow hover:bg-gray-800 transition"
            >
              Login
            </Link>
          </div>

          <div className="flex gap-6 justify-center mt-10 text-sm text-gray-600">
            <Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-900">Terms of Use</Link>
            <Link href="/contact" className="hover:text-gray-900">Contact Us</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
