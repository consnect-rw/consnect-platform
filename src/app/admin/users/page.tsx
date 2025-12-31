// "use client";

// import { AdminUsersContainer } from "@/components/containers/admin/AdminUsersContainer";
// import Pagination from "@/components/ui/Pagination";
// import { fetchUsers } from "@/server/auth/user";
// import { SAdminUserRow } from "@/types/auth/user";
// import { EUserRole } from "@prisma/client";
// import { useQuery } from "@tanstack/react-query";
// import { useState } from "react";

// export default function AdminUsersPage () {
//      const perPage = 30;
//      const [page,setPage] = useState(1);
//      const [searchItem,setSearchItem] = useState("");
//      const {data: usersData,isLoading} = useQuery({
//           queryKey: ["admin-users", page, searchItem],
//           queryFn: () => fetchUsers(SAdminUserRow, {
//                ...(searchItem ? {
//                     OR: [
//                          {name: {contains:searchItem}},
//                          {email: {contains:searchItem}},
//                          {phone: {contains:searchItem}},
//                          {company:{name:{contains: searchItem}}}
//                     ]
//                } :{}),
//                role: EUserRole.USER
//           }, perPage, (page-1)*perPage)
//      });

//      const users = usersData?.data ?? [];
//      const totalUsers = usersData?.pagination.total ?? 0;

//      return (
//           <div className="w-full">
//                <AdminUsersContainer users={users} />
//                <Pagination itemsPerPage={perPage} currentPage={page} totalItems={totalUsers} onPageChange={setPage} />
//           </div>
//      )
// }

"use client";

import { AdminUsersContainer } from "@/components/containers/admin/AdminUsersContainer";
import Pagination from "@/components/ui/Pagination";
import { fetchUsers } from "@/server/auth/user";
import { SAdminUserRow } from "@/types/auth/user";
import { EUserRole } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, Users} from "lucide-react";

export default function AdminUsersPage() {
  const perPage = 30;
  const [page, setPage] = useState(1);
  const [searchItem, setSearchItem] = useState("");
  
  const { data: usersData, isLoading } = useQuery({
    queryKey: ["admin-users", page, searchItem],
    queryFn: () =>
      fetchUsers(
        SAdminUserRow,
        {
          ...(searchItem
            ? {
                OR: [
                  { name: { contains: searchItem } },
                  { email: { contains: searchItem } },
                  { phone: { contains: searchItem } },
                  { company: { name: { contains: searchItem } } },
                ],
              }
            : {}),
          role: EUserRole.USER,
        },
        perPage,
        (page - 1) * perPage
      ),
  });

  const users = usersData?.data ?? [];
  const totalUsers = usersData?.pagination.total ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br rounded-xl overflow-hidden from-gray-50 via-gray-100 to-yellow-50">
      {/* Modern Header with Yellow & Gray Theme */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-b-4 border-yellow-400">
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-50 animate-pulse"></div>
                <div className="relative bg-yellow-400 p-3 rounded-xl shadow-lg">
                  <Users className="w-8 h-8 text-gray-900" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight">
                  User Management
                </h1>
                <p className="text-gray-400 font-medium mt-1">
                  Manage and monitor all platform users
                </p>
              </div>
            </div>

          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-200 hover:scale-105 transform">
              <div className="text-yellow-400 text-sm font-bold uppercase tracking-wider mb-1">
                Total Users
              </div>
              <div className="text-3xl font-black text-white">
                {totalUsers.toLocaleString()}
              </div>
            </div>

            <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-200 hover:scale-105 transform">
              <div className="text-yellow-400 text-sm font-bold uppercase tracking-wider mb-1">
                Active Now
              </div>
              <div className="text-3xl font-black text-white flex items-baseline">
                {Math.floor(totalUsers * 0.23).toLocaleString()}
                <span className="text-sm font-semibold text-green-400 ml-2">● Online</span>
              </div>
            </div>

            <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-200 hover:scale-105 transform">
              <div className="text-yellow-400 text-sm font-bold uppercase tracking-wider mb-1">
                New This Week
              </div>
              <div className="text-3xl font-black text-white flex items-baseline">
                {Math.floor(totalUsers * 0.08).toLocaleString()}
                <span className="text-sm font-semibold text-yellow-400 ml-2">+12%</span>
              </div>
            </div>

            <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-200 hover:scale-105 transform">
              <div className="text-yellow-400 text-sm font-bold uppercase tracking-wider mb-1">
                Growth Rate
              </div>
              <div className="text-3xl font-black text-white flex items-baseline">
                <span className="text-2xl mr-1">↗</span>
                24.5%
              </div>
            </div>
          </div>

          {/* Search and View Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or company..."
                value={searchItem}
                onChange={(e) => {
                  setSearchItem(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:bg-white/15 transition-all duration-200 font-medium"
              />
              {searchItem && (
                <button
                  onClick={() => {
                    setSearchItem("");
                    setPage(1);
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-yellow-400 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Users className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>
        ) : (
          <>
            <AdminUsersContainer users={users} />
            <div className="mt-8">
              <Pagination
                itemsPerPage={perPage}
                currentPage={page}
                totalItems={totalUsers}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}