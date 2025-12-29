"use client";

import { AdminCategoryContainer } from "@/components/containers/admin/AdminCategoryContainer";
import { CategoryFormToggleBtn } from "@/components/forms/common/CategoryForm";
import Pagination from "@/components/ui/Pagination";
import { fetchCategorys } from "@/server/common/category";
import { SAdminCategoryCard } from "@/types/common/category";
import { ECategoryType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";


export default function AdminServiceCategoriesPage () {
     const perPage = 20;
     const [page,setPage] = useState(1);
     const {data: categoriesData, isLoading} = useQuery({
          queryKey: ["admin-service-categories", page], 
          queryFn: () => fetchCategorys(SAdminCategoryCard, {type: ECategoryType.BLOG}, perPage, (page-1)*perPage)
     });
     const categories = categoriesData?.data ?? [];
     const totalCategories = categoriesData?.pagination.total ?? 0;
     return (
          <div className="w-full flex flex-col gap-4">
               <div className="w-full flex flex-col gap-2 bg-white rounded-xl p-4">
                    <h1 className="text-3xl font-extrabold text-gray-900">Service Categories</h1>
                    <div className="w-full flex items-center justify-between">
                         <span className="font-bold text-lg text-gray-600">{totalCategories} categories</span>
                         <CategoryFormToggleBtn categoryType="SERVICE" name="Category" icon={<Plus className="w-5 h-5" />} className={"py-2 px-4 rounded-lg font-bold text-white bg-yellow-800 flex items-center gap-1 cursor-pointer"} title="New Blog Category" />
                    </div>
               </div>
               <AdminCategoryContainer categories={categories} />
               <Pagination totalItems={totalCategories} itemsPerPage={perPage} currentPage={page} onPageChange={p => setPage(p)} />
          </div>
     )
}