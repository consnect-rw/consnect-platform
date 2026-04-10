"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TPublicCategoryCard } from "@/types/common/category";

interface CategoryCardProps {
     category: TPublicCategoryCard;
     href: string;
     countLabel: string;
     count: number;
}

export const CategoryCard = ({ category, href, countLabel, count }: CategoryCardProps) => {
     const initial = category.name.charAt(0).toUpperCase();

     return (
          <Link
               href={href}
               className="group flex items-center gap-4 bg-white border-2 border-gray-100 hover:border-yellow-400 rounded-xl p-4 transition-all hover:shadow-md"
          >
               {/* Letter badge */}
               <div className="shrink-0 w-11 h-11 rounded-lg bg-gray-900 group-hover:bg-yellow-400 flex items-center justify-center transition-colors">
                    <span className="text-lg font-black text-white group-hover:text-gray-900 transition-colors">
                         {initial}
                    </span>
               </div>

               {/* Info */}
               <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-yellow-700 transition-colors">
                         {category.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                         {count} {countLabel}
                    </p>
               </div>

               {/* Arrow */}
               <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-yellow-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
     );
};
