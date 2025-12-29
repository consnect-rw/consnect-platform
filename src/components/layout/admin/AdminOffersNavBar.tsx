"use client";

import { FileText, ListTree } from "lucide-react";
import AdminPageNavBar from "./PageNavBar";

const links = [
     {name: "All Offers", href: "/admin/offers", icon: FileText},
]

export default function AdminOffersNavBar () {
     return(
          <AdminPageNavBar links={links} />
     )
}