"use client";

import { TAdminBlogCard } from "@/types/blog/blog";
import Image from "../ui/Image";
import { Calendar } from "lucide-react";
import { getDate } from "date-fns";

const BlogCard = ({blog}:{blog: TAdminBlogCard}) => {
     return (
          <div className="w-full flex flex-col relative overflow-hidden shadow-md rounded-lg">
               <Image src={blog.featuredImageUrl} alt="blog image" />
               <div className="w-full flex flex-col gap-2">
                    <h3 className="text-xl font-bold text-gray-800">{blog.title}</h3>
                    <div className="w-full flex items-center flex-wrap gap-2">
                         <span className="flex items-center gap-1 text-sm text-gray-700 font-medium">Views: {blog.viewCount}</span>
                         <span className="flex items-center gap-1 text-sm text-gray-700 font-medium">Likes: {blog.likeCount}</span>
                         <span className="flex items-center gap-1 text-sm text-gray-700 font-medium">Comments: {blog.commentCount}</span>
                    </div>
                    <div className="w-full flex items-center gap-4">
                         <span className="flex items-center gap-1 text-sm text-gray-700 font-medium"><Calendar className="w-4 h-4" />Created on: {getDate(blog.createdAt)}</span>
                         {blog.publishedAt ? <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Published on: {getDate(blog.publishedAt)}</span> :null}
                    </div>
               </div>
          </div>
     )
}