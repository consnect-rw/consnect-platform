"use client";

import { Briefcase, Building2, ListTree,} from "lucide-react";
import AdminPageNavBar from "./PageNavBar";

const links = [
     {name: "Companies", href: "/admin/companies",icon: Building2},
     {name: "Service Categories", href: "/admin/companies/service-categories", icon: ListTree},
     {name: "Specializations", href: "/admin/companies/specializations", icon: Briefcase},
]
export default function AdminCompanyNavBar () {
     return (
          <AdminPageNavBar links={links} />
     )
}