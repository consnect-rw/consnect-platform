import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sign In | Consnect",
  description: "Sign in to your Consnect account to manage tenders, company profiles, and construction opportunities.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://consnect.rw/auth/login" },
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
