"use client";

import { CategoryFormToggleBtn } from "@/components/forms/common/CategoryForm";
import { SpecializationFormToggleBtn } from "@/components/forms/company/SpecializationForm";
import { fetchCategorys } from "@/server/common/category";
import { SAdminCompanyCategory, TAdminCompanyCategory } from "@/types/common/category";
import { useQuery } from "@tanstack/react-query";
import { 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  Edit2, 
  Trash2, 
  Folder, 
  FolderOpen,
  ListTree,
  Sparkles,
  Building2
} from "lucide-react";
import { useState } from "react";

export default function CompanySpecializationsPage() {
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["admin-company-categories"],
    queryFn: () => fetchCategorys(SAdminCompanyCategory, { type: "COMPANY", parentId: null }, 50)
  });
  const categories = categoriesData?.data ?? [];

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubCategories, setExpandedSubCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleSubCategory = (subCategoryId: string) => {
    const newExpanded = new Set(expandedSubCategories);
    if (newExpanded.has(subCategoryId)) {
      newExpanded.delete(subCategoryId);
    } else {
      newExpanded.add(subCategoryId);
    }
    setExpandedSubCategories(newExpanded);
  };

  const handleDeleteCategory = (categoryId: string) => {
    // Implement delete logic
    console.log("Delete category:", categoryId);
  };

  const handleDeleteSubCategory = (subCategoryId: string) => {
    // Implement delete logic
    console.log("Delete subcategory:", subCategoryId);
  };

  const handleDeleteSpecialization = (specializationId: string) => {
    // Implement delete logic
    console.log("Delete specialization:", specializationId);
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-2xl font-bold text-yellow-800">Company Categories</h2>
        </div>
        <div className="w-full space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-linear-to-r from-gray-100 to-yellow-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between gap-4 flex-wrap p-4 bg-linear-to-r from-gray-50 via-white to-yellow-50 rounded-xl border-2 border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-md">
            <Building2 className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-yellow-800">Company Categories</h2>
            <p className="text-sm text-gray-600">Manage global categories, subcategories & specializations</p>
          </div>
        </div>
        <CategoryFormToggleBtn
          title="New Global Category"
          name="Category"
          className="py-2.5 px-5 text-white bg-linear-to-br from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
          icon={<Plus className="w-4 h-4" strokeWidth={2.5} />}
          type="button"
          categoryType="COMPANY"
        />
      </div>

      {/* Categories List */}
      <div className="w-full space-y-3">
        {categories.length === 0 ? (
          <div className="w-full p-12 text-center bg-linear-to-br from-gray-50 to-yellow-50 rounded-xl border-2 border-dashed border-gray-200">
            <Folder className="w-16 h-16 mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
            <h3 className="text-lg font-bold text-gray-700 mb-2">No Categories Yet</h3>
            <p className="text-sm text-gray-500 mb-4">Create your first global category to get started</p>
            <CategoryFormToggleBtn
              title="Create First Category"
              name="Category"
              className="py-2 px-4 text-white bg-linear-to-br from-gray-500 to-gray-600 rounded-lg inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300"
              icon={<Plus className="w-4 h-4" />}
              type="button"
              categoryType="COMPANY"
            />
          </div>
        ) : (
          categories.map((category, categoryIndex) => (
            <div
              key={category.id}
              className="rounded-xl border-2 border-gray-200 bg-white overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${categoryIndex * 50}ms` }}
            >
              {/* Category Header */}
              <div className="bg-linear-to-r from-gray-600 to-gray-700">
                <div className="flex items-center gap-3 p-4">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="flex-1 cursor-pointer flex items-center gap-3 text-left group"
                  >
                    <div className="shrink-0 transition-transform duration-300 group-hover:scale-110">
                      {expandedCategories.has(category.id) ? (
                        <ChevronDown className="w-5 h-5 text-white" strokeWidth={2.5} />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-white" strokeWidth={2.5} />
                      )}
                    </div>
                    <div className="shrink-0">
                      {expandedCategories.has(category.id) ? (
                        <FolderOpen className="w-6 h-6 text-yellow-300" strokeWidth={2} />
                      ) : (
                        <Folder className="w-6 h-6 text-yellow-300" strokeWidth={2} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-lg font-bold text-white truncate">
                        {category.name}
                      </h3>
                      <p className="text-xs text-gray-100">
                        {category.subCategories.length} subcategor{category.subCategories.length !== 1 ? 'ies' : 'y'}
                      </p>
                    </div>
                  </button>

                  {/* Category Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <CategoryFormToggleBtn
                      title="Edit Category"
                      name="Category"
                      className="p-2 bg-gray-700 cursor-pointer flex items-center gap-1 text-white hover:bg-gray-800 rounded-lg transition-colors duration-200 group/edit"
                      icon={<Edit2 className="w-4 h-4 text-white group-hover/edit:scale-110 transition-transform" strokeWidth={2.5} />}
                      type="button"
                      categoryType="COMPANY"
                      category={{id: category.id, name: category.name,}}
                    />
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors duration-200 group/delete"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4 text-white group-hover/delete:scale-110 transition-transform" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>

              {/* SubCategories */}
              {expandedCategories.has(category.id) && (
                <div className="p-4 space-y-3 bg-linear-to-br from-gray-50/50 to-transparent animate-fadeIn">
                  {/* Add SubCategory Button */}
                  <div className="flex justify-end mb-2">
                    <CategoryFormToggleBtn
                      title="Add Subcategory"
                      name="Subcategory"
                      className="py-2 px-3 text-sm cursor-pointer text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors duration-200 font-semibold"
                      icon={<Plus className="w-3.5 h-3.5" strokeWidth={2.5} />}
                      type="button"
                      categoryType="COMPANY"
                      parentId={category.id}
                    />
                  </div>

                  {category.subCategories.length === 0 ? (
                    <div className="p-6 text-center bg-white rounded-lg border-2 border-dashed border-gray-200">
                      <ListTree className="w-10 h-10 mx-auto mb-2 text-gray-300" strokeWidth={1.5} />
                      <p className="text-sm text-gray-500">No subcategories yet</p>
                    </div>
                  ) : (
                    category.subCategories.map((subCategory, subIndex) => (
                      <div
                        key={subCategory.id}
                        className="rounded-lg border-2 border-gray-200 bg-white overflow-hidden transition-all duration-200 hover:border-gray-300 hover:shadow-md"
                        style={{ animationDelay: `${subIndex * 30}ms` }}
                      >
                        {/* SubCategory Header */}
                        <div className="bg-linear-to-r from-gray-100 to-gray-50">
                          <div className="flex items-center gap-3 p-3">
                            <button
                              onClick={() => toggleSubCategory(subCategory.id)}
                              className="flex-1 cursor-pointer flex items-center gap-2 text-left group/sub"
                            >
                              <div className="shrink-0 transition-transform duration-200 group-hover/sub:scale-110">
                                {expandedSubCategories.has(subCategory.id) ? (
                                  <ChevronDown className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm md:text-base font-semibold text-gray-800 truncate">
                                  {subCategory.name}
                                </h4>
                                <p className="text-xs text-gray-500">
                                  {subCategory._count.specializations} specialization{subCategory._count.specializations !== 1 ? 's' : ''}
                                </p>
                              </div>
                            </button>

                            {/* SubCategory Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                              <CategoryFormToggleBtn
                                title="Edit Subcategory"
                                name="Subcategory"
                                className="p-1.5 px-3 cursor-pointer flex items-center gap-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-200 group/edit"
                                icon={<Edit2 className="w-3.5 h-3.5 text-gray-700 group-hover/edit:scale-110 transition-transform" strokeWidth={2.5} />}
                                type="button"
                                categoryType="COMPANY"
                                category={{id: subCategory.id, name: subCategory.name}}
                                parentId={category.id}
                              />
                              <button
                                onClick={() => handleDeleteSubCategory(subCategory.id)}
                                className="p-2 cursor-pointer bg-red-100 hover:bg-red-200 rounded-md transition-colors duration-200 group/delete"
                                title="Delete Subcategory"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-600 group-hover/delete:scale-110 transition-transform" strokeWidth={2.5} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Specializations */}
                        {expandedSubCategories.has(subCategory.id) && (
                          <div className="p-3 space-y-2 bg-linear-to-br from-yellow-50/30 to-transparent animate-fadeIn">
                            {/* Add Specialization Button */}
                            <div className="flex justify-end mb-2">
                              <SpecializationFormToggleBtn
                                title="Add Specialization"
                                name="Specialization"
                                className="py-1.5 px-3 text-xs text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-md flex items-center gap-1.5 transition-colors duration-200 font-semibold"
                                icon={<Plus className="w-3 h-3" strokeWidth={2.5} />}
                                type="button"
                                categoryId={subCategory.id}
                              />
                            </div>

                            {subCategory.specializations.length === 0 ? (
                              <div className="p-4 text-center bg-white rounded-md border border-dashed border-yellow-200">
                                <Sparkles className="w-8 h-8 mx-auto mb-1 text-yellow-300" strokeWidth={1.5} />
                                <p className="text-xs text-gray-500">No specializations yet</p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {subCategory.specializations.map((specialization, specIndex) => (
                                  <div
                                    key={specialization.id}
                                    className="group/spec flex items-center justify-between gap-2 p-3 bg-white rounded-md border border-yellow-200 hover:border-yellow-400 hover:shadow-sm transition-all duration-200"
                                    style={{ animationDelay: `${specIndex * 20}ms` }}
                                  >
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                      <Sparkles className="w-4 h-4 text-yellow-500 shrink-0" strokeWidth={2} />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">
                                          {specialization.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {specialization._count.companies} compan{specialization._count.companies !== 1 ? 'ies' : 'y'}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Specialization Actions */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <SpecializationFormToggleBtn
                                        title="Edit Specialization"
                                        name="Specialization"
                                        className="p-1.5 flex items-center ga-1 bg-yellow-100 hover:bg-yellow-200 rounded-md transition-colors duration-200 opacity-0 group-hover/spec:opacity-100"
                                        icon={<Edit2 className="w-3 h-3 text-yellow-700" strokeWidth={2.5} />}
                                        type="button"
                                        categoryId={specialization.id}
                                        specialization={{id: specialization.id, name: specialization.name}}
                                      />
                                      <button
                                        onClick={() => handleDeleteSpecialization(specialization.id)}
                                        className="p-1.5 bg-red-100 hover:bg-red-200 rounded-md transition-colors duration-200 opacity-0 group-hover/spec:opacity-100"
                                        title="Delete Specialization"
                                      >
                                        <Trash2 className="w-3 h-3 text-red-600" strokeWidth={2.5} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}