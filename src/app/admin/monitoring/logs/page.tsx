"use client";

import { useState } from "react";
import { Search, Filter, Download, RefreshCw, ChevronLeft, ChevronRight, AlertCircle, CheckCircle, XCircle, User, Settings, FileText, Shield, Database, Mail } from "lucide-react";
import { fetchLogs } from "@/server/monitoring/log";
import { SAdminLog, TAdminLog } from "@/types/monitoring/log";
import { useQuery } from "@tanstack/react-query";
import { ELogType } from "@prisma/client";

// Mock data for demonstration - replace with your actual data
const mockLogs = [
  {
    id: "log_1",
    type: "USER_ACTION",
    actionByUserId: "user_123",
    actionOnUserId: "user_456",
    userIp: "192.168.1.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    resourceType: "TENDER",
    resourceId: "tender_789",
    changes: { status: { from: "draft", to: "published" } },
    description: "User published a new tender",
    success: true,
    module: "TENDERS",
    timestamp: "2024-12-27T10:30:45Z"
  },
  {
    id: "log_2",
    type: "AUTH",
    actionByUserId: "user_789",
    actionOnUserId: null,
    userIp: "10.0.0.45",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    resourceType: "USER",
    resourceId: "user_789",
    changes: null,
    description: "User login attempt",
    success: true,
    module: "AUTH",
    timestamp: "2024-12-27T10:25:12Z"
  },
  {
    id: "log_3",
    type: "SYSTEM",
    actionByUserId: "system",
    actionOnUserId: null,
    userIp: "127.0.0.1",
    userAgent: "System",
    resourceType: "PARTNERSHIP",
    resourceId: "partner_456",
    changes: { status: { from: "pending", to: "approved" } },
    description: "Partnership automatically approved",
    success: true,
    module: "PARTNERSHIPS",
    timestamp: "2024-12-27T10:20:33Z"
  },
  {
    id: "log_4",
    type: "USER_ACTION",
    actionByUserId: "user_234",
    actionOnUserId: null,
    userIp: "172.16.0.89",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
    resourceType: "BLOG",
    resourceId: "blog_321",
    changes: { title: { from: "Draft Title", to: "Final Title" } },
    description: "Blog post updated",
    success: true,
    module: "BLOG",
    timestamp: "2024-12-27T10:15:21Z"
  },
  {
    id: "log_5",
    type: "ERROR",
    actionByUserId: "user_567",
    actionOnUserId: null,
    userIp: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    resourceType: "TENDER",
    resourceId: "tender_999",
    changes: null,
    description: "Failed to delete tender - insufficient permissions",
    success: false,
    module: "TENDERS",
    timestamp: "2024-12-27T10:10:55Z"
  }
];

export default function LogsPage() {
  const perPage = 30;
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterModule, setFilterModule] = useState("ALL");
  const [filterSuccess, setFilterSuccess] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<TAdminLog | null>(null);

     const {data:logsData, isLoading} = useQuery({
          queryKey:["admin-logs", page],
          queryFn: () => fetchLogs(SAdminLog, undefined, perPage, (page-1)*perPage),
     });

     const totalLogs = logsData?.pagination.total || 0;
     const logs = logsData?.data ?? []

  const totalPages = Math.ceil(totalLogs / perPage);

  const getTypeIcon = (type: ELogType ) => {
    switch (type) {
      case "AUTH": return Shield;
      case "USER_ACTION": return User;
      case "SYSTEM": return Settings;
      case "ERROR": return AlertCircle;
      default: return FileText;
    }
  };

  const getModuleIcon = (module:string) => {
    switch (module.toLocaleUpperCase()) {
      case "TENDERS": return FileText;
      case "AUTH": return Shield;
      case "PARTNERSHIPS": return User;
      case "BLOG": return FileText;
      case "DATABASE": return Database;
      case "EMAIL": return Mail;
      default: return Settings;
    }
  };

  const getStatusBadge = (success:boolean) => {
    if (success) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3" />
          Success
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
        <XCircle className="w-3 h-3" />
        Failed
      </span>
    );
  };

  const formatTimestamp = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleExport = () => {
    // Implement export functionality
    console.log("Exporting logs...");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Logs</h1>
          <p className="text-gray-600">Monitor all platform activities and system events</p>
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search logs by description, user ID, or resource..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 font-medium"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 font-medium"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors flex items-center gap-2 text-white font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select aria-label="Select Module"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="ALL">All Types</option>
                  <option value="AUTH">Authentication</option>
                  <option value="USER_ACTION">User Action</option>
                  <option value="SYSTEM">System</option>
                  <option value="ERROR">Error</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Module</label>
                <select aria-label="Select Module"
                  value={filterModule}
                  onChange={(e) => setFilterModule(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="ALL">All Modules</option>
                  <option value="TENDERS">Tenders</option>
                  <option value="PARTNERSHIPS">Partnerships</option>
                  <option value="BLOG">Blog</option>
                  <option value="AUTH">Authentication</option>
                  <option value="DATABASE">Database</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select aria-label="Select Status"
                  value={filterSuccess}
                  onChange={(e) => setFilterSuccess(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="ALL">All Status</option>
                  <option value="SUCCESS">Success Only</option>
                  <option value="FAILED">Failed Only</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No logs found</p>
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Module</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {logs.map((log) => {
                      const TypeIcon = getTypeIcon(log.type);
                      const ModuleIcon = getModuleIcon(log.module);
                      return (
                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatTimestamp(log.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <TypeIcon className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-900">{log.type}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <ModuleIcon className="w-4 h-4 text-yellow-600" />
                              <span className="text-sm text-gray-700">{log.module}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 max-w-md truncate">
                            {log.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                            {log.actionByUserId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(log.success)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedLog(log)}
                              className="text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="lg:hidden divide-y divide-gray-200">
                {logs.map((log) => {
                  const TypeIcon = getTypeIcon(log.type);
                  const ModuleIcon = getModuleIcon(log.module);
                  return (
                    <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <TypeIcon className="w-5 h-5 text-gray-500" />
                          <span className="text-sm font-semibold text-gray-900">{log.type}</span>
                        </div>
                        {getStatusBadge(log.success)}
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3">{log.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <ModuleIcon className="w-3 h-3" />
                          {log.module}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {log.actionByUserId}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{formatTimestamp(log.createdAt)}</span>
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="text-yellow-600 hover:text-yellow-700 font-medium text-xs"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && logs.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, totalLogs)} of {totalLogs} logs
            </p>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        page === pageNum
                          ? 'bg-yellow-500 text-white font-medium'
                          : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Log Details Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedLog(null)}>
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Log Details</h2>
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Log ID</p>
                    <p className="text-sm text-gray-900 font-mono">{selectedLog.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                    {getStatusBadge(selectedLog.success)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Type</p>
                    <p className="text-sm text-gray-900">{selectedLog.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Module</p>
                    <p className="text-sm text-gray-900">{selectedLog.module}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Timestamp</p>
                    <p className="text-sm text-gray-900">{formatTimestamp(selectedLog.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">User IP</p>
                    <p className="text-sm text-gray-900 font-mono">{selectedLog.userIp}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
                  <p className="text-sm text-gray-900">{selectedLog.description}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Action By User</p>
                  <p className="text-sm text-gray-900 font-mono">{selectedLog.actionByUserId}</p>
                </div>

                {selectedLog.actionOnUserId && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Action On User</p>
                    <p className="text-sm text-gray-900 font-mono">{selectedLog.actionOnUserId}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Resource</p>
                  <p className="text-sm text-gray-900">
                    {selectedLog.resourceType} - <span className="font-mono">{selectedLog.resourceId}</span>
                  </p>
                </div>

                {selectedLog.changes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Changes</p>
                    <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-x-auto">
                      {JSON.stringify(selectedLog.changes, null, 2)}
                    </pre>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">User Agent</p>
                  <p className="text-xs text-gray-700 break-all">{selectedLog.userAgent}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}