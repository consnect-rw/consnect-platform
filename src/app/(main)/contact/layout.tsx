import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact Consnect | Get in Touch",
  description:
    "Contact Consnect for inquiries about advertising, partnerships, technical support, or general questions. We're based in Kigali, Rwanda and available Monday–Friday.",
  keywords: ["contact Consnect", "Consnect support", "Consnect Kigali", "construction platform contact Rwanda"],
  alternates: { canonical: "https://consnect.rw/contact" },
  openGraph: {
    title: "Contact Consnect",
    description: "Get in touch with Consnect — Rwanda's leading construction platform.",
    url: "https://consnect.rw/contact",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
