"use client";

import { TAdminBlogCard } from "@/types/blog/blog";
import Image from "../ui/Image";
import { Calendar, Clock, Edit, Eye, Heart, Loader2, MessageSquare, Trash, Trash2 } from "lucide-react";
import { getDate } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { deleteBlog } from "@/server/blog/blog";
import { toast } from "sonner";
import { deleteMultipleImages} from "@/util/s3Helpers";
import queryClient from "@/lib/queryClient";
import { EBlogStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

const StatusConfig = {
  ARCHIVED: {
    gradient: "from-gray-600 to-slate-700",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    icon: "📦",
  },
  DRAFT: {
    gradient: "from-yellow-500 to-amber-600",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    icon: "✏️",
  },
  PUBLISHED: {
    gradient: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    icon: "✓",
  },
};

const BlogCard = ({ blog }: { blog: TAdminBlogCard }) => {
  const [deleting, setDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const statusConfig = StatusConfig[blog.status];

  const handleDelete = async () => {
    setDeleting(true);
    try {
      if (confirm("You are about to delete the blog. This action cannot be undone!")) {
        const res = await deleteBlog(blog.id);
        if (!res) {
          return toast.error("Error deleting blog!");
        } else {
          await deleteMultipleImages([blog.featuredImageUrl, ...(blog.images || [])]);
          queryClient.invalidateQueries();
          return toast.success("Blog deleted successfully");
        }
      }
    } catch (error) {
      console.log(error);
      return toast.error("Application Error. Please contact support!");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="group w-full flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image Section with Overlay */}
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
        {!imageError ? (
          <Image
            src={blog.featuredImageUrl}
            alt={blog.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-4xl">📝</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <div
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg backdrop-blur-sm bg-gradient-to-r",
              statusConfig.gradient
            )}
          >
            <span>{statusConfig.icon}</span>
            <span>{blog.status}</span>
          </div>
        </div>

        {/* Reading Time Badge */}
        {blog.readingTime && (
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
              <Clock className="w-3 h-3" />
              <span>{blog.readingTime} min read</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-yellow-600 transition-colors">
          {blog.title}
        </h3>

        {/* Description */}
        {blog.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{blog.description}</p>
        )}

        {/* Category Tag */}
        {blog.category && (
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
              {blog.category.name}
            </span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 py-3 border-y border-gray-100">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-gray-500">
              <Eye className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-gray-900">{blog._count.views.toLocaleString()}</span>
            <span className="text-xs text-gray-500">Views</span>
          </div>

          <div className="flex flex-col items-center gap-1 border-x border-gray-100">
            <div className="flex items-center gap-1 text-red-500">
              <Heart className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-gray-900">{blog._count.likes.toLocaleString()}</span>
            <span className="text-xs text-gray-500">Likes</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-blue-500">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-gray-900">{blog._count.comments}</span>
            <span className="text-xs text-gray-500">Comments</span>
          </div>
        </div>

        {/* Date Information */}
        <div className="flex flex-col gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Created: {getDate(blog.createdAt)}</span>
          </div>
          {blog.publishedAt && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-green-600" />
              <span className="text-green-600 font-medium">Published: {getDate(blog.publishedAt)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-auto pt-4">
          <Link
            href={`/admin/blogs/form?id=${blog.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </Link>

          <button
            onClick={handleDelete}
            type="button"
            disabled={deleting}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
          >
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminBlogsContainer = ({blogs}:{blogs: TAdminBlogCard[]}) => {
     if(blogs.length === 0) return (
          <div className="w-full flex items-center justify-center py-6 "><p className="text-gray-600 font-medium">No blogs Founds!</p></div>
     )
     return (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
               {
                    blogs.map(b => <BlogCard blog={b} key={`admin-blog-card-${b.id}`} />)
               }
          </div>
     )
}