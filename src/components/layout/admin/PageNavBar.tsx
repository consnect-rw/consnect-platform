"use client";

import { ChevronDown, FileText, Link2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IconType } from "react-icons/lib";

export default function AdminPageNavBar({links}:{links: {name: string, href: string, icon: IconType}[]}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex w-full items-center justify-start gap-3 bg-white rounded-xl p-2 shadow-sm border border-gray-200">
        {links.map((link, index) => (
          <NavLink
            key={`user-offer-link-${index}`}
            name={link.name}
            href={link.href}
            icon={link.icon}
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
              const activeItem = links.find(link => link.href === pathname);
              const Icon = activeItem?.icon || Link2;
              return (
                <>
                  <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-200" />
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
            {links.map((link, index) => (
              <MobileNavLink
                key={`mobile-offer-link-${index}`}
                name={link.name}
                href={link.href}
                icon={link.icon}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// Desktop Nav Link Component
function NavLink({ name, href, icon: Icon, }: {  name: string;  href: string;  icon: IconType;}) {
     const pathname = usePathname();
     const isActive = pathname === href;
  return (
    <Link prefetch
      href={href}
      className={`
        group relative flex items-center gap-2.5 px-4 py-2.5 rounded-lg font-medium text-sm
        transition-all duration-200 ease-out
        ${isActive 
          ? 'bg-gray-700 text-gray-100 shadow-md' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }
      `}
    >
      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
        isActive ? 'text-gray-200' : 'text-gray-500'
      }`} />
      <span>{name}</span>
      
      {/* Active indicator line */}
      {isActive && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gray-600 rounded-full" />
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
          ? 'bg-yellow-50 border-l-4 border-gray-600' 
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