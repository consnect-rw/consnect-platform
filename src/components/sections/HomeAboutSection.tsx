import Link from "next/link";
import { 
  Building2, 
  FileText, 
  Handshake, 
  Share2, 
  ArrowRight,
  CheckCircle2,
  Layers
} from "lucide-react";

export default function HomeAboutSection() {
  const features = [
    {
      icon: FileText,
      title: "Post Tenders & Offers",
      description: "Easily publish construction tenders and service offers to connect with the right partners",
    },
    {
      icon: Building2,
      title: "Company Profiles",
      description: "Showcase your company's expertise, projects, and capabilities to potential clients",
    },
    {
      icon: Handshake,
      title: "Partner & Collaborate",
      description: "Find and connect with construction companies and professionals for partnerships",
    },
    {
      icon: Share2,
      title: "Share Your Work",
      description: "Create sharable company pages that clients can view to understand your services",
    },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 overflow-hidden">
      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(250, 204, 21, 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(250, 204, 21, 0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      ></div>

      {/* Decorative Blur Elements */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-gray-700/30 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-yellow-400"></div>
            <span className="text-yellow-400 font-bold uppercase tracking-widest text-sm">
              About the Platform
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Connecting the Construction Industry
          </h2>

          <p className="text-xl text-gray-300 leading-relaxed font-medium mb-8">
            A comprehensive platform built specifically for construction companies to streamline 
            tender management, showcase their expertise, and forge meaningful business partnerships.
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-yellow-400" fill="currentColor" />
              <span className="text-sm text-gray-300 font-medium">For Construction Companies</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-yellow-400" fill="currentColor" />
              <span className="text-sm text-gray-300 font-medium">Industry Professionals</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-yellow-400" fill="currentColor" />
              <span className="text-sm text-gray-300 font-medium">Project Partnerships</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm border-2 border-white/10 hover:border-yellow-400/50 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon Container */}
                <div className="mb-5">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-gray-900" strokeWidth={2.5} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-black text-white mb-3 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed font-medium">
                  {feature.description}
                </p>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-yellow-400/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            );
          })}
        </div>

        {/* Key Benefits Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-400/10 border-2 border-yellow-400/30 rounded-lg flex items-center justify-center">
                <Layers className="w-6 h-6 text-yellow-400" strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-xl font-black text-white mb-2">
                  Streamlined Tender Management
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  Post and manage construction tenders efficiently. Connect with qualified 
                  contractors and suppliers who can deliver on your project requirements.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-400/10 border-2 border-yellow-400/30 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-yellow-400" strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-xl font-black text-white mb-2">
                  Professional Company Presence
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  Build comprehensive company profiles that showcase your projects, certifications, 
                  and expertise to win more business opportunities.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-400/10 border-2 border-yellow-400/30 rounded-lg flex items-center justify-center">
                <Handshake className="w-6 h-6 text-yellow-400" strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-xl font-black text-white mb-2">
                  Network & Partnerships
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  Discover partnership opportunities with other construction firms and professionals. 
                  Collaborate on projects and expand your business network.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-400/10 border-2 border-yellow-400/30 rounded-lg flex items-center justify-center">
                <Share2 className="w-6 h-6 text-yellow-400" strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-xl font-black text-white mb-2">
                  Client-Ready Content
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  Share professional company pages with clients and stakeholders. 
                  Present your capabilities in a polished, accessible format.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-12 text-center relative overflow-hidden">
            {/* Decorative Pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  rgba(0, 0, 0, 0.1) 10px,
                  rgba(0, 0, 0, 0.1) 20px
                )`,
              }}
            ></div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Ready to Transform Your Construction Business?
              </h3>
              <p className="text-lg text-gray-800 max-w-2xl mx-auto mb-8 font-medium">
                Join hundreds of construction companies already leveraging our platform 
                to grow their business and connect with industry partners.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/about"
                  className="group px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-full transition-all hover:scale-105 transform shadow-xl flex items-center gap-2"
                >
                  <span>Learn More About Us</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                </Link>

                <Link
                  href="/auth/register"
                  className="group px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-full transition-all hover:scale-105 transform shadow-xl flex items-center gap-2 border-2 border-gray-900"
                >
                  <Building2 className="w-5 h-5" strokeWidth={2.5} />
                  <span>Get Started Free</span>
                </Link>
              </div>

              {/* Trust Badge */}
              <div className="mt-8 pt-6 border-t-2 border-gray-900/10">
                <p className="text-sm text-gray-800 font-bold">
                  ✓ Free to register • ✓ No credit card required • ✓ Instant profile setup
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}