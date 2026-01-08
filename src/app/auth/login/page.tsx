"use client";
import { LoginForm } from "@/components/forms/auth/LoginForm";
import { CurrentYear } from "@/components/layout/CurrentYear";
import { getRedirectPath } from "@/util/auth";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
     const router =useRouter();
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 via-slate-100 to-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-6xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            
            {/* Left Section - Form */}
            <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
              {/* Logo/Brand Badge */}
              <div className="mb-6 lg:mb-8 flex flex-col gap-2 items-start">
                <Link href={"/"} prefetch className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-gray-700 hover:text-yellow-600 text-sm "><ArrowLeft className="w-4 h-4" /> Back To Home</Link>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-700">CONSNECT</span>
                </div>
              </div>

              {/* Welcome Text */}
              <div className="mb-8 lg:mb-10">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-gray-600 to-yellow-600 bg-clip-text text-transparent">
                    Welcome Back
                  </span>
                </h1>
                <p className="text-gray-600 text-base sm:text-lg">
                  Sign in to continue to your account
                </p>
              </div>

              {/* Login Form - Your existing component goes here */}
              <div className="w-full">
               <LoginForm onComplete={user => router.push(getRedirectPath(user.role))} />
              </div>
              

              {/* Trust Indicators - Mobile Only */}
              <div className="mt-8 pt-6 border-t border-gray-200 lg:hidden">
                <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span>Trusted</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>Fast</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Image & Branding */}
            <div className="hidden lg:flex relative bg-gradient-to-br from-black via-yellow-950 to-black p-12 flex-col justify-between overflow-hidden">
              {/* Decorative Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h2 className="text-white text-4xl font-bold mb-4">
                  Build Better Connections
                </h2>
                <p className="text-white/90 text-lg leading-relaxed">
                  Join thousands of professionals who trust Consnect to manage their business relationships and grow their network.
                </p>
              </div>

              {/* Image Container */}
              <div className="relative z-10 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <img 
                    src="/logo/consnect.jpeg" 
                    alt="Consnect" 
                    className="w-full h-auto rounded-xl shadow-2xl"
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="relative z-10 grid grid-cols-3 gap-4 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">10K+</div>
                  <div className="text-white/80 text-sm">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">50K+</div>
                  <div className="text-white/80 text-sm">Connections</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">99%</div>
                  <div className="text-white/80 text-sm">Uptime</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center mt-6 text-sm text-gray-600">
          © <CurrentYear /> Consnect. All rights reserved.
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