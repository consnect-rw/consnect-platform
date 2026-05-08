import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Create Account | Consnect",
  description:
    "Create your free Consnect account to start finding construction tenders, connecting with contractors, and growing your construction business in Rwanda.",
  robots: { index: true, follow: true }, // Registration CTA should be indexable
  alternates: { canonical: "https://consnect.rw/auth/register" },
  openGraph: {
    title: "Join Consnect — Rwanda's Construction Platform",
    description: "Create a free account and start connecting with construction companies, tenders, and opportunities.",
    url: "https://consnect.rw/auth/register",
    type: "website",
  },
};

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
