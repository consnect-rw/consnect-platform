"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CgMenuRightAlt } from "react-icons/cg";
import { X, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { NavLinks } from "@/lib/data/nav-links";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <MobileView isScrolled={isScrolled} />
      <DesktopView isScrolled={isScrolled} />
    </>
  );
}

export const MobileView = ({ isScrolled }: { isScrolled: boolean }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 lg:hidden transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-lg border-b-2 border-gray-200"
            : "bg-white/95 backdrop-blur-sm"
        }`}
      >
        <div className="w-full flex items-center justify-between px-4 py-3">
          <LogoLink />
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
            type="button"
            className="group p-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all hover:scale-105 transform"
          >
            <CgMenuRightAlt size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto animate-slide-in-right">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b-2 border-gray-200">
              <LogoLink />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-900" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="p-6 space-y-2">
              {NavLinks.map((link, index) => (
                <Link
                  key={`mobile-nav-link-${index}`}
                  href={link.href ?? "/"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group flex items-center justify-between px-4 py-4 text-gray-900 hover:bg-yellow-50 rounded-lg font-bold text-lg transition-all hover:translate-x-1 transform"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-500 transition-colors" />
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="p-6 space-y-3 border-t-2 border-gray-200">
              <Link
                href="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block"
              >
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-full font-bold text-base py-6 border-2 border-gray-900 hover:bg-gray-100"
                >
                  Sign In
                </Button>
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block"
              >
                <Button
                  type="button"
                  className="w-full rounded-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold text-base py-6 shadow-lg"
                >
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Footer */}
            <div className="p-6 text-center text-sm text-gray-500 font-medium">
              © {new Date().getFullYear()} Consnect
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content jump */}
      <div className="h-16 lg:hidden" />
    </>
  );
};

export const DesktopView = ({ isScrolled }: { isScrolled: boolean }) => {
  return (
    <>
      <header
        className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-lg border-b-2 border-gray-200"
            : "bg-white/95 backdrop-blur-sm"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <LogoLink />

            {/* Navigation */}
            <nav className="flex items-center gap-8">
              {NavLinks.map((link, index) => (
                <Link
                  prefetch
                  className="relative group text-gray-900 text-sm font-bold hover:text-yellow-600 transition-colors"
                  href={link.href ?? "/"}
                  key={`desktop-header-nav-link-${index}`}
                >
                  <span>{link.name}</span>
                  {/* Animated underline */}
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/auth/login" prefetch>
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full hover:bg-gray-100 font-bold px-6 py-2.5 text-gray-900"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  type="button"
                  className="group rounded-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-6 py-2.5 shadow-lg hover:shadow-xl transition-all hover:scale-105 transform"
                >
                  <span>Get Started</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content jump */}
      <div className="hidden lg:block h-20" />
    </>
  );
};

const LogoLink = () => {
  return (
    <Link href="/" prefetch className="group">
      <div className="relative">
        <Image
          src="/logo/consnect-rb.png"
          width={200}
          height={100}
          alt="Consnect - Construction Platform"
          className="w-28 lg:w-32 aspect-[5/2] object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
          priority
        />
      </div>
    </Link>
  );
};

// Add animation styles
const styles = `
  @keyframes slide-in-right {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .animate-slide-in-right {
    animation: slide-in-right 0.3s ease-out forwards;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = styles;
  document.head.appendChild(styleTag);
}

