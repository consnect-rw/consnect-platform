// app/admin/page.tsx
"use client";

import { Building2, FileText, HandshakeIcon, Users, MessageSquare, TrendingUp, Calendar, CheckCircle2, Clock, Mail, Star } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { fetchAdminDashboardStats } from '@/server/dashboard/admin-dashboard';
import { fetchAdminRecentActivity } from '@/server/dashboard/admin-dashboard';

export default function AdminOverviewPage() {
  const { user } = useAuth();

  // Fetch dashboard stats
  const { data: stats = [], isLoading: statsLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      return await fetchAdminDashboardStats();
    },
    enabled: !!user?.role && user.role === 'ADMIN',
  });

  // Fetch recent activities
  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ['admin-recent-activity', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await fetchAdminRecentActivity(user.id);
    },
    enabled: !!user?.id && user.role === 'ADMIN',
  });

  // Helper function to get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'message received':
        return <Mail className="w-5 h-5 text-blue-600" />;
      case 'blog published':
        return <FileText className="w-5 h-5 text-purple-600" />;
      case 'offer created':
        return <HandshakeIcon className="w-5 h-5 text-green-600" />;
      case 'review submitted':
        return <Star className="w-5 h-5 text-yellow-600" />;
      case 'support message':
        return <MessageSquare className="w-5 h-5 text-orange-600" />;
      default:
        if (type.includes('Company')) {
          return <Building2 className="w-5 h-5 text-yellow-600" />;
        }
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  // Helper function to get color based on activity type
  const getActivityColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'message received':
        return 'bg-blue-100';
      case 'blog published':
        return 'bg-purple-100';
      case 'offer created':
        return 'bg-green-100';
      case 'review submitted':
        return 'bg-yellow-100';
      case 'support message':
        return 'bg-orange-100';
      default:
        if (type.includes('Company')) {
          return 'bg-yellow-100';
        }
        return 'bg-gray-100';
    }
  };
  return (
    <div className="w-full min-h-full bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Platform Overview</h1>
          <p className="text-gray-600 mt-2">
            Real-time insights into platform activity and growth
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {format(new Date(), 'PPPp')}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {statsLoading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">Loading dashboard stats...</p>
            </div>
          ) : stats.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No stats available</p>
            </div>
          ) : (
            stats.map((stat, index) => {
              const icons = [
                <Users className="w-7 h-7 text-yellow-600" />,
                <Building2 className="w-7 h-7 text-yellow-600" />,
                <MessageSquare className="w-7 h-7 text-yellow-600" />,
                <FileText className="w-7 h-7 text-yellow-600" />,
                <HandshakeIcon className="w-7 h-7 text-yellow-600" />,
                <Star className="w-7 h-7 text-yellow-600" />,
                <CheckCircle2 className="w-7 h-7 text-yellow-600" />,
                <Mail className="w-7 h-7 text-yellow-600" />,
              ];

              return (
                <div key={index} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-yellow-100 rounded-xl">
                      {icons[index] || icons[0]}
                    </div>
                    {stat.trend && (
                      <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {stat.trend}
                      </span>
                    )}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-gray-600 font-medium mt-1">{stat.name}</p>
                  {stat.comment && (
                    <p className="text-xs text-gray-500 mt-2">{stat.comment}</p>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Platform Activity</h3>
          {activitiesLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading recent activities...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No recent activities</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                  <div className={`p-2 ${getActivityColor(activity.type)} rounded-lg`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}