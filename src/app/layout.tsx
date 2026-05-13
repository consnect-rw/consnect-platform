import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/context/QueryProvider";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { ViewProvider } from "@/context/ViewContext";
import { GoogleAnalytics } from '@next/third-parties/google'
import { BannersProvider } from "@/context/BannerContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://consnect.rw";

export const viewport: Viewport = {
  themeColor: "#f59e0b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Consnect | Rwanda's #1 Construction Platform",
    template: "%s | Consnect",
  },
  description:
    "Consnect is Rwanda's leading digital platform connecting construction companies with tenders, business opportunities, partners, and project portfolios. Find verified contractors, suppliers, and engineers across Rwanda.",
  keywords: [
    "construction companies Rwanda",
    "construction tenders Rwanda",
    "building contractors Kigali",
    "construction platform Rwanda",
    "tender opportunities Rwanda",
    "construction business Rwanda",
    "Consnect",
    "construction marketplace Africa",
    "construction partnerships Rwanda",
    "contractors Kigali",
  ],
  authors: [{ name: "Consnect Ltd", url: BASE_URL }],
  creator: "Consnect Ltd",
  publisher: "Consnect Ltd",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_RW",
    url: BASE_URL,
    siteName: "Consnect",
    title: "Consnect | Rwanda's #1 Construction Platform",
    description:
      "Connect with verified construction companies, find tenders, and grow your construction business in Rwanda.",
    images: [{ url: "/og/default.png", width: 1200, height: 630, alt: "Consnect — Rwanda's Construction Platform" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@consnect",
    creator: "@consnect",
    title: "Consnect | Rwanda's #1 Construction Platform",
    description: "Find construction tenders, verified companies, and business opportunities in Rwanda.",
    images: ["/og/default.png"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  category: "business",
  verification: {
    google: "KMv8qIzq4vH2yhyqDHUwY53xArFh1OrNGkwSEvcUMgg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to asset CDNs for faster LCP */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Replace with your real S3 bucket domain */}
        <link rel="dns-prefetch" href="https://desc-s3.s3.eu-north-1.amazonaws.com" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/logo/consnect.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen m-0 p-0`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light" // Forces light theme only
          enableSystem={false}
        >
          
              <QueryProvider>
                  <ViewProvider>
                    <BannersProvider>
                    {children}
                    </BannersProvider>
                  </ViewProvider>
            </QueryProvider>
            <Toaster
              position="bottom-center"
              theme="light"
              expand={true}
              closeButton
              toastOptions={{
                classNames:{
                  toast: "bg-black border-amber-500 text-amber-400",
                  title: "text-amber-400",
                  description: "text-amber-500",
                }
              }}
            />
            
        </ThemeProvider>
        <GoogleAnalytics gaId="G-3XMPXP1HE4" />
          </body>
    </html>
  );
}
