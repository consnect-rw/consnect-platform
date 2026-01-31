// import React from 'react'
// import { Button } from '../ui/button'
// import { ArrowRight } from 'lucide-react'
// import Link from 'next/link'

// const HomeHeroSection = () => {
//   return (
//     <section className='w-full py-24 px-8'>
//           <div className='w-full max-w-7xl flex flex-col items-center mx-auto gap-4'>
//                <h1 className='text-4xl md:text-6xl lg:text-7xl font-extrabold text-black text-center max-w-4xl'>Grow Your Business  <span className='text-yellow-600'>with Consnect</span></h1>
//                <p className='text-center text-base font-medium max-w-2xl text-gray-600'>Win more projects, showcase your expertise, and connect with clients and suppliers across the construction ecosystem.</p>
//                <div className='flex items-center gap-4'>
//                     <Link href={"/auth/register"}>
//                       <Button size={"lg"} className='bg-yellow-600 rounded-full font-medium text-white flex items-center gap-2 hover:bg-yellow-700'>Get Started <span className='p-1 rounded-full'><ArrowRight size={24} /></span></Button>
//                     </Link>
//                     <Link href={"/contact"}>
//                     <Button size={"lg"} className='rounded-full' variant={"outline"}>Book A demo</Button>
//                     </Link>
//                </div>
//           </div>
//     </section>
//   )
// }

// export default HomeHeroSection

import React from "react";
import { Button } from "../ui/button";
import {
  ArrowRight,
  Building2,
  FileText,
  Users,
  CheckCircle2,
  Star,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

const HomeHeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-yellow-50">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Background Circles */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-gray-200 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-yellow-100 rounded-full opacity-40 blur-2xl"></div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>

        {/* Diagonal Lines Decoration */}
        <div className="absolute top-20 left-10 w-24 h-1 bg-yellow-400 opacity-50 rotate-45"></div>
        <div className="absolute top-32 right-20 w-32 h-1 bg-gray-300 opacity-60 -rotate-45"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-32">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white border-2 border-yellow-400 rounded-full shadow-lg">
            <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
            <span className="text-xs md:text-sm font-black text-gray-900 uppercase tracking-normal lg:tracking-wider">
              #1 Platform for Construction Companies
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
            Grow Your Business
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 text-yellow-500">with Consnect</span>
              {/* Underline decoration */}
              <svg
                className="absolute -bottom-2 left-0 w-full h-4 text-yellow-400 opacity-50"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 10C50 3 100 2 150 5C200 8 250 7 298 3"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="text-xl md:text-2xl font-medium text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
            The ultimate platform for construction companies to win more projects,
            showcase expertise, and connect with clients and suppliers.
          </p>

          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            Join hundreds of verified construction companies transforming how they do business.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href={"/auth/register"}>
            <Button
              size={"lg"}
              className="group w-full sm:w-auto px-8 py-6 bg-yellow-500 hover:bg-yellow-600 rounded-full font-bold text-gray-900 text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 transform flex items-center gap-3"
            >
              <span>Get Started Free</span>
              <span className="p-1.5 bg-yellow-600 rounded-full group-hover:bg-yellow-700 transition-colors">
                <ArrowRight size={20} strokeWidth={3} />
              </span>
            </Button>
          </Link>
          <Link href={"/contact"}>
            <Button
              size={"lg"}
              variant={"outline"}
              className="w-full sm:w-auto px-8 py-6 rounded-full font-bold text-gray-900 text-lg border-2 border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 transition-all"
            >
              Book A Demo
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-16 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-yellow-500" fill="currentColor" />
            <span className="font-bold">Free to start</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-yellow-500" fill="currentColor" />
            <span className="font-bold">No credit card required</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-yellow-500" fill="currentColor" />
            <span className="font-bold">Setup in minutes</span>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="group bg-white border-2 border-gray-200 hover:border-yellow-400 rounded-2xl p-6 transition-all hover:-translate-y-2 hover:shadow-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-gray-900" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">
              Post Tenders & Offers
            </h3>
            <p className="text-gray-600 leading-relaxed font-medium">
              Reach qualified contractors and suppliers with your construction projects
            </p>
          </div>

          {/* Card 2 */}
          <div className="group bg-white border-2 border-gray-200 hover:border-yellow-400 rounded-2xl p-6 transition-all hover:-translate-y-2 hover:shadow-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6 text-gray-900" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">
              Showcase Your Company
            </h3>
            <p className="text-gray-600 leading-relaxed font-medium">
              Build professional profiles that highlight your expertise and projects
            </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-white border-2 border-gray-200 hover:border-yellow-400 rounded-2xl p-6 transition-all hover:-translate-y-2 hover:shadow-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-gray-900" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">
              Network & Partner
            </h3>
            <p className="text-gray-600 leading-relaxed font-medium">
              Connect with industry professionals and grow your business network
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
                <div className="text-3xl md:text-4xl font-black text-yellow-400">
                  500+
                </div>
              </div>
              <div className="text-sm text-gray-400 font-bold">
                Active Companies
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-yellow-400" />
                <div className="text-3xl md:text-4xl font-black text-yellow-400">
                  2.5K+
                </div>
              </div>
              <div className="text-sm text-gray-400 font-bold">
                Projects Posted
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-yellow-400" />
                <div className="text-3xl md:text-4xl font-black text-yellow-400">
                  10K+
                </div>
              </div>
              <div className="text-sm text-gray-400 font-bold">
                Professionals
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                <div className="text-3xl md:text-4xl font-black text-yellow-400">
                  4.9/5
                </div>
              </div>
              <div className="text-sm text-gray-400 font-bold">
                User Rating
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap');
        
        body {
          font-family: 'Archivo', system-ui, -apple-system, sans-serif;
        }
      `}</style> */}
    </section>
  );
};

export default HomeHeroSection;