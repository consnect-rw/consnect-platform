"use client";

import { useAuth } from "@/hooks/useAuth";
import { Building2 } from "lucide-react";

export default function CompanyRequiredNotice({message}:{message:string}) {
     return (
          <div className="min-h-full bg-gray-50 flex items-center justify-center p-6">
               <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Profile Required</h2>
                    <p className="text-gray-600 mb-6">
                    {message}
                    </p>
                    <a
                    href="/dashboard/settings"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-xl transition-colors"
                    >
                    <Building2 className="w-5 h-5" />
                    Complete Your Company Profile
                    </a>
               </div>
          </div>
     )
}