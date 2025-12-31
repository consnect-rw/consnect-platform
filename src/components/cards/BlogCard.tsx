"use client";
import { Eye, MessageCircle, Heart, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { TBlogCard } from "@/types/blog/blog";
import Image from "../ui/Image";


interface BlogCardProps {
  blog: TBlogCard;
  featured?: boolean;
}

export default function BlogCard({ blog, featured = false }: BlogCardProps) {
  const publishedDate = blog.publishedAt || blog.createdAt;
  const timeAgo = formatDistanceToNow(new Date(publishedDate), {
    addSuffix: true,
  });

  if (featured) {
    return (
      <Link
        href={`/blog/${blog.id}`}
        className="group block bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-yellow-400 transition-colors duration-200"
      >
        <div className="grid md:grid-cols-2 gap-0">
          {/* Featured Image */}
          <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden bg-gray-100">
            {blog.featuredImageUrl ? (
              <Image
                src={blog.featuredImageUrl}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <span className="text-6xl font-black text-gray-300">
                  {blog.title.charAt(0)}
                </span>
              </div>
            )}
            {/* Featured Badge */}
            <div className="absolute top-6 left-6 bg-yellow-400 text-gray-900 px-4 py-1.5 font-black text-xs uppercase tracking-widest">
              Featured
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            {/* Category */}
            {blog.category && (
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider">
                  {blog.category.name}
                </span>
              </div>
            )}

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight group-hover:text-gray-700 transition-colors">
              {blog.title}
            </h2>

            {/* Description */}
            {blog.description && (
              <p className="text-gray-600 text-lg leading-relaxed mb-6 line-clamp-3">
                {blog.description}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{timeAgo}</span>
              </div>
              {blog.readingTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{blog.readingTime} min read</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span className="font-medium">{blog.viewCount}</span>
              </div>
            </div>

            {/* Read More */}
            <div className="flex items-center gap-2 text-gray-900 font-bold group-hover:gap-4 transition-all">
              <span>Read Article</span>
              <span className="text-yellow-400">→</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${blog.id}`}
      className="group block bg-white border-2 border-gray-200 hover:border-yellow-400 transition-colors duration-200 h-full"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        {blog.featuredImageUrl ? (
          <Image
            src={blog.featuredImageUrl}
            alt={blog.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-5xl font-black text-gray-300">
              {blog.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        {blog.category && (
          <div className="mb-3">
            <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider">
              {blog.category.name}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight group-hover:text-gray-700 transition-colors line-clamp-2">
          {blog.title}
        </h3>

        {/* Description */}
        {blog.description && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
            {blog.description}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span className="font-medium">{blog.viewCount}</span>
            </div>
            {blog.likeCount > 0 && (
              <div className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                <span className="font-medium">{blog.likeCount}</span>
              </div>
            )}
            {blog.commentCount > 0 && (
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="font-medium">{blog.commentCount}</span>
              </div>
            )}
          </div>
          {blog.readingTime && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-medium">{blog.readingTime} min</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}