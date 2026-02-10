"use client";

import Pagination from "@/components/ui/Pagination";
import { fetchAuthLogs } from "@/server/auth/auth-log";
import { SAuthLog } from "@/types/auth/auth-log";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { AuthLogCard } from "@/components/cards/AuthLogCard";
import { AuthLogFilters, AuthLogFilterState } from "@/components/forms/auth/AuthLogFilters";
import { Prisma } from "@prisma/client";
import { Loader2, FileText } from "lucide-react";

export default function AuthLogsContainer() {
  const perPage = 20;
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AuthLogFilterState>({});

  // Build Prisma where clause from filters
  const whereClause = useMemo((): Prisma.AuthLogWhereInput => {
    const where: Prisma.AuthLogWhereInput = {};

    // Search by user email or name
    if (filters.search) {
      where.user = {
        OR: [
          { email: { contains: filters.search, mode: "insensitive" } },
          { name: { contains: filters.search, mode: "insensitive" } },
        ],
      };
    }

    // Filter by action type
    if (filters.action) {
      where.action = filters.action;
    }

    // Filter by success/failure
    if (filters.success !== undefined) {
      where.success = filters.success;
    }

    // Filter by user role
    if (filters.userRole) {
      if (!where.user) where.user = {};
      (where.user as any).role = filters.userRole;
    }

    // Filter by admin role
    if (filters.adminRole) {
      if (!where.user) where.user = {};
      (where.user as any).adminRole = filters.adminRole;
    }

    // Filter by IP address
    if (filters.ipAddress) {
      where.ipAddress = { contains: filters.ipAddress, mode: "insensitive" };
    }

    // Filter by user agent
    if (filters.userAgent) {
      where.userAgent = { contains: filters.userAgent, mode: "insensitive" };
    }

    // Filter by date range
    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) {
        where.createdAt.gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        // Add 1 day to include the entire end date
        const endDate = new Date(filters.dateTo);
        endDate.setDate(endDate.getDate() + 1);
        where.createdAt.lt = endDate;
      }
    }

    return where;
  }, [filters]);

  const { data: authLogsData, isLoading } = useQuery({
    queryKey: ["admin-auth-logs", perPage, page, whereClause],
    queryFn: () =>
      fetchAuthLogs(
        SAuthLog,
        whereClause,
        perPage,
        (page - 1) * perPage,
        { createdAt: "desc" }
      ),
  });

  const authLogs = authLogsData?.data ?? [];
  const total = authLogsData?.total ?? 0;

  const handleFilterChange = (newFilters: AuthLogFilterState) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            Authentication Logs
          </h1>
          <p className="text-gray-600 text-lg">
            Monitor user authentication activity and security events
          </p>
        </div>

        {/* Filters */}
        <AuthLogFilters onFilterChange={handleFilterChange} totalResults={total} />

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && authLogs.length === 0 && (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-black text-gray-900 mb-2">
              No logs found
            </h3>
            <p className="text-gray-600">
              {Object.keys(filters).length > 0
                ? "Try adjusting your filters to see more results"
                : "No authentication logs available yet"}
            </p>
          </div>
        )}

        {/* Auth Logs Grid */}
        {!isLoading && authLogs.length > 0 && (
          <>
            <div className="grid gap-4 mb-8">
              {authLogs.map((log) => (
                <AuthLogCard key={log.id} log={log} />
              ))}
            </div>

            {/* Pagination */}
            {total > perPage && (
              <div className="flex justify-center">
                <Pagination
                  totalItems={total}
                  itemsPerPage={perPage}
                  currentPage={page}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}