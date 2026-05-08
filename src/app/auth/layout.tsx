import AuthWrapper from "@/context/AuthWrapper";
import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Sign in to Consnect",
    template: "%s | Consnect",
  },
  description: "Sign in or create your Consnect account to access construction tenders, company profiles, and business opportunities across Rwanda.",
  robots: { index: false, follow: false }, // Auth pages should not be indexed
};

export default async function AuthLayout ({children}:{children: ReactNode}) {
     return (
          <AuthWrapper>{children}</AuthWrapper>
     )
}