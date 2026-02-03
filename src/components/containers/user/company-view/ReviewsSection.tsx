"use client";

import { TAdminCompanyPage } from "@/types/company/company";
import { MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { CollapsibleSection } from "./CollapsibleSection";

export const ReviewsSection = ({ company }: { company: TAdminCompanyPage }) => {
  if (!company.reviews || company.reviews.length === 0) return null;

  return (
    <CollapsibleSection
      title="Customer Reviews"
      icon={<MessageSquare className="w-5 h-5 text-yellow-600" />}
      count={company.reviews.length}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {company.reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">
                {review.name}
              </h4>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-lg ${
                      star <= review.rating
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">{review.email}</p>
            {review.review && (
              <p className="text-sm text-gray-700 mt-3">
                {review.review}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-3">
              {format(new Date(review.createdAt), "PPP")}
            </p>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
};
