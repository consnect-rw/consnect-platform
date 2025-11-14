import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/context/QueryProvider";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Consnect",
  description: "Leading in construction tenders and offers in Rwanda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light" // Forces light theme only
          enableSystem={false}
        >
          
              <QueryProvider>
              {children}
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
          </body>
    </html>
  );
}
