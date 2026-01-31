"use client";
import CompanyRequiredNotice from "@/components/containers/user/CompanyRequireNotice";
import SocialMediaForm from "@/components/forms/common/SocialMediaForm";
import { useAuth } from "@/hooks/useAuth"
import { fetchSocialMedias } from "@/server/common/social-media";
import { SSocialMedia } from "@/types/common/social-media";
import { useQuery } from "@tanstack/react-query";

export default function CompanySocialMediaPage () {
     const {user} = useAuth();
     const {data:socialMediaData,} = useQuery({
          queryKey:["company-social-media", user?.company?.id],
          queryFn: () => user?.company ? fetchSocialMedias(SSocialMedia, {company: {id: user.company.id}}) : null
     });
     const socialMedia = socialMediaData?.data ? socialMediaData.data[0] : null;

     if (!user?.company) {
               return (
                    <CompanyRequiredNotice message="Please first create your company to add social media links"/>
               );
          }
     return (
          <div className="w-full p-4 rounded-xl bg-gray-50">
               <SocialMediaForm onComplete={() => {}} socialMedia={socialMedia ?? undefined} companyId={user?.company.id}  />
          </div>
     )
}