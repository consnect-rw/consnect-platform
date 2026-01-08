"use client";

import BlogCard from "@/components/cards/BlogCard";
import HomeBlogsSection from "@/components/sections/HomeBlogSection";
import Pagination from "@/components/ui/Pagination";
import { fetchBlogs } from "@/server/blog/blog";
import { fetchCategorys } from "@/server/common/category";
import { SBlogCard } from "@/types/blog/blog";
import { EBlogStatus, ECategoryType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { ChangeEvent, useState } from "react";

export default function BlogsPage () {
     const [search,setSearch] = useState("");
     const [category, setCategory] = useState("");
     const perPage = 18;
     const [page,setPage] = useState(1);
     
     const {data: categoriesData} = useQuery({
          queryKey:["blog-categories"],
          queryFn: () => fetchCategorys({name:true, id:true}, {type: ECategoryType.BLOG}, 100)
     });
     const blogCategories = categoriesData?.data ?? [];

     const {data:blogsData, isLoading} = useQuery({
          queryKey:["blog-page", search, category, page],
          queryFn:() => fetchBlogs(SBlogCard, {
               status: EBlogStatus.PUBLISHED,
               ...(search ? {OR:[
                    {title: {contains: search, mode:"insensitive"}},
                    {tags:{has: search}}
               ]} : {}),
               ...(category && category !== "All" ? {category: {id: category}} : {})
          }, perPage, (page-1)*perPage)
     });
     const blogs = blogsData?.data ?? [];
     const totalBlogs = blogsData?.pagination.total ?? 0;

     const handleCategorySearch = (e: ChangeEvent<HTMLSelectElement>) => {
          const value = e.target.value;
          return setCategory(value);
     }
     

     return (
          // <HomeBlogsSection />
          <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 py-8 lg:py-12 px-4 lg:px-8">
               <div className="flex items-end justify-between border-gray-200">
                    <div>
                         <div className="flex items-center gap-3 mb-3">
                              <div className="w-1 h-8 bg-yellow-400"></div>
                              <h2 className="text-3xl lg:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                                   Latest Insights
                              </h2>
                         </div>
                         <p className="text-gray-600 text-lg font-medium ml-5">Expert perspectives and industry updates from our team</p>
                    </div>
               </div>
               {/* search component */}
               <div className="w-full bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                         <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                         <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                         </svg>
                         </div>
                         <input type="search" title="search" className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-yellow-400 focus:bg-white transition-all font-medium" placeholder="Search by blog title..." onChange={(e) => setSearch(e.target.value)}/>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                         {/* Category Dropdown */}
                         <div className="relative">
                              <select onChange={handleCategorySearch} title="search category" className="appearance-none w-full sm:w-auto pl-4 pr-10 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 font-bold text-sm focus:outline-none focus:border-yellow-400 focus:bg-white transition-all cursor-pointer hover:border-gray-300" >
                                   <option value="All">All Categories</option>
                                   {blogCategories.map((c) => (<option value={c.id} key={`select-category-${c.id}`}>{c.name}</option>))}
                              </select>
                              {/* Custom Dropdown Arrow */}
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                   <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                   </svg>
                              </div>
                         </div>

                         {/* Results Count */}
                         <div className="flex items-center justify-center sm:justify-start px-4 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm whitespace-nowrap">
                              <span className="text-yellow-400 mr-2">{totalBlogs}</span>
                              <span>updates found</span>
                         </div>
                    </div>
                    </div>
               </div>
               {
                    blogs.length === 0 
                    ? 
                         <p className="text-lg font-medium text-gray-600">Nothing found</p>
                    :
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                         {
                              blogs.map((blog) => (
                                   <BlogCard key={blog.id} blog={blog} />
                              ))
                         }
                    </div>
               }
               
               <Pagination itemsPerPage={perPage} totalItems={totalBlogs} currentPage={page} onPageChange={p => setPage(p)} />
          </div>
     )
}