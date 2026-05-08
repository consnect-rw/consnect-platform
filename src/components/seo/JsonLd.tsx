/**
 * JsonLd — injects structured data (JSON-LD) into the page <head>
 * Use in Server Components via generateMetadata or directly in page JSX.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── Helpers to build common schema types ────────────────────────────────────

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Consnect",
    url: "https://consnect.rw",
    description: "Rwanda's leading digital platform for construction companies, tenders, and business opportunities.",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: "https://consnect.rw/search?q={search_term_string}" },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Consnect Ltd",
      url: "https://consnect.rw",
      logo: { "@type": "ImageObject", url: "https://consnect.rw/logo/consnect.png" },
    },
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Consnect Ltd",
    url: "https://consnect.rw",
    logo: "https://consnect.rw/logo/consnect.png",
    description:
      "Consnect is Rwanda's leading digital platform connecting construction companies with tenders, business opportunities, and partners.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "KG 7 Ave",
      addressLocality: "Kigali",
      addressCountry: "RW",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+250789407079",
      contactType: "customer support",
      email: "info@consnect.rw",
      availableLanguage: ["English"],
    },
    sameAs: [
      "https://x.com/consnect",
      "https://linkedin.com/company/consnect",
      "https://facebook.com/consnect",
      "https://instagram.com/consnect",
    ],
  };
}

export function buildCompanySchema(company: {
  name: string;
  handle: string;
  slogan?: string | null;
  logoUrl?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  foundedYear?: number | null;
  location?: { country?: string | null; city?: string | null; address?: string | null } | null;
  descriptions?: { title: string; description: string }[];
  socialMedia?: {
    facebook?: string | null;
    twitter?: string | null;
    linkedin?: string | null;
    instagram?: string | null;
    youtube?: string | null;
  } | null;
}) {
  const description = company.descriptions?.find((d) => d.title === "Overview")?.description ?? company.slogan ?? "";
  const sameAs = [
    company.website,
    company.socialMedia?.facebook,
    company.socialMedia?.twitter,
    company.socialMedia?.linkedin,
    company.socialMedia?.instagram,
    company.socialMedia?.youtube,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: `https://consnect.rw/company/${encodeURIComponent(company.handle)}`,
    ...(company.logoUrl && { logo: company.logoUrl }),
    ...(company.website && { sameAs: [company.website, ...sameAs] }),
    description,
    ...(company.email && { email: company.email }),
    ...(company.phone && { telephone: company.phone }),
    ...(company.foundedYear && { foundingDate: String(company.foundedYear) }),
    ...(company.location && {
      address: {
        "@type": "PostalAddress",
        streetAddress: company.location.address ?? "",
        addressLocality: company.location.city ?? "",
        addressCountry: company.location.country ?? "RW",
      },
    }),
    ...(sameAs.length > 0 && { sameAs }),
  };
}

export function buildOfferSchema(offer: {
  id: string;
  title: string;
  description?: string | null;
  createdAt: Date;
  timeline?: { deadline?: Date | null } | null;
  pricing?: { budgetMin?: number | null; budgetMax?: number | null; currency?: string | null } | null;
  company?: { name: string; handle: string } | null;
  category?: { name: string } | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: offer.title,
    description: offer.description ?? "",
    datePosted: offer.createdAt.toISOString(),
    ...(offer.timeline?.deadline && { validThrough: offer.timeline.deadline.toISOString() }),
    ...(offer.company && {
      hiringOrganization: {
        "@type": "Organization",
        name: offer.company.name,
        sameAs: `https://consnect.rw/company/${encodeURIComponent(offer.company.handle)}`,
      },
    }),
    ...(offer.pricing?.budgetMin && {
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: offer.pricing.currency ?? "RWF",
        value: { "@type": "QuantitativeValue", minValue: offer.pricing.budgetMin, maxValue: offer.pricing.budgetMax ?? offer.pricing.budgetMin },
      },
    }),
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressCountry: "RW" } },
    url: `https://consnect.rw/offer/${offer.id}`,
    employmentType: "CONTRACTOR",
    industry: offer.category?.name ?? "Construction",
  };
}

export function buildArticleSchema(blog: {
  id: string;
  title: string;
  description?: string | null;
  featuredImageUrl?: string | null;
  publishedAt?: Date | null;
  updatedAt: Date;
  author?: { name?: string | null } | null;
  tags?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.description ?? "",
    url: `https://consnect.rw/blog/${blog.id}`,
    ...(blog.featuredImageUrl && {
      image: { "@type": "ImageObject", url: blog.featuredImageUrl, width: 1200, height: 630 },
    }),
    datePublished: blog.publishedAt?.toISOString() ?? blog.updatedAt.toISOString(),
    dateModified: blog.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: blog.author?.name ?? "Consnect Editorial",
    },
    publisher: {
      "@type": "Organization",
      name: "Consnect",
      logo: { "@type": "ImageObject", url: "https://consnect.rw/logo/consnect.png" },
    },
    keywords: blog.tags?.join(", ") ?? "",
    inLanguage: "en",
  };
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function buildItemListSchema(
  items: { name: string; url: string; image?: string }[],
  listName: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
      ...(item.image && { image: item.image }),
    })),
  };
}
