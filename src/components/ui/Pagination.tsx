"use client";

import { useMemo,} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EDeviceView } from "@/types/enums";
import { useView } from "@/context/ViewContext";

interface PaginationProps {
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  currentPage?: number;
}

export default function Pagination({
  onPageChange,
  totalItems,
  itemsPerPage,
  currentPage = 1,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const {deviceType} = useView();
  const maxVisiblePages = deviceType === EDeviceView.MOBILE ? 3 : deviceType === EDeviceView.TABLET ? 5 : 10;

  // Compute visible page range
  
  const pages = useMemo(() => {
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    // Adjust start if we’re at the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  

  return (
    <div className="w-full mx-auto flex-wrap flex justify-center items-center gap-2 mt-6">
      {/* Prev button */}
      <button aria-label="button" type="button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className={`px-3 py-2 rounded-xl border transition-all ${ currentPage === 1 ? "text-gray-400 border-gray-200 cursor-not-allowed" : "hover:bg-gray-100 border-gray-300" }`}>
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* First page + dots */}
      {pages[0] > 1 && (
        <>
          <button type="button" onClick={() => onPageChange(1)} className="px-3 py-2  rounded-xl border border-gray-300 hover:bg-gray-100 transition-all" >
            1
          </button>
          {pages[0] > 2 && (
            <span className="px-2 text-gray-500 select-none">...</span>
          )}
        </>
      )}

      {/* Page numbers */}
      {pages.map((page) => (
        <button type="button" key={page} onClick={() => onPageChange(page)} className={`px-3 py-2 rounded-xl text-sm lg:text-base border transition-all ${ page === currentPage ? "bg-main-blue-600 text-white border-main-blue-600" : "hover:bg-gray-100 border-gray-300" }`} >
          {page}
        </button>
      ))}

      {/* Last page + dots */}
      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="px-2 text-gray-500 select-none">...</span>
          )}
          <button type="button" onClick={() => onPageChange(totalPages)} className="px-3 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition-all" >
            {totalPages}
          </button>
        </>
      )}

      {/* Next button */}
      <button aria-label="button" type="button" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`px-3 py-2 rounded-xl border transition-all ${ currentPage === totalPages ? "text-gray-400 border-gray-200 cursor-not-allowed" : "hover:bg-gray-100 border-gray-300"
      }`} >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
