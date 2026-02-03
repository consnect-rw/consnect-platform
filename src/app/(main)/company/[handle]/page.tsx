
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
} from "lucide-react";
import { fetchCompanyByHandle } from "@/server/company/company";
import { SCompanyPage } from "@/types/company/company";
import Image from "@/components/ui/Image";
import RichTextView from "@/components/ui/rich-text-viewer";
import { ShareBtn } from "@/components/buttons/ShareBtn";
import { CompanyVerificationBadge } from "@/components/ui/badges/CompanyVerificationBadge";
import { ConsnectBadge } from "@/components/ui/badges/ConsnectBadge";
import { ReviewForm } from "@/components/forms/company/ReviewForm";

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle: rawHandle } = await params;
  
  // Decode URL-encoded handle (e.g., "A%26U-ARCHITECTS-Ltd" -> "A&U-ARCHITECTS-Ltd")
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
      <section className="bg-linear-to-br from-gray-900 via-gray-800 to-black text-white border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Logo */}
            <div className="relative shrink-0">
              <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden">
                {company.logoUrl ? (
                  <Image
                    src={company.logoUrl}
                    alt={`${company.name} logo`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Building2 className="w-16 h-16 text-gray-400" />
                )}
              </div>
              
              {/* Verification Badge on Logo */}
              {isVerified && (
                <div className="absolute -bottom-2 -right-2">
                  <CompanyVerificationBadge size="sm" showLabel={false} />
                </div>
              )}
            </div>

            {/* Company Identity */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-start gap-4">
                <h1 className="text-4xl md:text-5xl font-black text-white flex-1">
                  {company.name}
                </h1>
                
                {/* Consnect Badge */}
                {showConsnectBadge && (
                  <div className="mt-2">
                    <ConsnectBadge level={badgeLevel} size="sm" showLabel={true} />
                  </div>
                )}
              </div>

              {company.slogan && (
                <p className="text-xl text-gray-300 font-medium max-w-3xl">
                  {company.slogan}
                </p>
              )}

              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                {company.foundedYear && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-yellow-400" />
                    <span>Founded {company.foundedYear}</span>
                  </div>
                )}
                {company.companySize && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-yellow-400" />
                    <span>{company.companySize} employees</span>
                  </div>
                )}
                {company.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-yellow-400" />
                    <span>
                      {company.location.city}, {company.location.country}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                {company.website && (
                  <Link
                    href={company.website}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Globe className="w-5 h-5" />
                    Visit Website
                  </Link>
                )}
                <ShareBtn
                  shareTitle={company.name}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-all border border-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Overview */}
            {overviewDesc && (
              <div className="bg-gray-50 rounded-xl p-8 border-2 border-gray-200">
                <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-gray-900" />
                  </div>
                  About Us
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {overviewDesc.description}
                </p>
              </div>
            )}

            {/* Mission & Vision */}
            {(missionDesc || visionDesc) && (
              <div className="grid md:grid-cols-2 gap-6">
                {missionDesc && (
                  <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-yellow-400 transition-colors">
                    <h3 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-400" />
                      Our Mission
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {missionDesc.description}
                    </p>
                  </div>
                )}
                {visionDesc && (
                  <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-yellow-400 transition-colors">
                    <h3 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      Our Vision
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {visionDesc.description}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Detailed Description (Collapsible) */}
            {detailedDesc && (
              <details className="bg-white rounded-xl border-2 border-gray-200 hover:border-yellow-400 transition-colors group">
                <summary className="px-8 py-6 cursor-pointer list-none flex items-center justify-between font-black text-gray-900 text-xl">
                  <span className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-yellow-400" />
                    Detailed Information
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:hidden" />
                  <ChevronUp className="w-5 h-5 text-gray-400 hidden group-open:block" />
                </summary>
                <div className="px-8 pb-8 border-t-2 border-gray-100 pt-6">
                  <RichTextView content={detailedDesc.description} />
                </div>
              </details>
            )}
          </div>

          {/* Sidebar - Contact & Social */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-gray-900 text-white rounded-xl p-6 border-2 border-gray-800 shadow-xl sticky top-6">
              <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-yellow-400" />
                Contact Information
              </h3>
              <ul className="space-y-3 text-gray-300">
                {company.email && (
                  <li className="flex items-start gap-3 group">
                    <Mail className="w-4 h-4 mt-1 text-yellow-400 shrink-0" />
                    <a
                      href={`mailto:${company.email}`}
                      className="hover:text-yellow-400 transition-colors break-all"
                    >
                      {company.email}
                    </a>
                  </li>
                )}
                {company.phone && (
                  <li className="flex items-start gap-3 group">
                    <Phone className="w-4 h-4 mt-1 text-yellow-400 shrink-0" />
                    <a
                      href={`tel:${company.phone}`}
                      className="hover:text-yellow-400 transition-colors"
                    >
                      {company.phone}
                    </a>
                  </li>
                )}
                {company.location?.address && (
                  <li className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-1 text-yellow-400 shrink-0" />
                    <span className="text-sm">{company.location.address}</span>
                  </li>
                )}
              </ul>

              {/* Social Media */}
              {company.socialMedia && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">
                    Follow Us
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {company.socialMedia.facebook && (
                      <Link
                        href={company.socialMedia.facebook}
                        target="_blank"
                        className="w-10 h-10 bg-white/10 hover:bg-yellow-400 rounded-lg flex items-center justify-center transition-all hover:text-gray-900"
                      >
                        <Facebook className="w-5 h-5" />
                      </Link>
                    )}
                    {company.socialMedia.twitter && (
                      <Link
                        href={company.socialMedia.twitter}
                        target="_blank"
                        className="w-10 h-10 bg-white/10 hover:bg-yellow-400 rounded-lg flex items-center justify-center transition-all hover:text-gray-900"
                      >
                        <Twitter className="w-5 h-5" />
                      </Link>
                    )}
                    {company.socialMedia.linkedin && (
                      <Link
                        href={company.socialMedia.linkedin}
                        target="_blank"
                        className="w-10 h-10 bg-white/10 hover:bg-yellow-400 rounded-lg flex items-center justify-center transition-all hover:text-gray-900"
                      >
                        <Linkedin className="w-5 h-5" />
                      </Link>
                    )}
                    {company.socialMedia.instagram && (
                      <Link
                        href={company.socialMedia.instagram}
                        target="_blank"
                        className="w-10 h-10 bg-white/10 hover:bg-yellow-400 rounded-lg flex items-center justify-center transition-all hover:text-gray-900"
                      >
                        <Instagram className="w-5 h-5" />
                      </Link>
                    )}
                    {company.socialMedia.youtube && (
                      <Link
                        href={company.socialMedia.youtube}
                        target="_blank"
                        className="w-10 h-10 bg-white/10 hover:bg-yellow-400 rounded-lg flex items-center justify-center transition-all hover:text-gray-900"
                      >
                        <Youtube className="w-5 h-5" />
                      </Link>
                    )}
                  </div>
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
              {company.projects.map((project, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-yellow-400 hover:shadow-lg transition-all group"
                >
                  {/* Project Image */}
                  {project.images && project.images.length > 0 && (
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <Image
                        src={project.images[0]}
                        alt={project.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-black text-gray-900 text-lg mb-2">
                      {project.title}
                    </h3>
                    {project.clientName && (
                      <p className="text-sm text-gray-600 font-medium mb-3">
                        Client: {project.clientName}
                      </p>
                    )}
                    {project.phase && (
                      <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full mb-3">
                        {project.phase}
                      </span>
                    )}
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
            {company.catalogs.map((catalog, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-yellow-400 hover:shadow-lg transition-all group"
              >
                {catalog.image && (
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <Image
                      src={catalog.image}
                      alt={catalog.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-black text-gray-900 text-lg mb-2">
                    {catalog.name}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {catalog.description}
                  </p>
                  {catalog.fileUrl && (
                    <Link
                      href={catalog.fileUrl}
                      target="_blank"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      Download Catalog
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= REVIEWS SECTION ================= */}
      <section className="bg-gray-50 border-y-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-gray-900" />
            </div>
            Recent Reviews
          </h2>

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
      </section>
    </div>
  );
}
