"use client";

import { useAuth } from '@/hooks/useAuth';
import { fetchUserRecentActivity } from '@/server/dashboard/user-dashboard';
import { useQuery } from '@tanstack/react-query';
import { 
  Calendar, 
  FileText, 
  Building2, 
  MessageSquare, 
  Award, 
  Tag, 
  Loader2, 
  AlertCircle,
  Search,
  Filter,
  ChevronRight
} from 'lucide-react';
import { useState, useMemo } from 'react';

type ActivityType = 'all' | 'offer' | 'project' | 'review' | 'message';

export default function ActivityPage() {
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<ActivityType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: activities, isLoading } = useQuery({
    queryKey: ['user-recent-activity', user?.id],
    queryFn: () => fetchUserRecentActivity(user?.id ?? ""),
    enabled: !!user?.id,
  });

  // Filter and search activities
  const filteredActivities = useMemo(() => {
    if (!activities) return [];

    let filtered = [...activities];

    // Apply type filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter((activity) => {
        const lowerTitle = activity.title.toLowerCase();
        switch (selectedFilter) {
          case 'offer':
            return lowerTitle.includes('offer');
          case 'project':
            return lowerTitle.includes('project');
          case 'review':
            return lowerTitle.includes('review');
          case 'message':
            return lowerTitle.includes('message');
          default:
            return true;
        }
      });
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (activity) =>
          activity.title.toLowerCase().includes(searchLower) ||
          activity.message.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [activities, selectedFilter, searchTerm]);

  const getActivityIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('offer')) return Tag;
    if (lowerTitle.includes('project')) return Building2;
    if (lowerTitle.includes('review')) return Award;
    if (lowerTitle.includes('message')) return MessageSquare;
    return FileText;
  };

  const getActivityColor = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('offer'))
      return { bg: 'bg-blue-100', text: 'text-blue-600' };
    if (lowerTitle.includes('project'))
      return { bg: 'bg-purple-100', text: 'text-purple-600' };
    if (lowerTitle.includes('review'))
      return { bg: 'bg-amber-100', text: 'text-amber-600' };
    if (lowerTitle.includes('message'))
      return { bg: 'bg-green-100', text: 'text-green-600' };
    return { bg: 'bg-gray-100', text: 'text-gray-600' };
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!user?.company) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Company Profile</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Add your company information to start viewing activity.
            </p>
            <a
              href="/dashboard/settings"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors"
            >
              Add Company
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Activity Log</h1>
          <p className="text-gray-600">Track all your company and account activities in one place</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedFilter === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Activities
              </button>
              <button
                onClick={() => setSelectedFilter('offer')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  selectedFilter === 'offer'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Tag className="w-4 h-4" />
                Offers
              </button>
              <button
                onClick={() => setSelectedFilter('project')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  selectedFilter === 'project'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Projects
              </button>
              <button
                onClick={() => setSelectedFilter('review')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  selectedFilter === 'review'
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Award className="w-4 h-4" />
                Reviews
              </button>
              <button
                onClick={() => setSelectedFilter('message')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  selectedFilter === 'message'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Messages
              </button>
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
              <p className="text-gray-600 font-medium">Loading activities...</p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center gap-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
              <p className="text-gray-600 font-medium">
                {searchTerm || selectedFilter !== 'all'
                  ? 'No activities found matching your filters'
                  : 'No activities yet. Start posting offers, completing projects, or engaging with the community!'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredActivities.map((activity, index) => {
                const Icon = getActivityIcon(activity.title);
                const colors = getActivityColor(activity.title);

                return (
                  <div
                    key={index}
                    className="p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                      >
                        <Icon className={`w-6 h-6 ${colors.text}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <h3 className="text-base font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">
                            {activity.title}
                          </h3>
                          <span className="text-sm font-medium text-gray-500 shrink-0 whitespace-nowrap">
                            {formatTimeAgo(activity.timestamp)}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {activity.message}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {new Date(activity.timestamp).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>

                      {/* Arrow */}
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-yellow-500 transition-colors shrink-0 mt-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Stats Summary */}
        {!isLoading && activities && activities.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Tag}
              label="Offers Posted"
              count={activities.filter((a) =>
                a.title.toLowerCase().includes('offer')
              ).length}
              color="bg-blue-100 text-blue-600"
            />
            <StatCard
              icon={Building2}
              label="Projects"
              count={activities.filter((a) =>
                a.title.toLowerCase().includes('project')
              ).length}
              color="bg-purple-100 text-purple-600"
            />
            <StatCard
              icon={Award}
              label="Reviews"
              count={activities.filter((a) =>
                a.title.toLowerCase().includes('review')
              ).length}
              color="bg-amber-100 text-amber-600"
            />
            <StatCard
              icon={MessageSquare}
              label="Messages"
              count={activities.filter((a) =>
                a.title.toLowerCase().includes('message')
              ).length}
              color="bg-green-100 text-green-600"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  count,
  color,
}: {
  icon: any;
  label: string;
  count: number;
  color: string;
}) {
  const [bgColor, textColor] = color.split(' ');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center shrink-0`}>
          <Icon className={`w-6 h-6 ${textColor}`} />
        </div>
        <div>
          <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">
            {label}
          </p>
          <p className="text-3xl font-bold text-gray-900">{count}</p>
        </div>
      </div>
    </div>
  );
}