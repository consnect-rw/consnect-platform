import type { Metadata } from "next";
import { ReactNode } from "react";
import ConsnectFAQs from "@/lib/data/faqs";
import { JsonLd, buildFAQSchema, buildBreadcrumbSchema } from "@/components/seo/JsonLd";

// Flatten all FAQs for structured data
const allFaqs = ConsnectFAQs.categories.flatMap((cat) =>
  cat.faqs.map((f) => ({ question: f.question, answer: f.answer }))
);

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Consnect",
  description:
    "Find answers to common questions about Consnect — how to register, post tenders, manage your company profile, advertise, and more.",
  keywords: [
    "Consnect FAQ",
    "construction platform help",
    "how to use Consnect",
    "Consnect guide",
    "construction tenders help Rwanda",
  ],
  alternates: { canonical: "https://consnect.rw/faqs" },
  openGraph: {
    title: "Frequently Asked Questions | Consnect",
    description: "Get answers to common questions about using Consnect.",
    url: "https://consnect.rw/faqs",
    type: "website",
  },
};

export default function FAQsLayout({ children }: { children: ReactNode }) {
  const faqSchema = buildFAQSchema(allFaqs);
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", url: "https://consnect.rw" },
    { name: "FAQs", url: "https://consnect.rw/faqs" },
  ]);
  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumb} />
      {children}
    </>
  );
}
