
import Link from "next/link";
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Building2,
  Award,
  ChevronDown,
  ChevronUp,
  Star,
  FileText,
  Briefcase,
  Shield,
  Wrench,
  Clock,
} from "lucide-react";
import { fetchCompanyByHandle } from "@/server/company/company";
import { SCompanyPage } from "@/types/company/company";
import Image from "@/components/ui/Image";
import RichTextView from "@/components/ui/rich-text-viewer";
import { ShareBtn } from "@/components/buttons/ShareBtn";
import { CompanyVerificationBadge } from "@/components/ui/badges/CompanyVerificationBadge";
import { ConsnectBadge } from "@/components/ui/badges/ConsnectBadge";
import { ReviewForm } from "@/components/forms/company/ReviewForm";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { CatalogCard } from "@/components/cards/CatalogCard";

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle: rawHandle } = await params;
  const handle = decodeURIComponent(rawHandle);
  
  const company = await fetchCompanyByHandle(handle, SCompanyPage);
  
  if (!company) {
    return (
      <div className="w-full text-lg font-bold text-gray-600 py-18 text-center">
        Company Not found!
      </div>
    );
  }

  const isVerified = company.verification?.status === "VERIFIED";
  const hasGoldBadge = company.verification?.isGoldVerified;
  const hasSilverBadge = company.verification?.isSilverVerified;
  const hasBronzeBadge = company.verification?.isBronzeVerified;
  const showConsnectBadge = hasGoldBadge || hasSilverBadge || hasBronzeBadge;
  const badgeLevel = hasGoldBadge ? "gold" : hasSilverBadge ? "silver" : "bronze";

  const overviewDesc = company.descriptions.find((d) => d.title === "Overview");
  const missionDesc = company.descriptions.find((d) => d.title === "Mission");
  const visionDesc = company.descriptions.find((d) => d.title === "Vision");
  const detailedDesc = company.descriptions.find((d) => d.title === "Detailed");

  return (
    <div className="bg-white min-h-screen">
      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-linear-to-br from-black via-gray-950 to-black text-white border-b-4 border-yellow-400 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="flex flex-col gap-8 items-start">
            {/* Logo and Info Section, Badge */}
            <div className="w-full flex items-start justify-between gap-4">
              <div className="flex flex-col md:flex-row items-start gap-4">
                {/* Logo Section */}
                <div className="relative shrink-0 group">
                  <div className="w-36 h-36 bg-white rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden ring-4 ring-white/10 group-hover:ring-yellow-400/50 transition-all">
                    {company.logoUrl ? (
                      <Image
                        src={company.logoUrl}
                        alt={`${company.name} logo`}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Building2 className="w-20 h-20 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Verification Badge on Logo */}
                  {isVerified && (
                    <div className="absolute -bottom-3 -right-3 animate-pulse">
                      <CompanyVerificationBadge size="sm" showLabel={false} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white flex-1 leading-tight">{company.name}</h1>
                  {/* Slogan */}
                  {company.slogan && (
                    <p className="text-base md:text-lg text-gray-300 font-medium max-w-3xl leading-relaxed">
                      {company.slogan}
                    </p>
                  )}
                  {/* Quick Info Pills */}
                  <div className="flex flex-wrap gap-3">
                    {company.foundedYear && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all">
                        <Calendar className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-bold">Est. {company.foundedYear}</span>
                      </div>
                    )}
                    {company.companySize && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all">
                        <Users className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-bold">{company.companySize}+ Team</span>
                      </div>
                    )}
                    {company.location && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all">
                        <MapPin className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-bold">
                          {company.location.city}, {company.location.country}
                        </span>
                      </div>
                    )}
                    {isVerified && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-full border border-emerald-400/30 hover:bg-emerald-500/30 transition-all">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-bold text-emerald-300">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Badge */}
              <div className="flex flex-wrap items-start gap-3">
                {/* Consnect Badge */}
                {showConsnectBadge && (
                  <div className="shrink-0">
                    <ConsnectBadge level={badgeLevel} size="md" showLabel={true} />
                  </div>
                )}
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex w-full flex-wrap gap-3 pt-2">
              {company.website && (
                <Link
                  href={company.website}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-gray-900 font-black rounded-xl hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Globe className="w-5 h-5" />
                  Visit Website
                </Link>
              )}
              <ShareBtn
                shareTitle={company.name}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-black rounded-xl hover:bg-white/20 transition-all border-2 border-white/20 hover:border-yellow-400"
              />
            </div>
            {/* Specializations */}
            {company.specializations && company.specializations.length > 0 && (
              <div className="w-full pt-6 border-t border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-yellow-400" />
                  </div>
                  <h3 className="text-sm font-black text-gray-300 uppercase tracking-wider">
                    Specializations
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {company.specializations.map((spec, i) => (
                    <div
                      key={i}
                      className="px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-yellow-400 hover:border-yellow-400 hover:text-gray-900 transition-all group"
                    >
                      <span className="text-sm font-bold">
                        {spec.name}
                      </span>
                      {spec.category && (
                        <span className="text-xs opacity-70 ml-2 group-hover:opacity-100">
                          • {spec.category.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= PROJECTS ================= */}
      {company.projects.length > 0 && (
        <section className="bg-gray-50 border-y-2 border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-gray-900" />
              </div>
              Projects & Portfolio
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {company.projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= ABOUT SECTION ================= */}
      {(overviewDesc || missionDesc || visionDesc || detailedDesc) && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="space-y-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-gray-900 mb-3">About {company.name}</h2>
              <div className="w-24 h-1.5 bg-yellow-400 mx-auto rounded-full" />
            </div>

            {/* Overview */}
            {overviewDesc && (
              <div className="relative bg-linear-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl p-8 md:p-12 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-gray-900" />
                    </div>
                    <h3 className="text-2xl font-black">Who We Are</h3>
                  </div>
                  <p className="text-gray-200 leading-relaxed text-lg max-w-4xl">
                    {overviewDesc.description}
                  </p>
                </div>
              </div>
            )}

            {/* Mission & Vision */}
            {(missionDesc || visionDesc) && (
              <div className="grid md:grid-cols-2 gap-6">
                {missionDesc && (
                  <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-yellow-400 transition-all shadow-lg hover:shadow-xl group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:bg-yellow-400 transition-colors">
                        <Award className="w-6 h-6 text-yellow-600 group-hover:text-gray-900 transition-colors" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900">Our Mission</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-base">
                      {missionDesc.description}
                    </p>
                  </div>
                )}
                {visionDesc && (
                  <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-yellow-400 transition-all shadow-lg hover:shadow-xl group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:bg-yellow-400 transition-colors">
                        <Star className="w-6 h-6 text-yellow-600 group-hover:text-gray-900 transition-colors" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900">Our Vision</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-base">
                      {visionDesc.description}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Detailed Description (Collapsible) */}
            {detailedDesc && (
              <details className="bg-white rounded-2xl border-2 border-gray-200 hover:border-yellow-400 transition-colors group shadow-lg">
                <summary className="px-8 py-6 cursor-pointer list-none flex items-center justify-between font-black text-gray-900 text-xl">
                  <span className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-400 transition-colors">
                      <FileText className="w-5 h-5 text-yellow-600 group-hover:text-gray-900 transition-colors" />
                    </div>
                    Detailed Information
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 font-medium">Click to expand</span>
                    <ChevronDown className="w-5 h-5 text-gray-400 group-open:hidden" />
                    <ChevronUp className="w-5 h-5 text-gray-400 hidden group-open:block" />
                  </div>
                </summary>
                <div className="px-8 pb-8 border-t-2 border-gray-100 pt-6">
                  <RichTextView content={detailedDesc.description} />
                </div>
              </details>
            )}
          </div>
        </section>
      )}

      {/* ================= LEADERSHIP / FOUNDERS ================= */}
      {company.founders.length > 0 && (
        <section className="bg-gray-50 border-y-2 border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-900" />
              </div>
              Leadership Team
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {company.founders.map((founder, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border-2 border-gray-200 p-6 text-center hover:border-yellow-400 hover:shadow-lg transition-all"
                >
                  <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 overflow-hidden mb-4 border-4 border-gray-200">
                    {founder.image ? (
                      <Image
                        src={founder.image}
                        alt={founder.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-black text-gray-400">
                        {founder.name[0]}
                      </div>
                    )}
                  </div>
                  <h3 className="font-black text-gray-900 text-lg">
                    {founder.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium mt-1">
                    {founder.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= CONTACT PERSONS ================= */}
      {company.contactPersons.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6 text-gray-900" />
            </div>
            Contact Persons
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {company.contactPersons.map((person, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-yellow-400 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-black text-gray-900 text-lg">
                      {person.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {person.role}
                    </p>
                  </div>
                  {/* IER Badge */}
                  {person.regNumber && (
                    <div className="shrink-0 ml-2">
                      <div className="px-3 py-1 bg-emerald-50 border-2 border-emerald-500 rounded-full flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-xs font-black text-emerald-700 uppercase tracking-wide">
                          IER
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  {person.contactEmail && (
                    <li className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                      <a
                        href={`mailto:${person.contactEmail}`}
                        className="hover:text-yellow-600 transition-colors break-all"
                      >
                        {person.contactEmail}
                      </a>
                    </li>
                  )}
                  {person.contactPhone && (
                    <li className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      <a
                        href={`tel:${person.contactPhone}`}
                        className="hover:text-yellow-600 transition-colors"
                      >
                        {person.contactPhone}
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= PRODUCT CATALOGS ================= */}
      {company.catalogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-gray-900" />
            </div>
            Product Catalogs
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {company.catalogs.map((catalog) => (
              <CatalogCard key={catalog.id} catalog={catalog} />
            ))}
          </div>
        </section>
      )}

      {/* ================= SERVICES ================= */}
      {company.services.length > 0 && (
        <section className="bg-gray-50 border-y-2 border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                <Wrench className="w-6 h-6 text-gray-900" />
              </div>
              Our Services
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {company.services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= CONTACT SECTION ================= */}
      <section className="bg-linear-to-br from-gray-900 via-gray-800 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-3">Get In Touch</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Ready to collaborate? Reach out to us through any of these channels
            </p>
            <div className="w-24 h-1.5 bg-yellow-400 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Primary Contact Card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/10 hover:border-yellow-400 transition-all hover:bg-white/10">
              <div className="w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center mb-6">
                <Phone className="w-7 h-7 text-gray-900" />
              </div>
              <h3 className="text-xl font-black text-white mb-6">Contact Information</h3>
              <div className="space-y-4">
                {company.email && (
                  <div className="group">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Email</span>
                    </div>
                    <a
                      href={`mailto:${company.email}`}
                      className="text-white hover:text-yellow-400 transition-colors font-medium block break-all"
                    >
                      {company.email}
                    </a>
                  </div>
                )}
                {company.phone && (
                  <div className="group">
                    <div className="flex items-center gap-2 mb-1">
                      <Phone className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Phone</span>
                    </div>
                    <a
                      href={`tel:${company.phone}`}
                      className="text-white hover:text-yellow-400 transition-colors font-medium block"
                    >
                      {company.phone}
                    </a>
                  </div>
                )}
                {company.website && (
                  <div className="group">
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Website</span>
                    </div>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-yellow-400 transition-colors font-medium block truncate"
                    >
                      {company.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Location Card */}
            {company.location && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/10 hover:border-yellow-400 transition-all hover:bg-white/10">
                <div className="w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center mb-6">
                  <MapPin className="w-7 h-7 text-gray-900" />
                </div>
                <h3 className="text-xl font-black text-white mb-6">Our Location</h3>
                <div className="space-y-4">
                  {company.location.address && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Address</span>
                      </div>
                      <p className="text-white font-medium leading-relaxed">
                        {company.location.address}
                      </p>
                    </div>
                  )}
                  {(company.location.city || company.location.state || company.location.country) && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Region</span>
                      </div>
                      <p className="text-white font-medium">
                        {[company.location.city, company.location.state, company.location.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Business Hours & Social Media Card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/10 hover:border-yellow-400 transition-all hover:bg-white/10">
              <div className="w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center mb-6">
                <Share2 className="w-7 h-7 text-gray-900" />
              </div>
              <h3 className="text-xl font-black text-white mb-6">Connect With Us</h3>
              
              {/* Business Info */}
              <div className="space-y-4 mb-6">
                {company.foundedYear && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Established</span>
                    </div>
                    <p className="text-white font-medium">{company.foundedYear}</p>
                  </div>
                )}
                {company.companySize && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Team Size</span>
                    </div>
                    <p className="text-white font-medium">{company.companySize} employees</p>
                  </div>
                )}
              </div>

              {/* Social Media */}
              {company.socialMedia && (
                Object.values(company.socialMedia).some(Boolean) && (
                  <div className="pt-6 border-t border-white/10">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">
                      Follow Us
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {company.socialMedia.facebook && (
                        <a
                          href={company.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-11 h-11 bg-white/10 hover:bg-yellow-400 rounded-lg flex items-center justify-center transition-all hover:text-gray-900 group"
                          title="Facebook"
                        >
                          <Facebook className="w-5 h-5 text-white group-hover:text-gray-900" />
                        </a>
                      )}
                      {company.socialMedia.twitter && (
                        <a
                          href={company.socialMedia.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-11 h-11 bg-white/10 hover:bg-yellow-400 rounded-lg flex items-center justify-center transition-all hover:text-gray-900 group"
                          title="Twitter"
                        >
                          <Twitter className="w-5 h-5 text-white group-hover:text-gray-900" />
                        </a>
                      )}
                      {company.socialMedia.linkedin && (
                        <a
                          href={company.socialMedia.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-11 h-11 bg-white/10 hover:bg-yellow-400 rounded-lg flex items-center justify-center transition-all hover:text-gray-900 group"
                          title="LinkedIn"
                        >
                          <Linkedin className="w-5 h-5 text-white group-hover:text-gray-900" />
                        </a>
                      )}
                      {company.socialMedia.instagram && (
                        <a
                          href={company.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-11 h-11 bg-white/10 hover:bg-yellow-400 rounded-lg flex items-center justify-center transition-all hover:text-gray-900 group"
                          title="Instagram"
                        >
                          <Instagram className="w-5 h-5 text-white group-hover:text-gray-900" />
                        </a>
                      )}
                      {company.socialMedia.youtube && (
                        <a
                          href={company.socialMedia.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-11 h-11 bg-white/10 hover:bg-yellow-400 rounded-lg flex items-center justify-center transition-all hover:text-gray-900 group"
                          title="YouTube"
                        >
                          <Youtube className="w-5 h-5 text-white group-hover:text-gray-900" />
                        </a>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-yellow-400 rounded-2xl">
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                <Phone className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">Ready to Start?</p>
                <p className="text-xl font-black text-gray-900">Contact us today for a consultation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= REVIEWS SECTION ================= */}
      <section className="bg-gray-50 border-y-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-gray-900" />
            </div>
            Recent Reviews
          </h2>
          <div className="w-full grid gap-4 md:grid-cols-3">
            <div className="w-full md:col-span-2">
              {/* Display Reviews */}
                {company.reviews.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {company.reviews.map((review, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-yellow-400 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              className={`w-5 h-5 ${
                                index < review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {review.review}
                        </p>
                        <div className="pt-4 border-t-2 border-gray-100">
                          <p className="font-black text-gray-900">{review.name}</p>
                          <p className="text-sm text-gray-500 font-medium">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-12 border-2 border-gray-200 text-center">
                    <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">
                      No reviews yet. Be the first to review this company!
                    </p>
                  </div>
                )}
            </div>
            {/* Review Form Card */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Leave a Review
                </h3>
                <ReviewForm companyId={company.id} />
              </div>
            </div>
          
        </div>
      </section>
      
    </div>
  );
}
