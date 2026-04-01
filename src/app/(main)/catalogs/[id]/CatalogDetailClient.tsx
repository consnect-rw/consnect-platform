"use client";

import Image from "@/components/ui/Image";
import Link from "next/link";
import { PdfViewerButton } from "@/components/buttons/PdfViewerButton";
import {
  Building2, MapPin, Mail, Phone, Globe, Calendar, Users,
  FileText, Shield, ArrowLeft, Eye, Download, BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(
  () => import("@/components/ui/PdfViewer").then((mod) => ({ default: mod.PdfViewer })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-600 font-medium text-sm">Loading viewer...</p>
        </div>
      </div>
    ),
  }
);

interface CatalogDetailClientProps {
  catalog: {
    id: string;
    name: string;
    description: string;
    image: string;
    fileUrl: string;
    createdAt: Date;
    updatedAt: Date;
    company: {
      id: string;
      name: string;
      handle: string;
      logoUrl: string | null;
      phone: string;
      email: string;
      website: string | null;
      foundedYear: number;
      companySize: number;
      slogan: string | null;
      verification: { status: string; isGoldVerified: boolean; isSilverVerified: boolean; isBronzeVerified: boolean } | null;
      location: { country: string | null; city: string | null; state: string | null } | null;
      specializations: { name: string }[];
    };
  };
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

export default function CatalogDetailClient({ catalog }: CatalogDetailClientProps) {
  const company = catalog.company;
  const isPdf = catalog.fileUrl?.toLowerCase().endsWith(".pdf");

  const verificationBadge = () => {
    const v = company.verification;
    if (!v) return null;
    if (v.isGoldVerified) return <Badge className="bg-yellow-400 text-gray-900 hover:bg-yellow-400 text-xs font-bold">GOLD</Badge>;
    if (v.isSilverVerified) return <Badge className="bg-gray-300 text-gray-900 hover:bg-gray-300 text-xs font-bold">SILVER</Badge>;
    if (v.isBronzeVerified) return <Badge className="bg-orange-200 text-orange-900 hover:bg-orange-200 text-xs font-bold">BRONZE</Badge>;
    if (v.status === "VERIFIED") return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs font-bold">VERIFIED</Badge>;
    return null;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/catalogs"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Catalogs
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left column: Info ── */}
          <div className="lg:col-span-1 space-y-5 order-2 lg:order-1">
            {/* Catalog info card */}
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
              {catalog.image && (
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <Image src={catalog.image} alt={catalog.name} className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 px-2 py-1 bg-white/95 backdrop-blur-sm rounded-md flex items-center gap-1 shadow">
                    <BookOpen size={12} className="text-yellow-500" />
                    <span className="text-[10px] font-black text-gray-900 uppercase">Catalog</span>
                  </div>
                </div>
              )}

              <div className="p-5">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-2 leading-tight">{catalog.name}</h1>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{catalog.description}</p>

                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    Published {formatDate(catalog.createdAt)}
                  </span>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-2">
                  {isPdf && (
                    <PdfViewerButton
                      fileUrl={catalog.fileUrl}
                      title={catalog.name}
                      btnLabel="Open in Viewer"
                      btnIcon={Eye}
                      size="md"
                      variant="primary"
                      className="w-full justify-center"
                    />
                  )}
                  {catalog.fileUrl && (
                    <a
                      href={catalog.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold border-2 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 text-gray-700 rounded-lg transition-all"
                    >
                      <Download size={16} />
                      Download File
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Company card */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Building2 size={16} className="text-gray-400" />
                <h2 className="text-sm font-bold text-gray-900">Published by</h2>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-lg border-2 border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                  {company.logoUrl ? (
                    <Image src={company.logoUrl} alt={company.name} className="object-cover w-full h-full" />
                  ) : (
                    <Building2 size={20} className="text-gray-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-sm font-black text-gray-900 truncate">{company.name}</p>
                    {verificationBadge()}
                  </div>
                  {company.slogan && <p className="text-xs text-gray-500 truncate">{company.slogan}</p>}
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-600">
                {company.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-gray-400 shrink-0" />
                    {[company.location.city, company.location.state, company.location.country].filter(Boolean).join(", ")}
                  </div>
                )}
                {company.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-gray-400 shrink-0" />
                    <span className="truncate">{company.email}</span>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-gray-400 shrink-0" />
                    {company.phone}
                  </div>
                )}
                {company.website && (
                  <div className="flex items-center gap-2">
                    <Globe size={13} className="text-gray-400 shrink-0" />
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:underline truncate">{company.website}</a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar size={13} className="text-gray-400 shrink-0" />
                  Founded {company.foundedYear}
                </div>
                <div className="flex items-center gap-2">
                  <Users size={13} className="text-gray-400 shrink-0" />
                  {company.companySize} employees
                </div>
              </div>

              {company.specializations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Specializations</p>
                  <div className="flex flex-wrap gap-1">
                    {company.specializations.map((s, i) => (
                      <span key={i} className="text-[11px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">{s.name}</span>
                    ))}
                  </div>
                </div>
              )}

              <Link
                href={`/company/${company.handle}`}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors"
              >
                View Company Profile
                <ArrowLeft size={12} className="rotate-180" />
              </Link>
            </div>
          </div>

          {/* ── Right column: PDF viewer ── */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {isPdf ? (
              <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden h-[70vh] sm:h-[80vh]">
                <PdfViewer pdfUrl={catalog.fileUrl} title={catalog.name} />
              </div>
            ) : catalog.fileUrl ? (
              <div className="bg-white rounded-xl border-2 border-gray-200 p-12 flex flex-col items-center justify-center text-center h-96">
                <FileText className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-black text-gray-900 mb-2">Document Preview Unavailable</h3>
                <p className="text-sm text-gray-500 mb-4 max-w-sm">
                  This catalog file is not a PDF and cannot be previewed inline. Download it to view its contents.
                </p>
                <a
                  href={catalog.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-2 px-5 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-xl transition-all"
                >
                  <Download size={18} />
                  Download File
                </a>
              </div>
            ) : (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 flex flex-col items-center justify-center text-center h-96">
                <FileText className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-black text-gray-900 mb-2">No File Attached</h3>
                <p className="text-sm text-gray-500">This catalog does not have an attached document.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
