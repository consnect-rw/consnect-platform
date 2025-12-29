"use client";

import CompanyRequiredNotice from "@/components/containers/user/CompanyRequireNotice";
import { useAuth } from "@/hooks/useAuth";
import { Building2 } from "lucide-react";

export default function OfferFormPage () {
     const {user} = useAuth();
     if (!user?.company) {
     return <CompanyRequiredNotice message="Please complete company profile to be able to view offers and send offer interests" />
     }
     return (
          <div className=""></div>
     )
}