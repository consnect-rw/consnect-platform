import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Construction Industry News & Insights | Consnect Blog",
  description:
    "Read the latest construction industry news, project insights, company spotlights, and expert advice from Rwanda's leading construction platform. Stay informed with Consnect.",
  keywords: [
    "construction news Rwanda",
    "construction blog Rwanda",
    "construction industry insights",
    "Rwanda construction updates",
    "building industry news",
    "Consnect blog",
    "construction companies news",
  ],
  alternates: { canonical: "https://consnect.rw/blog" },
  openGraph: {
    title: "Construction News & Insights | Consnect Blog",
    description:
      "Explore expert articles, project highlights, and construction industry updates from across Rwanda.",
    url: "https://consnect.rw/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Construction News & Insights | Consnect Blog",
    description: "Read construction industry news and insights on Consnect.",
  },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
