"use client";

import { MainForm } from "../MainForm";
import { TextInputGroup, TextAreaInputGroup } from "../InputGroups";
import { toast } from "sonner";
import queryClient from "@/lib/queryClient";
import { createReview } from "@/server/company/review";
import { useState } from "react";
import { Star } from "lucide-react";

export const ReviewForm = ({ companyId, onComplete }: { companyId: string; onComplete?: () => void }) => {
     const [rating, setRating] = useState<number>(0);
     const [hoveredRating, setHoveredRating] = useState<number>(0);

     const submitData = async (data: FormData) => {
          const name = data.get("name") as string;
          const email = data.get("email") as string;
          const phone = data.get("phone") as string;
          const review = data.get("review") as string;

          if (!rating || rating === 0) {
               return toast.error("Please select a rating");
          }

          const newReview = await createReview({
               name,
               email,
               phone,
               review,
               rating,
               company: { connect: { id: companyId } },
          });

          if (!newReview) return toast.error("Error submitting review");
          
          queryClient.invalidateQueries();
          toast.success("Review submitted successfully! Thank you for your feedback.");
          
          if (onComplete) onComplete();
     };

     return (
          <MainForm submitData={submitData} btnTitle="Submit Review">
               <TextInputGroup
                    name="name"
                    label="Your Name"
                    placeholder="Enter your full name"
                    required={true}
               />
               <TextInputGroup
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="your.email@example.com"
                    required={true}
               />
               <TextInputGroup
                    name="phone"
                    label="Phone Number"
                    placeholder="07XXXXXXXX"
                    required={true}
               />

               {/* Star Rating */}
               <div className="w-full flex flex-col items-start gap-2">
                    <label className="text-base font-medium text-gray-800">
                         Rating <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                         {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                   key={star}
                                   type="button"
                                   onClick={() => setRating(star)}
                                   onMouseEnter={() => setHoveredRating(star)}
                                   onMouseLeave={() => setHoveredRating(0)}
                                   className="w-12 h-12 rounded-lg bg-gray-100 border-2 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 transition-all flex items-center justify-center group"
                              >
                                   <Star
                                        className={`w-7 h-7 transition-all ${
                                             star <= (hoveredRating || rating)
                                                  ? "text-yellow-400 fill-yellow-400"
                                                  : "text-gray-300"
                                        }`}
                                   />
                              </button>
                         ))}
                    </div>
                    {rating > 0 && (
                         <p className="text-sm text-gray-600">
                              You rated: {rating} {rating === 1 ? "star" : "stars"}
                         </p>
                    )}
               </div>

               <TextAreaInputGroup
                    name="review"
                    label="Your Review"
                    placeholder="Share your experience with this company..."
                    maxWords={500}
                    required={true}
               />
          </MainForm>
     );
};
