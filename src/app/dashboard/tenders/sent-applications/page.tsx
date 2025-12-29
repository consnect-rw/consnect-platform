import { Clock, FileText, Bell } from 'lucide-react';

export default function SentTenderApplicationsPage() {
  return (
    <div className="h-full bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl opacity-10 translate-y-1/2 -translate-x-1/2"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Icon Group */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center transform rotate-6 shadow-lg">
                <FileText className="w-8 h-8 text-gray-900" />
              </div>
              <div className="w-20 h-20 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center transform -rotate-6 shadow-lg">
                <Bell className="w-8 h-8 text-gray-900" />
              </div>
            </div>

            {/* Text Content */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Tenders Coming Soon
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              We're building something amazing. The tenders module will be available shortly with powerful features to streamline your workflow.
            </p>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-full border-2 border-yellow-400">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">In Development</span>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <p className="text-center text-gray-500 text-sm mt-6">
          We'll notify you when this feature becomes available
        </p>
      </div>
    </div>
  );
}