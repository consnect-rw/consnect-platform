"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Users, FileText, Briefcase, MessageSquare, Building2, UserPlus, Activity, DollarSign } from "lucide-react";

export default function AdminStatsPage() {
  const [timeRange, setTimeRange] = useState("7d");

  const stats = [
    {
      title: "Total Users",
      value: "12,458",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "bg-yellow-500"
    },
    {
      title: "Active Tenders",
      value: "342",
      change: "+8.2%",
      trend: "up",
      icon: Briefcase,
      color: "bg-gray-600"
    },
    {
      title: "Total Companies",
      value: "1,847",
      change: "+5.3%",
      trend: "up",
      icon: Building2,
      color: "bg-yellow-500"
    },
    {
      title: "Blog Posts",
      value: "486",
      change: "+15.8%",
      trend: "up",
      icon: FileText,
      color: "bg-gray-600"
    },
    {
      title: "Q&A Threads",
      value: "2,134",
      change: "+22.4%",
      trend: "up",
      icon: MessageSquare,
      color: "bg-yellow-500"
    },
    {
      title: "New Sign-ups",
      value: "284",
      change: "-3.2%",
      trend: "down",
      icon: UserPlus,
      color: "bg-gray-600"
    },
    {
      title: "Partnerships Formed",
      value: "156",
      change: "+18.7%",
      trend: "up",
      icon: Activity,
      color: "bg-yellow-500"
    },
    {
      title: "Platform Revenue",
      value: "$42,586",
      change: "+26.1%",
      trend: "up",
      icon: DollarSign,
      color: "bg-gray-600"
    }
  ];

  const recentActivity = [
    { type: "tender", company: "BuildCo Ltd", action: "Posted new tender", time: "5 min ago" },
    { type: "user", company: "John Mensah", action: "Registered as contractor", time: "12 min ago" },
    { type: "partnership", company: "ConstrX & BuildPro", action: "Formed partnership", time: "28 min ago" },
    { type: "blog", company: "Jane Uwase", action: "Published article", time: "1 hour ago" },
    { type: "question", company: "David Kamau", action: "Posted question", time: "2 hours ago" }
  ];

  const topCompanies = [
    { name: "BuildCo Ltd", tenders: 45, partnerships: 12, activity: 92 },
    { name: "ConstrX Group", tenders: 38, partnerships: 15, activity: 88 },
    { name: "ProBuild Rwanda", tenders: 32, partnerships: 9, activity: 85 },
    { name: "EastAfrica Construction", tenders: 28, partnerships: 11, activity: 78 },
    { name: "ModernBuild Inc", tenders: 24, partnerships: 8, activity: 72 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Platform Statistics</h1>
            <select aria-label="Select Time Range"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
          <p className="text-gray-600">Monitor your platform's performance and user engagement</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Growth Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">User Growth Trend</h2>
            <div className="h-64 flex items-end justify-between gap-2">
              {[65, 72, 68, 85, 78, 92, 88, 95, 89, 98, 105, 112, 108, 120].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t-lg hover:from-yellow-600 hover:to-yellow-500 transition-all cursor-pointer"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-500">{i + 1}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center text-sm text-gray-600">Days</div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.company}</p>
                    <p className="text-xs text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Companies and Platform Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Companies */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Top Active Companies</h2>
            <div className="space-y-4">
              {topCompanies.map((company, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-700">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{company.name}</p>
                      <p className="text-xs text-gray-600">{company.tenders} tenders • {company.partnerships} partnerships</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${company.activity}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{company.activity}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Health Indicators */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Health</h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">User Engagement</span>
                  <span className="text-sm font-bold text-gray-900">87%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Tender Completion Rate</span>
                  <span className="text-sm font-bold text-gray-900">73%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '73%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Response Time (Avg)</span>
                  <span className="text-sm font-bold text-gray-900">2.4h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Blog Engagement</span>
                  <span className="text-sm font-bold text-gray-900">64%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '64%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Partnership Success</span>
                  <span className="text-sm font-bold text-gray-900">91%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: '91%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}