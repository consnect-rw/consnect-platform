// app/dashboard/reviews/page.tsx or wherever your page is
"use client";

import ReviewCard from "@/components/cards/ReviewCard";
import CompanyRequiredNotice from "@/components/containers/user/CompanyRequireNotice";
import Pagination from "@/components/ui/Pagination"; // Import the new card
import { useAuth } from "@/hooks/useAuth";
import { fetchReviews } from "@/server/company/review";
import { SReview } from "@/types/company/review";
import { useQuery } from "@tanstack/react-query";
import { Building2, Star } from "lucide-react";
import { useState } from "react";

export default function ReviewsPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const perPage = 20;

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ["company-reviews", user?.company?.id, page],
    queryFn: () =>
      user?.company
        ? fetchReviews(
            SReview,
            { company: { id: user.company.id } },
            perPage,
            (page - 1) * perPage
          )
        : null,
    enabled: !!user?.company,
  });

  const reviews = reviewsData?.data ?? [];
  const totalReviews = reviewsData?.pagination.total ?? 0;
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  if (!user?.company) {
    return (
      <CompanyRequiredNotice message="You need to complete your company profile to view your company reviews." />
    );
  }

  return (
    <div className="w-full min-h-full bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Building2 className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                Company Reviews
              </h1>
              <p className="text-gray-600 mt-1">
                See what customers are saying about your company
              </p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="flex flex-wrap items-center gap-8 mt-8">
            <div className="flex items-center gap-3">
              <div className="text-4xl font-bold text-gray-900">
                {totalReviews}
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Reviews</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-7 h-7 ${
                      i < Math.floor(averageRating)
                        ? "fill-yellow-500 text-yellow-500"
                        : i < averageRating
                        ? "fill-yellow-500/50 text-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </p>
                <p className="text-sm text-gray-500">Average Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Star className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">
              No reviews yet
            </h3>
            <p className="text-gray-500 mt-2">
              Reviews will appear here once customers rate your company.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalReviews > perPage && (
          <Pagination
            itemsPerPage={perPage}
            totalItems={totalReviews}
            currentPage={page}
            onPageChange={(p) => setPage(p)}
          />
        )}
      </div>
    </div>
  );
}