"use client";

import { FileText, ListTree, Plus } from "lucide-react";
import AdminPageNavBar from "./PageNavBar";

const links = [
     {name: "All Blogs", href: "/admin/blogs", icon: FileText},
     {name: "Blog", href: "/admin/blogs/form", icon: Plus},
     {name: "Blog Categories", href: "/admin/blogs/categories", icon: ListTree},
]

export default function AdminBlogsNavBar () {
     return(
          <AdminPageNavBar links={links} />
     )
}