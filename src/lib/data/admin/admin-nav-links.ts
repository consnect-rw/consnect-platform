import { IconType } from "react-icons/lib";

import {
  LayoutDashboard,
  BadgePercent,
  FileText,
  MessageSquare,
  Briefcase,
  Star,
  FolderKanban,
  Building2,
  Users,
  ListCheck,
  Cog,
  Logs,
  ChartAreaIcon,
  MessageCircle,
} from "lucide-react";
import { FaBlog } from "react-icons/fa6";

export const AdminNavLinks: {
  name: string;
  icon: IconType;
  href: string;
}[] = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Offers", href: "/admin/offers", icon: BadgePercent },
  { name: "Tenders", href: "/admin/tenders", icon: FileText },
  { name: "Companies", href: "/admin/companies", icon: Building2 },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Blogs", href: "/admin/blogs", icon: FaBlog },
  // { name: "Transactions", href: "/admin/transactions", icon: ListCheck },
  { name: "Support", href: "/admin/support", icon: MessageSquare },
  { name: "Chat", href: "/admin/chat", icon: MessageCircle },
  { name: "Stats", href: "/admin/monitoring", icon: ChartAreaIcon },
];