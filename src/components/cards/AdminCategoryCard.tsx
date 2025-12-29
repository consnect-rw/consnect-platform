"use client";

import { TAdminCategoryCard } from '@/types/common/category';
import { Pencil, Trash2 } from 'lucide-react';
import { CategoryFormToggleBtn } from '../forms/common/CategoryForm';

const AdminCategoryCard = ({
  category,
}: {
  category: TAdminCategoryCard;
}) => {
  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200">
      {/* Image Section */}
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6 flex gap-3">
        <CategoryFormToggleBtn title='Edit category' id={category.id} category={category} categoryType={category.type} name='Edit' icon={<Pencil className="w-4 h-4" />}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition-colors"
        />

        <button
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-xl transition-colors shadow-sm"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default AdminCategoryCard;