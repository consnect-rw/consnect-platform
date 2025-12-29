
"use client";

import CompanyVerification from '@/components/containers/user/CompanyVerification';
import { useAuth } from '@/hooks/useAuth';
import { TSessionUser } from '@/types/auth/user';
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RecentActivity />
          <CompanyVerification />
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
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
               <User className='w-8 h-8' />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Hello, <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">{user.name}</span>
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
  const stats = [
    { label: "Active Tenders", value: "12", icon: FileText, trend: "+3 this week" },
    { label: "Total Projects", value: "47", icon: Building2, trend: "8 completed" },
    { label: "Partner Connections", value: "156", icon: Users, trend: "+12 new" },
    { label: "Avg. Rating", value: "4.8", icon: Award, trend: "From 23 reviews" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, icon: Icon, trend }: {
  label: string;
  value: string;
  icon: any;
  trend: string;
}) {
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
  const activities = [
    { type: "tender", title: "New bid received", project: "Downtown Plaza Construction", time: "2 hours ago" },
    { type: "message", title: "Message from BuildTech Co.", project: "Partnership inquiry", time: "5 hours ago" },
    { type: "review", title: "New review posted", project: "Riverside Complex", time: "1 day ago" },
    { type: "offer", title: "Offer accepted", project: "Industrial Park Phase 2", time: "2 days ago" },
  ];

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        <a href="/dashboard/activity" className="text-yellow-600 hover:text-yellow-700 font-medium text-sm flex items-center gap-1">
          View All <ArrowRight className="w-4 h-4" />
        </a>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <ActivityItem key={index} {...activity} />
        ))}
      </div>
    </div>
  );
}

// Activity Item Component
function ActivityItem({ type, title, project, time }: {
  type: string;
  title: string;
  project: string;
  time: string;
}) {
  const getIcon = () => {
    switch (type) {
      case "tender": return FileText;
      case "message": return MessageSquare;
      case "review": return Award;
      case "offer": return Tag;
      default: return FileText;
    }
  };
  
  const Icon = getIcon();
  
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-yellow-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        <p className="text-sm text-gray-600 truncate">{project}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
}
