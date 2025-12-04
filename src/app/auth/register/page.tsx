"use client";
import { Building2, Sparkles, CheckCircle2, TrendingUp, Users, FileText } from 'lucide-react';
import { UserForm } from '@/components/forms/auth/UserForm';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function RegisterPage() {

     const router = useRouter();

  const benefits = [
    {
      icon: FileText,
      title: "Post & Bid on Tenders",
      description: "Access construction tenders and submit competitive bids effortlessly"
    },
    {
      icon: TrendingUp,
      title: "Grow Your Business",
      description: "Connect with contractors and expand your market reach"
    },
    {
      icon: Users,
      title: "Build Your Profile",
      description: "Showcase your projects, certifications, and expertise"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-6xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            
            {/* Left Section - Branding & Benefits */}
            <div className="hidden lg:flex relative bg-gradient-to-br from-amber-500 via-yellow-700 to-yellow-800 p-12 flex-col justify-between overflow-hidden">
              {/* Decorative Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 -translate-x-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-y-1/2 translate-x-1/2"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                  <Building2 className="w-5 h-5 text-white" />
                  <span className="text-sm font-semibold text-white">CONSNECT</span>
                </div>

                <h2 className="text-white text-4xl font-bold mb-4 leading-tight">
                  Join the Construction Network
                </h2>
                <p className="text-white/90 text-lg leading-relaxed mb-8">
                  Connect with construction companies, bid on tenders, and grow your business in the construction industry.
                </p>

                {/* Benefits */}
                <div className="space-y-4">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div 
                        key={index}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                            <p className="text-white/80 text-sm">{benefit.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stats */}
              <div className="relative z-10 grid grid-cols-3 gap-4 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-white/80 text-sm">Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">2K+</div>
                  <div className="text-white/80 text-sm">Tenders</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">5K+</div>
                  <div className="text-white/80 text-sm">Bids</div>
                </div>
              </div>
            </div>

            {/* Right Section - Form */}
            <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
              {/* Mobile Brand Badge */}
              <div className="lg:hidden mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-700">CONSNECT</span>
                </div>
              </div>

              {/* Welcome Text */}
              <div className="mb-8 lg:mb-10">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                    Get Started
                  </span>
                </h1>
                <p className="text-gray-600 text-base sm:text-lg">
                  Create your account and start bidding on construction projects
                </p>
              </div>

              {/* Mobile Benefits - Compact Version */}
              <div className="lg:hidden mb-6 space-y-2">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100"
                    >
                      <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700 font-medium">{benefit.title}</span>
                    </div>
                  );
                })}
              </div>

              {/* Register Form - Your existing component goes here */}
              <div className="w-full">
                <UserForm onComplete={() => router.push("/auth/login")} />
              </div>

              {/* Sign In Link */}
              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-amber-600 hover:text-amber-700 font-medium">
                  Sign in
                </Link>
              </p>

              {/* Trust Indicators - Mobile Only */}
              <div className="mt-8 pt-6 border-t border-gray-200 lg:hidden">
                <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span>Verified</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>Trusted</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center mt-6 text-sm text-gray-600">
          © {new Date().getFullYear()} Consnect. Connecting Construction Professionals.
        </p>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}