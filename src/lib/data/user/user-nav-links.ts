import { IconType } from "react-icons/lib";

import {
  LayoutDashboard,
  BadgePercent,
  FileText,
  MessageSquare,
  Briefcase,
  Star,
  FolderKanban,
  Cog,
} from "lucide-react";

export const UserNavLinks: {
  name: string;
  icon: IconType;
  href: string;
}[] = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Offers", href: "/dashboard/offers", icon: BadgePercent },
  { name: "Tenders", href: "/dashboard/tenders", icon: FileText },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Services", href: "/dashboard/services", icon: Briefcase },
  { name: "Reviews", href: "/dashboard/reviews", icon: Star },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Profile", href: "/dashboard/settings", icon: Cog },
];
