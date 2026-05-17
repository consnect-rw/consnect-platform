"use client";

import BlogCard from "@/components/cards/BlogCard";
import Pagination from "@/components/ui/Pagination";
import { fetchBlogs } from "@/server/blog/blog";
import { fetchCategorys } from "@/server/common/category";
import { SBlogCard } from "@/types/blog/blog";
import { EBlogStatus, ECategoryType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { ChangeEvent, useState } from "react";

// Note: metadata cannot be exported from "use client" files.
// This page's metadata is set in the parent layout or a server wrapper.
// SEO for this listing page is handled via the server layout and og tags.

export default function BlogsPage () {
     const [search,setSearch] = useState("");
     const [category, setCategory] = useState("");
     const perPage = 18;
     const [page,setPage] = useState(1);
     
     const {data: categoriesData, isLoading: fetchingCategories} = useQuery({
          queryKey:["blog-categories"],
          queryFn: () => fetchCategorys({name:true, id:true}, {type: ECategoryType.BLOG}, 100)
     });
     const blogCategories = categoriesData?.data ?? [];

     const {data:blogsData, isLoading: fetchingBlogs} = useQuery({
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
                              <select onChange={handleCategorySearch} value={category || "All"} title="search category" className={`appearance-none w-full sm:w-auto pl-4 pr-10 py-3.5 border-2 rounded-xl font-bold text-sm focus:outline-none transition-all cursor-pointer ${category && category !== "All" ? "bg-amber-50 border-amber-400 text-amber-700" : "bg-gray-50 border-gray-200 text-gray-900 hover:border-gray-300 focus:border-yellow-400 focus:bg-white"}`}>
                                   <option value="All">All Categories</option>
                                   {blogCategories.map((c) => (<option value={c.id} key={`select-category-${c.id}`}>{c.name}</option>))}
                              </select>
                              {/* Custom Dropdown Arrow */}
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                   <svg className={`w-5 h-5 ${category && category !== "All" ? "text-amber-500" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                   </svg>
                              </div>
                         </div>
                         {/* Active category chip */}
                         {category && category !== "All" && (
                              <div className="flex items-center gap-1.5 px-3 py-2 bg-amber-400 rounded-xl">
                                   <span className="text-xs font-black text-gray-900 uppercase tracking-wide">
                                        {blogCategories.find(c => c.id === category)?.name ?? "Category"}
                                   </span>
                                   <button onClick={() => setCategory("")} className="ml-1 text-gray-900 hover:text-gray-600 transition-colors" title="Clear category">
                                        <X className="w-3.5 h-3.5" />
                                   </button>
                              </div>
                         )}
                    </div>
                    </div>
               </div>
               {fetchingBlogs ? (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {Array.from({ length: 6 }).map((_, i) => (
                              <div key={i} className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden animate-pulse">
                                   {/* Image skeleton */}
                                   <div className="w-full aspect-video bg-gray-200" />
                                   <div className="p-5 flex flex-col gap-3">
                                        {/* Category badge */}
                                        <div className="w-20 h-5 bg-gray-200 rounded-full" />
                                        {/* Title */}
                                        <div className="flex flex-col gap-2">
                                             <div className="w-full h-4 bg-gray-200 rounded-lg" />
                                             <div className="w-4/5 h-4 bg-gray-200 rounded-lg" />
                                        </div>
                                        {/* Excerpt */}
                                        <div className="flex flex-col gap-1.5">
                                             <div className="w-full h-3 bg-gray-100 rounded" />
                                             <div className="w-full h-3 bg-gray-100 rounded" />
                                             <div className="w-3/4 h-3 bg-gray-100 rounded" />
                                        </div>
                                        {/* Meta row */}
                                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                             <div className="flex items-center gap-2">
                                                  <div className="w-7 h-7 rounded-full bg-gray-200" />
                                                  <div className="w-24 h-3 bg-gray-200 rounded" />
                                             </div>
                                             <div className="w-16 h-3 bg-gray-200 rounded" />
                                        </div>
                                   </div>
                              </div>
                         ))}
                    </div>
               ) : blogs.length === 0 ? (
                    <div className="w-full flex flex-col items-center justify-center py-20 gap-5">
                         <div className="w-20 h-20 rounded-2xl bg-amber-50 flex items-center justify-center">
                              <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                              </svg>
                         </div>
                         <div className="text-center">
                              <p className="text-xl font-black text-gray-900 mb-1">No articles found</p>
                              {(search || (category && category !== "All")) && (
                                   <p className="text-gray-500 font-medium text-sm">
                                        Try adjusting your{search ? <> search for <span className="text-amber-500 font-bold">&ldquo;{search}&rdquo;</span></> : ""}{search && category && category !== "All" ? " or " : ""}{category && category !== "All" ? <> the <span className="text-amber-500 font-bold">{blogCategories.find(c => c.id === category)?.name ?? "selected"}</span> category</> : ""}
                                   </p>
                              )}
                         </div>
                         {(search || (category && category !== "All")) && (
                              <button onClick={() => { setSearch(""); setCategory(""); }} className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-sm rounded-xl transition-colors">
                                   Clear filters
                              </button>
                         )}
                    </div>
               ) : (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                         {blogs.map((blog) => (
                              <BlogCard key={blog.id} blog={blog} />
                         ))}
                    </div>
               )}
               
               <Pagination itemsPerPage={perPage} totalItems={totalBlogs} currentPage={page} onPageChange={p => setPage(p)} />
          </div>
     )
}