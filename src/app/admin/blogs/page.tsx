"use client";

import { AdminBlogsContainer } from "@/components/containers/BlogsContainer";
import Pagination from "@/components/ui/Pagination";
import { fetchBlogs } from "@/server/blog/blog";
import { SAdminBlogCard } from "@/types/blog/blog";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FileText, Eye, MessageSquare, ThumbsUp, Search, Filter, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";
import { EBlogStatus } from "@prisma/client";
import { fetchCategorys } from "@/server/common/category";

export default function AdminBlogsPage() {
  const perPage = 20;
  const [page, setPage] = useState(1);
  const [searchItem, setSearchItem] = useState("");
  const [category, setCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: blogsData, isLoading } = useQuery({
    queryKey: ["admin-blogs", page, searchItem, category, statusFilter],
    queryFn: () =>
      fetchBlogs(
        SAdminBlogCard,
        {
          ...(searchItem ? { title: { contains: searchItem } } : {}),
          ...(category ? { category: { id: category } } : {}),
          ...(statusFilter ? { status: statusFilter as EBlogStatus } : {}),
        },
        perPage,
        (page - 1) * perPage
      ),
  });

     const {data:categoriesData, isLoading:fetchingCategories} = useQuery({
          queryKey: ["blog-form-categories"],
          queryFn:() => fetchCategorys({id:true, name:true}, {type: "BLOG"}, 100)
     });
     const categories = categoriesData?.data ?? [];
  const blogs = blogsData?.data ?? [];
  const totalBlogs = blogsData?.pagination.total ?? 0;

  // Calculate statistics from blogs data
  const publishedBlogs = blogs.filter((b) => b.status === "PUBLISHED").length;
  const draftBlogs = blogs.filter((b) => b.status === "DRAFT").length;
  const totalViews = blogs.reduce((sum, b) => sum + (b.viewCount || 0), 0);
  const totalComments = blogs.reduce((sum, b) => sum + (b.commentCount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Management</h1>
              <p className="text-gray-600">Manage and monitor all blog posts on the platform</p>
            </div>
            <Link
              href="/admin/blogs/form"
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create New Blog
            </Link>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <FileText className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12%</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Total Blogs</p>
              <p className="text-3xl font-bold text-gray-900">{totalBlogs}</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Published</p>
              <p className="text-3xl font-bold text-gray-900">{publishedBlogs}</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Total Views</p>
              <p className="text-3xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Total Comments</p>
              <p className="text-3xl font-bold text-gray-900">{totalComments}</p>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search blogs by title..."
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {/* Category Filter */}
              <select 
               title="Select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                    <option value="">All</option>
                {
                    categories.map(c => <option key={`blog-category-select-${c.id}`} value={c.id}>{c.name}</option>)
                }
              </select>

              {/* Status Filter */}
              <select
               title="Select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">All Status</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading blogs...</p>
            </div>
          </div>
        ) : (
          <>
            <AdminBlogsContainer blogs={blogs} />
            <div className="mt-6">
              <Pagination
                totalItems={totalBlogs}
                itemsPerPage={perPage}
                currentPage={page}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}