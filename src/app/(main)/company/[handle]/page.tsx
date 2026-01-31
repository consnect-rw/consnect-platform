
import Link from "next/link";
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Share2,
} from "lucide-react";
import { fetchCompanyByHandle } from "@/server/company/company";
import { SCompanyPage } from "@/types/company/company";
import Image from "@/components/ui/Image";
import RichTextView from "@/components/ui/rich-text-viewer";
import { ShareBtn } from "@/components/buttons/ShareBtn";

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const company = await fetchCompanyByHandle(handle, SCompanyPage);
  if(!company) return (
     <div className="w-full text-lg font-bold text-gray-600 py-18  text-center ">Company Not found!</div>
  )

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ================= HERO ================= */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
          {/* Logo */}
          <div className="w-32 h-32 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
            {company.logoUrl ? (
              <Image
                src={company.logoUrl}
                alt={`${company.name} logo`}
                width={120}
                height={120}
                className="object-contain"
              />
            ) : (
              <span className="text-3xl font-bold text-gray-400">
                {company.name[0]}
              </span>
            )}
          </div>

          {/* Identity */}
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {company.name}
            </h1>

            {company.slogan && (
              <p className="text-lg text-gray-600 max-w-2xl">
                {company.slogan}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              {company.website && (
                <Link
                  href={company.website}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300"
                >
                  <Globe className="w-4 h-4" />
                  Visit Website
                </Link>
              )}
              <ShareBtn shareTitle={company.name} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= QUICK FACTS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-6">
        <Fact icon={Calendar} label="Founded" value={company.foundedYear} />
        <Fact icon={Users} label="Company Size" value={company.companySize} />
        <Fact
          icon={MapPin}
          label="Location"
          value={`${company.location?.city ?? "Kigali"}, ${company.location?.country ?? "Rwanda"}`}
        />
      </section>

      {/* ================= ABOUT ================= */}
      <section className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        {company.descriptions.map((desc, i) => (
          <div key={i}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              {desc.title}
            </h2>
            {
               desc.title === "Detailed" ? 
                   <RichTextView content={desc.description} /> 
               :
            <p className="text-gray-700 leading-relaxed max-w-4xl">
              {desc.description}
            </p>
          }
          </div>
        ))}
      </section>

      {/* ================= PROJECTS ================= */}
      {company.projects.length > 0 && (
        <section className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Projects & Portfolio
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {company.projects.map((project, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200 p-5 hover:shadow-lg transition"
                >
                  <h3 className="font-semibold text-gray-900">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Client: {project.clientName}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {project.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= FOUNDERS ================= */}
      {company.founders.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Leadership
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {company.founders.map((founder, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-6 text-center"
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 overflow-hidden mb-4">
                  {founder.image && (
                    <Image
                      src={founder.image}
                      alt={founder.name}
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900">
                  {founder.name}
                </h3>
                <p className="text-sm text-gray-600">{founder.title}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= CONTACT ================= */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Contact Information
            </h2>

            <ul className="space-y-3 text-gray-300">
              {company.email && (
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {company.email}
                </li>
              )}
              {company.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> {company.phone}
                </li>
              )}
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {company.location?.address}
              </li>
            </ul>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Get in touch</h3>
            <p className="text-sm text-gray-300">
              Reach out to this company for partnerships, projects, or
              inquiries.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- Small helper ---------- */
function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string | number | null;
}) {
  if (!value) return null;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-yellow-400 flex items-center justify-center">
        <Icon className="w-5 h-5 text-gray-900" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
