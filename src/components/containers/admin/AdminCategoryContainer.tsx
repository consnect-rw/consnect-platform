"use client";

import AdminCategoryCard from "@/components/cards/AdminCategoryCard";
import { TAdminCategoryCard } from "@/types/common/category";

export const AdminCategoryContainer = ({ categories }: { categories: TAdminCategoryCard[] }) => {
  const handleEdit = (id: string | number) => {
    console.log("Edit category:", id);
    // Open edit modal or navigate
  };

  const handleDelete = (id: string | number) => {
    if (confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      console.log("Delete category:", id);
      // Call delete API
    }
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-100 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700">No categories yet</h3>
        <p className="text-gray-500 mt-2">Add your first category to organize services and tenders.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category) => (
        <AdminCategoryCard
          key={category.id}
          category={category}
        />
      ))}
    </div>
  );
};