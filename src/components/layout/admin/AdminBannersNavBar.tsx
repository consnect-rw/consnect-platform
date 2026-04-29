"use client";

import { Megaphone, LayoutTemplate } from "lucide-react";
import AdminPageNavBar from "./PageNavBar";

const links = [
  { name: "Banners", href: "/admin/banners", icon: Megaphone },
  { name: "Plans", href: "/admin/banners/plans", icon: LayoutTemplate },
];

export default function AdminBannersNavBar() {
  return <AdminPageNavBar links={links} />;
}
