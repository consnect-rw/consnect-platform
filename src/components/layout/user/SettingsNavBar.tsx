"use client";

import { useState } from 'react';
import { FileText, ChevronDown, Building2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Better icons that match the context
const SettingLinks = [
  { name: "Company Profile", href: "/dashboard/settings", icon: Building2 },
  { name: "About Company", href: "/dashboard/settings/about", icon: FileText },
  { name: "Founders", href: "/dashboard/settings/founders", icon: FileText },
  { name: "Contact Person", href: "/dashboard/settings/contact-person", icon: FileText },
  { name: "Documents", href: "/dashboard/settings/documents", icon: FileText },
  { name: "Social Media", href: "/dashboard/settings/social-media", icon: FileText },
  { name: "Product Catalogs", href: "/dashboard/settings/catalogs", icon: FileText },
];

export default function CompanySettingsNavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex w-full items-center justify-start gap-3 bg-white rounded-xl p-2 shadow-sm border border-gray-200">
        {SettingLinks.map((offer, index) => (
          <NavLink
            key={`user-offer-link-${index}`}
            name={offer.name}
            href={offer.href}
            icon={offer.icon}
          />
        ))}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden w-full">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-full flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-3">
            {(() => {
              const activeItem = SettingLinks.find(link => link.href === pathname);
              const Icon = activeItem?.icon || FileText;
              return (
                <>
                  <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-900" />
                  </div>
                  <span className="font-semibold text-gray-900">{activeItem?.name || "Menu"}</span>
                </>
              );
            })()}
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {mobileMenuOpen && (
          <div className="mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {SettingLinks.map((offer, index) => (
              <MobileNavLink
                key={`mobile-offer-link-${index}`}
                name={offer.name}
                href={offer.href}
                icon={offer.icon}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// Desktop Nav Link Component
function NavLink({ name, href, icon: Icon, }: {  name: string;  href: string;  icon: any;}) {
     const pathname = usePathname();
     const isActive = pathname === href;
  return (
    <Link prefetch
      href={href}
      className={`
        group relative flex items-center gap-2.5 px-4 py-2.5 rounded-lg font-medium text-sm
        transition-all duration-200 ease-out
        ${isActive 
          ? 'bg-yellow-400 text-gray-900 shadow-md' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }
      `}
    >
      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
        isActive ? 'text-gray-900' : 'text-gray-500'
      }`} />
      <span>{name}</span>
      
      {/* Active indicator line */}
      {isActive && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-yellow-500 rounded-full" />
      )}
    </Link>
  );
}

// Mobile Nav Link Component
function MobileNavLink({ name, href, icon: Icon,}: { name: string; href: string; icon: any; 
}) {
     const pathname = usePathname();
     const isActive = pathname === href;
  return (
    <Link prefetch
      href={href}
      className={`
        flex items-center gap-3 px-4 py-3 transition-colors
        ${isActive 
          ? 'bg-yellow-50 border-l-4 border-yellow-400' 
          : 'border-l-4 border-transparent hover:bg-gray-50'
        }
      `}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        isActive ? 'bg-yellow-400' : 'bg-gray-100'
      }`}>
        <Icon className={`w-5 h-5 ${isActive ? 'text-gray-900' : 'text-gray-600'}`} />
      </div>
      <span className={`font-medium ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
        {name}
      </span>
    </Link>
  );
}