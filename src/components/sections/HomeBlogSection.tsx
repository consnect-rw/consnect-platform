"use cache";

import { fetchBlogs } from "@/server/blog/blog";
import { SBlogCard } from "@/types/blog/blog";
import { EBlogStatus } from "@prisma/client";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import BlogCard from "../cards/BlogCard";

export default async function HomeBlogsSection() {
  const { data: blogs, pagination } = await fetchBlogs(
    SBlogCard,
    { status: EBlogStatus.PUBLISHED },
    10
  );
  const totalBlogs = pagination.total;

  if (!blogs || blogs.length === 0) {
    return null;
  }

  const [featuredBlog, ...otherBlogs] = blogs;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12 pb-8 border-b-2 border-gray-200">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-8 bg-yellow-400"></div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                Latest Insights
              </h2>
            </div>
            <p className="text-gray-600 text-lg font-medium ml-5">
              Expert perspectives and industry updates from our team
            </p>
          </div>

          <Link
            href="/blogs"
            className="hidden rounded-lg md:flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold transition-colors group"
          >
            <BookOpen className="w-5 h-5" />
            <span>View All Articles</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Featured Blog */}
        {featuredBlog && (
          <div className="mb-12">
            <BlogCard blog={featuredBlog} featured />
          </div>
        )}

        {/* Blog Grid */}
        {otherBlogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {otherBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}

        {/* View All Button - Mobile */}
        <div className="flex justify-center md:hidden">
          <Link
            href="/blogs"
            className="flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold transition-colors w-full sm:w-auto justify-center"
          >
            <BookOpen className="w-5 h-5" />
            <span>View All {totalBlogs} Articles</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Bottom Accent */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400"></div>
              <span className="font-medium">{totalBlogs} Published Articles</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400"></div>
              <span className="font-medium">Updated Weekly</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}