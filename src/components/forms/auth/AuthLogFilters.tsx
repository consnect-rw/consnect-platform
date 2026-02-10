"use client";

import { useState } from "react";
import { Search, Calendar, User, Shield, Monitor, MapPin, X } from "lucide-react";
import { EAuthAction, EUserRole, EAdminRole } from "@prisma/client";

interface AuthLogFiltersProps {
  onFilterChange: (filters: AuthLogFilterState) => void;
  totalResults: number;
}

export interface AuthLogFilterState {
  search?: string;
  action?: EAuthAction;
  userRole?: EUserRole;
  adminRole?: EAdminRole;
  ipAddress?: string;
  userAgent?: string;
  success?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export function AuthLogFilters({ onFilterChange, totalResults }: AuthLogFiltersProps) {
  const [filters, setFilters] = useState<AuthLogFilterState>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof AuthLogFilterState, value: any) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-gray-900" />
            </div>
            Filter Auth Logs
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            {totalResults} {totalResults === 1 ? "result" : "results"} found
            {activeFilterCount > 0 && ` • ${activeFilterCount} active ${activeFilterCount === 1 ? "filter" : "filters"}`}
          </p>
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Basic Filters */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Search by Email/Name */}
        <div>
          <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-yellow-600" />
            User Email or Name
          </label>
          <input
            type="text"
            value={filters.search || ""}
            onChange={(e) => updateFilter("search", e.target.value)}
            placeholder="Search by email or name..."
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:outline-none transition-colors"
          />
        </div>

        {/* Action Type */}
        <div>
          <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-yellow-600" />
            Action Type
          </label>
          <select
                aria-label="Filter by authentication action type"
            value={filters.action || ""}
            onChange={(e) => updateFilter("action", e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:outline-none transition-colors"
          >
            <option value="">All Actions</option>
            <option value="LOGIN">Login</option>
            <option value="LOGOUT">Logout</option>
            <option value="PASSWORD_CHANGE">Password Change</option>
            <option value="TWO_FACTOR_ENABLE">2FA Enabled</option>
            <option value="TWO_FACTOR_DISABLE">2FA Disabled</option>
            <option value="EMAIL_VERIFICATION">Email Verification</option>
            <option value="ACCOUNT_LOCK">Account Locked</option>
            <option value="ACCOUNT_UNLOCK">Account Unlocked</option>
          </select>
        </div>

        {/* Success/Failure */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Status
          </label>
          <select
               aria-label="Filter by success or failure status"
            value={filters.success === undefined ? "" : filters.success.toString()}
            onChange={(e) => updateFilter("success", e.target.value === "" ? undefined : e.target.value === "true")}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:outline-none transition-colors"
          >
            <option value="">All Statuses</option>
            <option value="true">Success Only</option>
            <option value="false">Failed Only</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm font-bold text-yellow-600 hover:text-yellow-700 mb-4 flex items-center gap-2"
      >
        {showAdvanced ? "Hide" : "Show"} Advanced Filters
        <span className="text-xs">({showAdvanced ? "−" : "+"})</span>
      </button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t-2 border-gray-200">
          {/* User Role */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-yellow-600" />
              User Role
            </label>
            <select
               aria-label="Filter by user role"
              value={filters.userRole || ""}
              onChange={(e) => updateFilter("userRole", e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:outline-none transition-colors"
            >
              <option value="">All Roles</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Admin Role */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-yellow-600" />
              Admin Role
            </label>
            <select
               aria-label="Filter by admin role"
              value={filters.adminRole || ""}
              onChange={(e) => updateFilter("adminRole", e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:outline-none transition-colors"
            >
              <option value="">All Admin Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMIN">Admin</option>
              <option value="MODERATOR">Moderator</option>
              <option value="CONTENT_MANAGER">Content Manager</option>
              <option value="CUSTOMER_SUPPORT">Customer Support</option>
              <option value="NONE">Non-Admin</option>
            </select>
          </div>

          {/* IP Address */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-yellow-600" />
              IP Address
            </label>
            <input
              type="text"
              value={filters.ipAddress || ""}
              onChange={(e) => updateFilter("ipAddress", e.target.value)}
              placeholder="e.g., 192.168.1.1"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:outline-none transition-colors"
            />
          </div>

          {/* User Agent */}
          <div className="md:col-span-2">
            <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-yellow-600" />
              User Agent (Browser/Device)
            </label>
            <input
              type="text"
              value={filters.userAgent || ""}
              onChange={(e) => updateFilter("userAgent", e.target.value)}
              placeholder="e.g., Chrome, Safari, Mobile..."
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:outline-none transition-colors"
            />
          </div>

          {/* Date Range */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-yellow-600" />
              From Date
            </label>
            <input
               aria-label="Filter logs from this date"
              type="date"
              value={filters.dateFrom || ""}
              onChange={(e) => updateFilter("dateFrom", e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-yellow-600" />
              To Date
            </label>
            <input
               aria-label="Filter logs up to this date"
              type="date"
              value={filters.dateTo || ""}
              onChange={(e) => updateFilter("dateTo", e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:outline-none transition-colors"
            />
          </div>
        </div>
      )}
    </div>
  );
}
