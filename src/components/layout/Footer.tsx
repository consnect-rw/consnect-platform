import { SocialMediaLinks } from "@/lib/data/social-media";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative w-full bg-linear-to-br from-black via-gray-950 to-black text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(250, 204, 21, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(250, 204, 21, 0.3) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      ></div>

      <div className="relative z-10">
        {/* Top Section - Brand & Social */}
        <div className="w-full max-w-7xl mx-auto px-6 pt-16 pb-12 border-b border-white/10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            {/* Logo & Tagline */}
            <div className="flex-1">
              <Link href="/" className="inline-block group">
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={"/logo/consnect-rb.png"}
                    width={120}
                    height={60}
                    className="w-32 rounded-lg object-cover bg-white/80 backdrop-blur-sm border-2 border-white/20 group-hover:border-yellow-400 transition-colors"
                    alt="Consnect - Construction Platform"
                  />
                </div>
              </Link>
              <p className="text-gray-300 font-medium leading-relaxed max-w-md">
                Connecting the construction industry. Build your future with the
                leading platform for tenders, partnerships, and business growth.
              </p>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                Follow Us
              </h4>
              <div className="flex items-center gap-3">
                <Link
                  target="_blank"
                  href={SocialMediaLinks.facebook}
                  className="group w-11 h-11 bg-white/5 hover:bg-yellow-400 border border-white/10 hover:border-yellow-400 rounded-lg flex items-center justify-center transition-all hover:scale-110 transform"
                  title="Consnect Facebook"
                  aria-label="Follow us on Facebook"
                >
                  <FaFacebook
                    size={20}
                    className="text-gray-300 group-hover:text-gray-900 transition-colors"
                  />
                </Link>
                <Link
                  target="_blank"
                  href={SocialMediaLinks.twitter}
                  className="group w-11 h-11 bg-white/5 hover:bg-yellow-400 border border-white/10 hover:border-yellow-400 rounded-lg flex items-center justify-center transition-all hover:scale-110 transform"
                  title="Consnect Twitter"
                  aria-label="Follow us on Twitter"
                >
                  <FaXTwitter
                    size={20}
                    className="text-gray-300 group-hover:text-gray-900 transition-colors"
                  />
                </Link>
                <Link
                  target="_blank"
                  href={SocialMediaLinks.instagram}
                  className="group w-11 h-11 bg-white/5 hover:bg-yellow-400 border border-white/10 hover:border-yellow-400 rounded-lg flex items-center justify-center transition-all hover:scale-110 transform"
                  title="Consnect Instagram"
                  aria-label="Follow us on Instagram"
                >
                  <FaInstagram
                    size={20}
                    className="text-gray-300 group-hover:text-gray-900 transition-colors"
                  />
                </Link>
                <Link
                  target="_blank"
                  href={SocialMediaLinks.whatsappChannel}
                  className="group w-11 h-11 bg-white/5 hover:bg-yellow-400 border border-white/10 hover:border-yellow-400 rounded-lg flex items-center justify-center transition-all hover:scale-110 transform"
                  title="WhatsApp Channel"
                  aria-label="Join our WhatsApp channel"
                >
                  <FaWhatsapp
                    size={20}
                    className="text-gray-300 group-hover:text-gray-900 transition-colors"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="w-full max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Company */}
            <div>
              <h4 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-yellow-400"></div>
                Company
              </h4>
              <div className="flex flex-col gap-3">
                <FooterLink name="About Us" href="/about" />
                <FooterLink name="How It Works" href="/get-started" />
                <FooterLink name="FAQs" href="/faqs" />
                <FooterLink name="Contact" href="/contact" />
              </div>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-yellow-400"></div>
                Resources
              </h4>
              <div className="flex flex-col gap-3">
                <FooterLink name="Browse Tenders" href="/tender" />
                <FooterLink name="View Offers" href="/offer" />
                <FooterLink name="Companies" href="/companies" />
                <FooterLink name="Blog & Insights" href="/blog" />
              </div>
            </div>

            {/* Get Started */}
            <div>
              <h4 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-yellow-400"></div>
                Get Started
              </h4>
              <div className="flex flex-col gap-3">
                <FooterLink name="Register Company" href="/auth/register" />
                <FooterLink name="Post a Tender" href="/tender" />
                <FooterLink name="Create Offer" href="/offer" />
                <FooterLink name="Pricing" href="/#" />
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-yellow-400"></div>
                Contact
              </h4>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-300 font-medium text-sm leading-relaxed">
                      Kigali, Rwanda
                      <br />
                      Kimironko
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-yellow-400 shrink-0" />
                  <a
                    href="tel:+250789407079"
                    className="text-gray-300 hover:text-yellow-400 font-medium text-sm transition-colors"
                  >
                    +250 789 407 079
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-yellow-400 shrink-0" />
                  <a
                    href="mailto:info@consnect.com"
                    className="text-gray-300 hover:text-yellow-400 font-medium text-sm transition-colors"
                  >
                    info@consnect.rw
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-white/10">
          <div className="bg-linear-to-r from-yellow-400 to-yellow-500 rounded-2xl p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
                Stay Updated
              </h3>
              <p className="text-gray-800 font-medium mb-6">
                Get the latest construction industry insights and platform updates
                delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 font-medium text-gray-900 placeholder:text-gray-600"
                />
                <button className="group px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg transition-all hover:scale-105 transform flex items-center justify-center gap-2">
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
              <Building2 className="w-4 h-4 text-yellow-400" />
              <p>
                © {new Date().getFullYear()} Consnect. All rights reserved.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <FooterLink name="Terms & Conditions" href="/terms" />
              <FooterLink name="Privacy Policy" href="/privacy" />
            </div>
          </div>
        </div>
      </div>

      {/* <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap');
      `}</style> */}
    </footer>
  );
}

const FooterLink = ({ name, href }: { name: string; href: string }) => (
  <Link
    href={href}
    className="group text-gray-300 hover:text-yellow-400 font-medium text-sm transition-all duration-200 flex items-center gap-2 w-fit"
  >
    <span>{name}</span>
    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
  </Link>
);