"use cache";

import { fetchCompanys } from "@/server/company/company";
import { SCompanyCard, TCompanyCard } from "@/types/company/company";
import { ECompanyStatus,} from "@prisma/client";
import Link from "next/link";
import { Building2, ExternalLink, ArrowRight, CheckCircle2, Globe } from "lucide-react";
import Image from "../ui/Image";
import { CompanyCard } from "../cards/CompanyCard";



export async function HomeCompaniesSection() {
  const { data: companies } = await fetchCompanys(
    SCompanyCard,
    { verification: { status: ECompanyStatus.VERIFIED } },
    8
  );

  if (companies.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-linear-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-200 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        {/* <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-6">
            <CheckCircle2 className="w-4 h-4 text-yellow-600" fill="currentColor" />
            <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Verified Companies
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Trusted by Leading Organizations
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Join hundreds of verified companies building their presence on our platform
          </p>
        </div> */}

        {/* Section Header */}
                <div className="flex items-end justify-between mb-12 pb-8 border-b-2 border-gray-200">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-1 h-8 bg-yellow-400"></div>
                      <h2 className="text-3xl lg:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                        Verified Companies
                      </h2>
                    </div>
                    <p className="text-gray-600 text-base lg:text-lg font-medium ml-5">
                      Join hundreds of verified companies building their presence on our platform
                    </p>
                  </div>
        
                  <Link
                    href="/companies"
                    className="hidden rounded-lg md:flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold transition-colors group"
                  >
                    <Building2 className="w-5 h-5" />
                    <span>View All Companies</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-yellow-400" fill="currentColor" />
            <span className="font-medium">Verified Organizations</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-yellow-400" fill="currentColor" />
            <span className="font-medium">Secure Platform</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-yellow-400" fill="currentColor" />
            <span className="font-medium">Industry Leading</span>
          </div>
        </div>
      </div>
      {/* CTA Section */}
        <div className="relative mt-16">
          <div className="bg-linear-to-br from-black via-gray-950 to-black px-8 lg:px-12 py-12 lg:py-16 text-center relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300 rounded-full blur-3xl"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-6">
                <Building2 className="w-8 h-8 text-gray-900" strokeWidth={2.5} />
              </div>

              <h3 className="text-3xl font-black text-white mb-4">
                Ready to Showcase Your Company?
              </h3>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                Join our growing network of verified companies and connect with top professionals in your industry
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/auth/register"
                  className="group px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black rounded-full transition-all hover:scale-105 transform shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <span>Register Your Company</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                </Link>

                <Link
                  href="/companies"
                  className="group px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-all border-2 border-white/20 hover:border-white/40 flex items-center gap-2"
                >
                  <span>Browse All Companies</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              {/* Stats */}
              {/* <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-700">
                <div>
                  <div className="text-3xl font-black text-yellow-400 mb-1">
                    {companies.length * 50}+
                  </div>
                  <div className="text-sm text-gray-400 font-medium">
                    Verified Companies
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-yellow-400 mb-1">
                    500K+
                  </div>
                  <div className="text-sm text-gray-400 font-medium">
                    Active Professionals
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-yellow-400 mb-1">
                    150+
                  </div>
                  <div className="text-sm text-gray-400 font-medium">
                    Countries Worldwide
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
    </section>
  );
}