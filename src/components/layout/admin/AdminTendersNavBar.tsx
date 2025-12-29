"use client";

import { FileTerminal, FileText, ListTree, TreeDeciduous } from "lucide-react";
import AdminPageNavBar from "./PageNavBar";

const links = [
     {name:"Tenders", href: "/admin/tenders", icon: FileText},
     {name:"Categories", href: "/admin/tenders/categories", icon: ListTree},
]

export default function AdminTendersNavBar () {
     return (
          <AdminPageNavBar links={links} />
     )
}