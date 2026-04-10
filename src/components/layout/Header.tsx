"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { CgMenuRightAlt } from "react-icons/cg";
import { X, ChevronRight, LayoutDashboard, Settings, MessageSquare, FileText, Tag, Users, Building2, ShieldCheck, BarChart3, LogOut, ChevronDown, Headphones, Newspaper, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { NavLinks } from "@/lib/data/nav-links";
import { useAuth } from "@/hooks/useAuth";
import { EUserRole } from "@prisma/client";
import { logoutUser } from "@/util/auth";
import { useQuery } from "@tanstack/react-query";
import { fetchCategorys } from "@/server/common/category";
import { INavLink } from "@/types/common/nav-link";

// ─── Quick links per role ───────────────────────────────────────────────────
const userQuickLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Offers", href: "/dashboard/offers", icon: Tag },
  { label: "Tenders", href: "/dashboard/tenders", icon: FileText },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const adminQuickLinks = [
  { label: "Overview", href: "/admin", icon: BarChart3 },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Companies", href: "/admin/companies", icon: Building2 },
  { label: "Offers", href: "/admin/offers", icon: Tag },
  { label: "Blogs", href: "/admin/blogs", icon: Newspaper },
  { label: "Support", href: "/admin/support", icon: Headphones },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

// ─── Category fetch hook for mega menus ─────────────────────────────────────
function useMegaCategories() {
  const { data: tenderData } = useQuery({
    queryKey: ["header-categories", "TENDER"],
    queryFn: () => fetchCategorys({ id: true, name: true }, { type: "TENDER" }, 20),
    staleTime: 5 * 60 * 1000,
  });
  const { data: serviceData } = useQuery({
    queryKey: ["header-categories", "SERVICE"],
    queryFn: () => fetchCategorys({ id: true, name: true }, { type: "SERVICE" }, 20),
    staleTime: 5 * 60 * 1000,
  });
  const tenderCategories: TMegaCategory[] = tenderData?.data ?? [];
  const serviceCategories: TMegaCategory[] = serviceData?.data ?? [];
  return { tenderCategories, serviceCategories };
}

type TMegaCategory = { id: string; name: string };

/** Returns categories & link config for a given megaKey */
function getMegaData(megaKey: "offers" | "tenders" | "companies", tender: TMegaCategory[], service: TMegaCategory[]) {
  if (megaKey === "offers") {
    return { categories: tender, basePath: "/offer?category=", viewAllHref: "/offer", viewAllLabel: "View All Offers" };
  }
  if (megaKey === "tenders") {
    return { categories: tender, basePath: "/tender?category=", viewAllHref: "/tender", viewAllLabel: "View All Tenders" };
  }
  return { categories: service, basePath: "/companies?category=", viewAllHref: "/companies", viewAllLabel: "View All Companies" };
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <MobileView isScrolled={isScrolled} user={user} />
      <DesktopView isScrolled={isScrolled} user={user} />
    </>
  );
}

export const MobileView = ({ isScrolled, user }: { isScrolled: boolean; user: import("@/types/auth/user").TSessionUser | null | undefined }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMegaKey, setExpandedMegaKey] = useState<string | null>(null);
  const isAdmin = user?.role === EUserRole.ADMIN;
  const quickLinks = isAdmin ? adminQuickLinks : userQuickLinks;
  const close = () => { setIsMobileMenuOpen(false); setExpandedMegaKey(null); };
  const { tenderCategories, serviceCategories } = useMegaCategories();

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
        <div className="fixed inset-0 z-100 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />

          {/* Menu Panel */}
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto animate-slide-in-right">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b-2 border-gray-200">
              <LogoLink />
              <button
                onClick={close}
                aria-label="Close menu"
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-900" />
              </button>
            </div>

            {/* Logged-in: profile strip */}
            {user && (
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 rounded-full bg-yellow-500 flex items-center justify-center text-gray-900 font-bold text-sm shrink-0">
                    {user.name?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  {isAdmin && (
                    <span className="ml-auto flex items-center gap-1 text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full shrink-0">
                      <ShieldCheck size={11} /> Admin
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="p-6 space-y-2">
              {NavLinks.map((link, index) => (
                <MobileNavItem
                  key={`mobile-nav-link-${index}`}
                  link={link}
                  isExpanded={expandedMegaKey === link.megaKey}
                  onToggle={() => setExpandedMegaKey(expandedMegaKey === link.megaKey ? null : (link.megaKey ?? null))}
                  tenderCategories={tenderCategories}
                  serviceCategories={serviceCategories}
                  close={close}
                />
              ))}
            </nav>

            {/* Logged-in: quick links */}
            {user && (
              <div className="px-6 pb-4 space-y-1 border-t border-gray-200 pt-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
                  {isAdmin ? "Admin Panel" : "My Account"}
                </p>
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-yellow-50 hover:text-gray-900 rounded-lg font-semibold text-sm transition-all"
                  >
                    <link.icon size={16} className="text-yellow-500 shrink-0" />
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={() => { close(); logoutUser(); }}
                  className="w-full flex items-center gap-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg font-semibold text-sm transition-all"
                >
                  <LogOut size={16} className="shrink-0" />
                  Sign Out
                </button>
              </div>
            )}

            {/* Guest: Auth Buttons */}
            {!user && (
              <div className="p-6 space-y-3 border-t-2 border-gray-200">
                <Link href="/auth/login" onClick={close} className="block">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-full font-bold text-base py-6 border-2 border-gray-900 hover:bg-gray-100"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={close} className="block">
                  <Button
                    type="button"
                    className="w-full rounded-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold text-base py-6 shadow-lg"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

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

export const DesktopView = ({ isScrolled, user }: { isScrolled: boolean; user: import("@/types/auth/user").TSessionUser | null | undefined }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeMegaKey, setActiveMegaKey] = useState<string | null>(null);
  const megaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAdmin = user?.role === EUserRole.ADMIN;
  const quickLinks = isAdmin ? adminQuickLinks : userQuickLinks;
  const { tenderCategories, serviceCategories } = useMegaCategories();

  const openMega = useCallback((key: string) => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    setActiveMegaKey(key);
  }, []);

  const closeMega = useCallback(() => {
    megaTimeoutRef.current = setTimeout(() => setActiveMegaKey(null), 150);
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => { if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current); };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
                <div
                  key={`desktop-header-nav-link-${index}`}
                  className="relative"
                  onMouseEnter={link.megaKey ? () => openMega(link.megaKey!) : undefined}
                  onMouseLeave={link.megaKey ? closeMega : undefined}
                >
                  {link.megaKey ? (
                    <button
                      type="button"
                      onClick={() => setActiveMegaKey(activeMegaKey === link.megaKey ? null : link.megaKey!)}
                      className="relative group text-gray-900 text-sm font-bold hover:text-yellow-600 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>{link.name}</span>
                      <ChevronDown size={13} className={`text-gray-400 group-hover:text-yellow-500 transition-transform duration-200 ${activeMegaKey === link.megaKey ? "rotate-180" : ""}`} />
                      <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
                    </button>
                  ) : (
                    <Link
                      prefetch
                      className="relative group text-gray-900 text-sm font-bold hover:text-yellow-600 transition-colors flex items-center gap-1"
                      href={link.href ?? "/"}
                    >
                      <span>{link.name}</span>
                      <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  )}

                  {/* Mega Dropdown */}
                  {link.megaKey && activeMegaKey === link.megaKey && (
                    <MegaDropdown
                      megaKey={link.megaKey}
                      tenderCategories={tenderCategories}
                      serviceCategories={serviceCategories}
                      onMouseEnter={() => openMega(link.megaKey!)}
                      onMouseLeave={closeMega}
                      onLinkClick={() => setActiveMegaKey(null)}
                    />
                  )}
                </div>
              ))}
            </nav>

            {/* Auth area */}
            <div className="flex items-center gap-3">
              {user ? (
                /* ── Logged-in profile dropdown ── */
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full border-2 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 transition-all group"
                  >
                    <div className="w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center text-gray-900 font-bold text-xs shrink-0">
                      {user.name?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                    <span className="text-sm font-bold text-gray-900 max-w-30 truncate">{user.name}</span>
                    {isAdmin && (
                      <span className="flex items-center gap-0.5 text-xs bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded-full">
                        <ShieldCheck size={10} /> Admin
                      </span>
                    )}
                    <ChevronDown size={14} className={`text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                      {/* User info */}
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          {isAdmin ? "Admin Panel" : "My Account"}
                        </p>
                        <p className="text-sm font-bold text-gray-900 truncate mt-0.5">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      {/* Quick links */}
                      <div className="py-1">
                        {quickLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-yellow-50 hover:text-gray-900 font-medium transition-colors"
                          >
                            <link.icon size={15} className="text-yellow-500 shrink-0" />
                            {link.label}
                          </Link>
                        ))}
                      </div>
                      {/* Sign out */}
                      <div className="border-t border-gray-100 py-1">
                        <button
                          onClick={() => { setDropdownOpen(false); logoutUser(); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                        >
                          <LogOut size={15} className="shrink-0" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* ── Guest buttons ── */
                <>
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
                </>
              )}
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
          className="w-28 lg:w-32 aspect-5/2 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
          priority
        />
      </div>
    </Link>
  );
};

// ─── Mega Dropdown (Desktop) ────────────────────────────────────────────────
const MegaDropdown = ({
  megaKey,
  tenderCategories,
  serviceCategories,
  onMouseEnter,
  onMouseLeave,
  onLinkClick,
}: {
  megaKey: "offers" | "tenders" | "companies";
  tenderCategories: TMegaCategory[];
  serviceCategories: TMegaCategory[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onLinkClick: () => void;
}) => {
  const { categories, basePath, viewAllHref, viewAllLabel } = getMegaData(megaKey, tenderCategories, serviceCategories);

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 top-16 pt-3 z-50 w-full max-w-5xl px-6"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="px-6 py-3.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Browse Categories</p>
          <Link
            href={viewAllHref}
            onClick={onLinkClick}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-yellow-600 transition-colors"
          >
            {viewAllLabel}
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Category Grid */}
        <div className="p-5 grid grid-cols-3 gap-1.5 max-h-80 overflow-y-auto">
          {categories.length > 0 ? categories.map((cat) => (
            <Link
              key={cat.id}
              href={`${basePath}${cat.id}`}
              onClick={onLinkClick}
              className="group flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-yellow-50 transition-all"
            >
              <span className="w-8 h-8 rounded-md bg-gray-900 group-hover:bg-yellow-500 flex items-center justify-center text-white group-hover:text-gray-900 text-xs font-bold shrink-0 transition-colors">
                {cat.name.charAt(0).toUpperCase()}
              </span>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 truncate transition-colors">
                {cat.name}
              </span>
            </Link>
          )) : (
            <p className="col-span-3 text-sm text-gray-400 text-center py-6">No categories yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Mobile Nav Item (with accordion for mega links) ────────────────────────
const MobileNavItem = ({
  link,
  isExpanded,
  onToggle,
  tenderCategories,
  serviceCategories,
  close,
}: {
  link: INavLink;
  isExpanded: boolean;
  onToggle: () => void;
  tenderCategories: TMegaCategory[];
  serviceCategories: TMegaCategory[];
  close: () => void;
}) => {
  if (!link.megaKey) {
    return (
      <Link
        href={link.href ?? "/"}
        onClick={close}
        className="group flex items-center justify-between px-4 py-4 text-gray-900 hover:bg-yellow-50 rounded-lg font-bold text-lg transition-all hover:translate-x-1 transform"
      >
        <span>{link.name}</span>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-500 transition-colors" />
      </Link>
    );
  }

  const { categories, basePath, viewAllHref, viewAllLabel } = getMegaData(link.megaKey, tenderCategories, serviceCategories);

  return (
    <div>
      {/* Toggle row */}
      <button
        onClick={onToggle}
        className="w-full group flex items-center justify-between px-4 py-4 text-gray-900 hover:bg-yellow-50 rounded-lg font-bold text-lg transition-all"
      >
        <span>{link.name}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 group-hover:text-yellow-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
      </button>

      {/* Accordion content */}
      {isExpanded && (
        <div className="ml-4 mb-2 space-y-0.5 animate-fade-in">
          {/* View all link */}
          <Link
            href={viewAllHref}
            onClick={close}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-yellow-50 transition-all"
          >
            <span className="w-7 h-7 rounded-md bg-yellow-500 flex items-center justify-center shrink-0">
              <ArrowRight size={14} className="text-gray-900" />
            </span>
            <span className="text-sm font-bold text-gray-900">{viewAllLabel}</span>
          </Link>

          {/* Category links */}
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`${basePath}${cat.id}`}
              onClick={close}
              className="group flex items-center gap-2.5 px-4 py-2.5 rounded-lg hover:bg-yellow-50 transition-all"
            >
              <span className="w-7 h-7 rounded-md bg-gray-100 group-hover:bg-gray-900 flex items-center justify-center text-gray-600 group-hover:text-white text-xs font-bold shrink-0 transition-colors">
                {cat.name.charAt(0).toUpperCase()}
              </span>
              <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 truncate transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}

          {categories.length === 0 && (
            <p className="px-4 py-3 text-sm text-gray-400">No categories yet</p>
          )}
        </div>
      )}
    </div>
  );
};

// Add animation styles
const styles = `
  @keyframes slide-in-right {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-slide-in-right {
    animation: slide-in-right 0.3s ease-out forwards;
  }
  .animate-fade-in {
    animation: fade-in 0.15s ease-out forwards;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = styles;
  document.head.appendChild(styleTag);
}

