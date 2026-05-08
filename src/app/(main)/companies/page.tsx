import { CompanyCard } from "@/components/cards/CompanyCard";
import Pagination from "@/components/ui/Pagination";
import { fetchCompanys } from "@/server/company/company";
import { SCompanyCard } from "@/types/company/company";
import type { Metadata } from "next";
import { JsonLd, buildItemListSchema, buildBreadcrumbSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Verified Construction Companies in Rwanda | Consnect",
  description:
    "Browse hundreds of verified construction companies, contractors, suppliers, and engineering firms across Rwanda. All companies are verified and trusted on Consnect.",
  keywords: [
    "construction companies Rwanda",
    "verified contractors Rwanda",
    "building companies Kigali",
    "construction firms Rwanda",
    "engineering companies Rwanda",
    "civil contractors Rwanda",
    "suppliers Rwanda",
  ],
  alternates: { canonical: "https://consnect.rw/companies" },
  openGraph: {
    title: "Verified Construction Companies in Rwanda | Consnect",
    description:
      "Find trusted and verified construction companies across Rwanda. Browse profiles, portfolios, and services.",
    url: "https://consnect.rw/companies",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verified Construction Companies in Rwanda | Consnect",
    description: "Browse verified construction companies across Rwanda on Consnect.",
  },
};

const PER_PAGE = 200;

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params?.page ?? 1);
  const skip = (page - 1) * PER_PAGE;

  const companiesData = await fetchCompanys(
    SCompanyCard,
    { verification: { status: "VERIFIED" } },
    PER_PAGE,
    skip
  );

  const companies = companiesData?.data ?? [];
  const total = companiesData?.pagination?.total ?? 0;

  const listSchema = buildItemListSchema(
    companies.map((c) => ({
      name: c.name,
      url: `https://consnect.rw/company/${encodeURIComponent(c.handle)}`,
      image: c.logoUrl ?? undefined,
    })),
    "Verified Construction Companies in Rwanda"
  );

  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", url: "https://consnect.rw" },
    { name: "Companies", url: "https://consnect.rw/companies" },
  ]);

  return (
    <>
      <JsonLd data={listSchema} />
      <JsonLd data={breadcrumb} />
      <main className="w-full max-w-7xl mx-auto my-8 flex flex-col gap-8">
        <header className="flex flex-col gap-4 items rounded-xl bg-linear-to-br from-gray-800 to-slate-800 p-8">
          <h1 className="text-3xl font-extrabold text-gray-50">
            Trusted and verified construction companies
          </h1>
          <p className="text-gray-200 font-medium text-lg">
            Partner with {total} companies registered on the platform!
          </p>
        </header>

        {companies.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No companies found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}

        <Pagination
          itemsPerPage={PER_PAGE}
          currentPage={page}
          onPageChange={() => {}}
          totalItems={total}
        />
      </main>
    </>
  );
}