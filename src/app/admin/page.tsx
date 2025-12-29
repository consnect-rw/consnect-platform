// app/admin/dashboard/page.tsx or similar
"use client";

import { Building2, FileText, HandshakeIcon, Users, MessageSquare, TrendingUp, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'; // Assuming recharts is installed

// Mock data - replace with real queries
const stats = {
  totalCompanies: 342,
  newCompaniesThisWeek: 28,
  pendingVerification: 15,

  totalTenders: 1_248,
  newTendersThisWeek: 87,

  totalOffers: 4_562,
  newOffersThisWeek: 312,

  totalUsers: 5_890,
  newUsersThisWeek: 145,
  usersWithCompany: 412,
  usersWithoutCompany: 5_478,

  newSupportMessages: 23,
};

const visitsData = [
  { name: 'Mon', visits: 1200 },
  { name: 'Tue', visits: 1800 },
  { name: 'Wed', visits: 1600 },
  { name: 'Thu', visits: 2200 },
  { name: 'Fri', visits: 2500 },
  { name: 'Sat', visits: 1400 },
  { name: 'Sun', visits: 1100 },
];

const recentActivity = [
  { id: 1, type: 'company', action: 'New company registered', name: 'Alpha Construction Ltd', time: '2 hours ago' },
  { id: 2, type: 'tender', action: 'New tender posted', name: 'Road Rehabilitation Project', time: '4 hours ago' },
  { id: 3, type: 'offer', action: 'New offer submitted', name: 'Bid #A-4421', time: '6 hours ago' },
  { id: 4, type: 'support', action: 'New support message', name: 'Payment issue', time: '8 hours ago' },
];

export default function AdminOverviewPage() {
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
          {/* Companies */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Building2 className="w-7 h-7 text-yellow-600" />
              </div>
              <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +{stats.newCompaniesThisWeek}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stats.totalCompanies}</h3>
            <p className="text-gray-600 mt-1">Total Companies</p>
            <p className="text-sm text-orange-600 mt-2 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {stats.pendingVerification} pending verification
            </p>
          </div>

          {/* Tenders */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <FileText className="w-7 h-7 text-yellow-600" />
              </div>
              <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +{stats.newTendersThisWeek}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stats.totalTenders.toLocaleString()}</h3>
            <p className="text-gray-600 mt-1">Total Tenders Posted</p>
          </div>

          {/* Offers */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <HandshakeIcon className="w-7 h-7 text-yellow-600" />
              </div>
              <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +{stats.newOffersThisWeek}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stats.totalOffers.toLocaleString()}</h3>
            <p className="text-gray-600 mt-1">Total Offers Submitted</p>
          </div>

          {/* Users */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Users className="w-7 h-7 text-yellow-600" />
              </div>
              <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +{stats.newUsersThisWeek}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</h3>
            <p className="text-gray-600 mt-1">Total Users</p>
            <p className="text-sm text-gray-500 mt-2">
              {stats.usersWithCompany} with company • {stats.usersWithoutCompany} individuals
            </p>
          </div>

          {/* Support Messages */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <MessageSquare className="w-7 h-7 text-yellow-600" />
              </div>
              <span className="text-sm font-bold text-red-600">
                {stats.newSupportMessages} new
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stats.newSupportMessages}</h3>
            <p className="text-gray-600 mt-1">Unread Support Messages</p>
          </div>
        </div>

        {/* Charts & Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Platform Visits Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Platform Visits (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visitsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="visits"
                  stroke="#EAB308"
                  strokeWidth={4}
                  dot={{ fill: '#EAB308', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    {item.type === 'company' && <Building2 className="w-5 h-5 text-yellow-600" />}
                    {item.type === 'tender' && <FileText className="w-5 h-5 text-yellow-600" />}
                    {item.type === 'offer' && <HandshakeIcon className="w-5 h-5 text-yellow-600" />}
                    {item.type === 'support' && <MessageSquare className="w-5 h-5 text-yellow-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.action}</p>
                    <p className="text-sm text-gray-600 mt-1">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-2">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}