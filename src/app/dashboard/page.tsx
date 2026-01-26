
"use client";

import CompanyVerification from '@/components/containers/user/CompanyVerification';
import { useAuth } from '@/hooks/useAuth';
import { TSessionUser } from '@/types/auth/user';
import { fetchUserDashboardStats, fetchUserRecentActivity } from '@/server/dashboard/user-dashboard';
import { useQuery } from '@tanstack/react-query';
import { Building2, FileText, Tag, MessageSquare, TrendingUp, Users, Award, Calendar, ArrowRight, Plus, Bell, User } from 'lucide-react';
import { IconType } from 'react-icons/lib';

// Mock user data - replace with actual useAuth hook
const mockUser = {
  name: "John Doe",
  company: "BuildCorp Solutions",
  memberSince: "Jan 2024",
  avatar: "JD"
};

export default function UserDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        {user ? <Header user={user} /> : null}

        {/* Quick Actions */}
        <QuickActions />

        {/* Stats Overview */}
        <StatsGrid />

        {/* Main Content Grid */}
        <div className="w-full flex flex-col gap-6">
          <CompanyVerification />
          <RecentActivity />
        </div>

      </div>
    </div>
  );
}

// Header Component
function Header({ user }: { user: TSessionUser }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl opacity-5"></div>
      
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-linear-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
               <User className='w-8 h-8' />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Hello, <span className="bg-linear-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">{user.name}</span>
            </h1>
            <p className="text-gray-600 mt-1">{user.company?.name}</p>
          </div>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="font-medium">3 New</span>
        </button>
      </div>
      
      <p className="text-gray-600 font-medium mt-6 text-base sm:text-lg max-w-3xl relative z-10">
        Welcome to your Consnect Dashboard. Manage tenders, post offers, update your company profile, and connect with the best partners in construction.
      </p>
    </div>
  );
}

// Quick Actions Component
function QuickActions() {
  const actions:{name:string, href:string, color: "yellow" | "gray", icon: IconType}[] = [
    { name: "Post Tender", href: "/dashboard/tenders", icon: FileText, color: "yellow" },
    { name: "Create Offer", href: "/dashboard/offers/form", icon: Tag, color: "yellow" },
    { name: "Update Profile", href: "/dashboard/settings", icon: Building2, color: "gray" },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare, color: "gray" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {actions.map((action) => (
        <QuickActionCard key={action.name} {...action} />
      ))}
    </div>
  );
}

// Quick Action Card Component
function QuickActionCard({ name, href, icon: Icon, color }: {
  name: string;
  href: string;
  icon: any;
  color: "yellow" | "gray";
}) {
  const isYellow = color === "yellow";
  
  return (
    <a
      href={href}
      className={`group relative bg-white rounded-xl shadow-sm border-2 ${
        isYellow ? 'border-yellow-400 hover:border-yellow-500' : 'border-gray-200 hover:border-gray-300'
      } p-6 transition-all hover:shadow-md hover:-translate-y-1`}
    >
      <div className={`w-12 h-12 rounded-xl ${
        isYellow ? 'bg-yellow-400' : 'bg-gray-200'
      } flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${isYellow ? 'text-gray-900' : 'text-gray-700'}`} />
      </div>
      <h3 className="font-bold text-gray-900 mb-1">{name}</h3>
      <ArrowRight className="w-4 h-4 text-gray-400 absolute bottom-6 right-6 group-hover:translate-x-1 transition-transform" />
    </a>
  );
}

// Stats Grid Component
function StatsGrid() {
  const { user } = useAuth();
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['user-dashboard-stats', user?.id],
    queryFn: () => fetchUserDashboardStats(user?.id ?? ""),
    enabled: !!user?.id,
  });

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
            <div className="h-3 bg-gray-100 rounded w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  // Show empty state if no data
  if (!statsData || statsData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
          <Building2 className="w-8 h-8 text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Company Registered</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Dashboard statistics will be displayed once you register and verify your company. Complete your company profile to start tracking your performance metrics.
        </p>
        <a
          href="/dashboard/settings"
          className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Register Company
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, trend }: {
  label: string;
  value: string;
  trend: string;
}) {
  // Map labels to icons
  const getIcon = () => {
    switch (label) {
      case "Active Offers":
        return Tag;
      case "Projects":
        return Building2;
      case "Messages":
        return MessageSquare;
      case "Company Rating":
        return Award;
      default:
        return TrendingUp;
    }
  };

  const Icon = getIcon();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-700" />
        </div>
        <TrendingUp className="w-4 h-4 text-yellow-500" />
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600 font-medium">{label}</p>
      <p className="text-xs text-gray-500 mt-2">{trend}</p>
    </div>
  );
}

// Recent Activity Component
function RecentActivity() {
  const { user } = useAuth();
  const { data: activityData, isLoading } = useQuery({
    queryKey: ['user-recent-activity', user?.id],
    queryFn: () => fetchUserRecentActivity(user?.id ?? ""),
    enabled: !!user?.id,
  });

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        </div>
        
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-start gap-4 p-4 rounded-lg animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-lg shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-48 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show empty state if no data
  if (!activityData || activityData.length === 0) {
    return (
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full mb-3">
          <Calendar className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">No Activity Yet</h3>
        <p className="text-sm text-gray-600">
          Your activity will appear here once you start posting offers, completing projects, or receiving messages.
        </p>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        <a href="/dashboard/activity" className="text-yellow-600 hover:text-yellow-700 font-medium text-sm flex items-center gap-1">
          View All <ArrowRight className="w-4 h-4" />
        </a>
      </div>
      
      <div className="space-y-4">
        {activityData.map((activity, index) => (
          <ActivityItem key={index} title={activity.title} message={activity.message} timestamp={activity.timestamp} />
        ))}
      </div>
    </div>
  );
}

// Activity Item Component
function ActivityItem({ title, message, timestamp }: {
  title: string;
  message: string;
  timestamp: Date;
}) {
  // Map activity title to icon and type
  const getActivityType = () => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("offer")) return "offer";
    if (lowerTitle.includes("project")) return "project";
    if (lowerTitle.includes("review")) return "review";
    if (lowerTitle.includes("message")) return "message";
    return "activity";
  };

  const getIcon = () => {
    const type = getActivityType();
    switch (type) {
      case "offer":
        return Tag;
      case "project":
        return Building2;
      case "review":
        return Award;
      case "message":
        return MessageSquare;
      default:
        return FileText;
    }
  };

  // Format timestamp to relative time
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const Icon = getIcon();

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-yellow-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        <p className="text-sm text-gray-600 truncate">{message}</p>
        <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(timestamp)}</p>
      </div>
    </div>
  );
}
