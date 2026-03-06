"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

export interface OfferFilters {
     search: string;
     category: string;
     type: string;
     priority: string;
     budgetMin: string;
     budgetMax: string;
     location: string;
}

interface OffersFilterBarProps {
     filters: OfferFilters;
     onFilterChange: (filters: OfferFilters) => void;
     categories: { id: string; name: string }[];
}

export const OffersFilterBar = ({ filters, onFilterChange, categories }: OffersFilterBarProps) => {
     const [showAdvanced, setShowAdvanced] = useState(false);

     const handleChange = (field: keyof OfferFilters, value: string) => {
          onFilterChange({ ...filters, [field]: value });
     };

     const clearFilters = () => {
          onFilterChange({
               search: "",
               category: "",
               type: "",
               priority: "",
               budgetMin: "",
               budgetMax: "",
               location: "",
          });
          setShowAdvanced(false);
     };

     const hasActiveFilters = Object.values(filters).some(v => v !== "");

     return (
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 overflow-hidden">
               {/* Main Search Bar */}
               <div className="p-4 sm:p-6">
                    <div className="flex gap-3">
                         {/* Search Input */}
                         <div className="flex-1 relative">
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                   type="text"
                                   placeholder="Search offers by title, description..."
                                   value={filters.search}
                                   onChange={(e) => handleChange("search", e.target.value)}
                                   className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none text-gray-900 font-medium"
                              />
                         </div>

                         {/* Filter Toggle Button */}
                         <button
                              onClick={() => setShowAdvanced(!showAdvanced)}
                              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                                   showAdvanced || hasActiveFilters
                                        ? "bg-yellow-400 text-gray-900"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                         >
                              <SlidersHorizontal className="w-5 h-5" />
                              <span className="hidden sm:inline">Filters</span>
                              {hasActiveFilters && !showAdvanced && (
                                   <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                              )}
                         </button>

                         {/* Clear Filters */}
                         {hasActiveFilters && (
                              <button
                                   onClick={clearFilters}
                                   className="px-4 py-3 bg-red-100 hover:bg-red-200 text-red-900 rounded-xl font-bold transition-all"
                                   title="Clear all filters"
                              >
                                   <X className="w-5 h-5" />
                              </button>
                         )}
                    </div>
               </div>

               {/* Advanced Filters */}
               {showAdvanced && (
                    <div className="px-4 sm:px-6 pb-6 border-t-2 border-gray-100 pt-6">
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {/* Category Filter */}
                              <div>
                                   <label htmlFor="category-filter" className="block text-sm font-bold text-gray-700 mb-2">
                                        Category
                                   </label>
                                   <select
                                        id="category-filter"
                                        value={filters.category}
                                        onChange={(e) => handleChange("category", e.target.value)}
                                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:outline-none text-gray-900 font-medium"
                                   >
                                        <option value="">All Categories</option>
                                        {categories.map((cat) => (
                                             <option key={cat.id} value={cat.id}>
                                                  {cat.name}
                                             </option>
                                        ))}
                                   </select>
                              </div>

                              {/* Type Filter */}
                              <div>
                                   <label htmlFor="type-filter" className="block text-sm font-bold text-gray-700 mb-2">
                                        Offer Type
                                   </label>
                                   <select
                                        id="type-filter"
                                        value={filters.type}
                                        onChange={(e) => handleChange("type", e.target.value)}
                                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:outline-none text-gray-900 font-medium"
                                   >
                                        <option value="">All Types</option>
                                        <option value="WORK_TASK">Work Task</option>
                                        <option value="MATERIAL_SUPPLY">Material Supply</option>
                                        <option value="EQUIPMENT_RENTAL">Equipment Rental</option>
                                        <option value="CONSULTANCY">Consultancy</option>
                                        <option value="SUBCONTRACTING">Subcontracting</option>
                                        <option value="MAINTENANCE">Maintenance</option>
                                   </select>
                              </div>

                              {/* Priority Filter */}
                              <div>
                                   <label htmlFor="priority-filter" className="block text-sm font-bold text-gray-700 mb-2">
                                        Priority
                                   </label>
                                   <select
                                        id="priority-filter"
                                        value={filters.priority}
                                        onChange={(e) => handleChange("priority", e.target.value)}
                                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:outline-none text-gray-900 font-medium"
                                   >
                                        <option value="">All Priorities</option>
                                        <option value="URGENT">Urgent</option>
                                        <option value="HIGH">High</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="LOW">Low</option>
                                   </select>
                              </div>

                              {/* Budget Min */}
                              <div>
                                   <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Min Budget
                                   </label>
                                   <input
                                        type="number"
                                        placeholder="0"
                                        value={filters.budgetMin}
                                        onChange={(e) => handleChange("budgetMin", e.target.value)}
                                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:outline-none text-gray-900 font-medium"
                                   />
                              </div>

                              {/* Budget Max */}
                              <div>
                                   <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Max Budget
                                   </label>
                                   <input
                                        type="number"
                                        placeholder="∞"
                                        value={filters.budgetMax}
                                        onChange={(e) => handleChange("budgetMax", e.target.value)}
                                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:outline-none text-gray-900 font-medium"
                                   />
                              </div>

                              {/* Location */}
                              <div>
                                   <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Location
                                   </label>
                                   <input
                                        type="text"
                                        placeholder="City or Country"
                                        value={filters.location}
                                        onChange={(e) => handleChange("location", e.target.value)}
                                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:outline-none text-gray-900 font-medium"
                                   />
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
};
