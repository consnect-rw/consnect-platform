"use client";

import CompanyRequiredNotice from "@/components/containers/user/CompanyRequireNotice";
import { OfferForm } from "@/components/forms/offer/OfferForm";
import { useAuth } from "@/hooks/useAuth";
import { Building2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OfferFormPage () {
     const router = useRouter();
     const searchParams = useSearchParams();
     const offerId = searchParams.get("id") || undefined;
     const {user} = useAuth();
     if (!user?.company) {
     return <CompanyRequiredNotice message="Please complete company profile to be able to view offers and send offer interests" />
     }
     const handleFormComplete = () => {
          router.push("/dashboard/offers");
     }
     return (
          <OfferForm companyId={user.company.id} onComplete={handleFormComplete} offerId={offerId} />
          
     )
}