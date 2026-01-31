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
import { EAdminRole } from "@prisma/client";

export const AdminNavLinks: {
  name: string;
  icon: IconType;
  href: string;
  roles: EAdminRole[]
}[] = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard, roles: [EAdminRole.SUPER_ADMIN, EAdminRole.ADMIN, EAdminRole.MODERATOR, EAdminRole.CONTENT_MANAGER, EAdminRole.CUSTOMER_SUPPORT] },
  { name: "Offers", href: "/admin/offers", icon: BadgePercent, roles: [EAdminRole.SUPER_ADMIN, EAdminRole.ADMIN, EAdminRole.MODERATOR] },
  { name: "Tenders", href: "/admin/tenders", icon: FileText, roles: [EAdminRole.SUPER_ADMIN, EAdminRole.ADMIN, EAdminRole.MODERATOR] },
  { name: "Companies", href: "/admin/companies", icon: Building2, roles: [EAdminRole.SUPER_ADMIN, EAdminRole.ADMIN, EAdminRole.MODERATOR] },
  { name: "Users", href: "/admin/users", icon: Users, roles: [EAdminRole.SUPER_ADMIN, EAdminRole.ADMIN] },
  { name: "Blogs", href: "/admin/blogs", icon: FaBlog, roles: [EAdminRole.SUPER_ADMIN, EAdminRole.ADMIN, EAdminRole.CONTENT_MANAGER] },
  // { name: "Transactions", href: "/admin/transactions", icon: ListCheck },
  { name: "Support", href: "/admin/support", icon: MessageSquare, roles: [EAdminRole.SUPER_ADMIN, EAdminRole.ADMIN, EAdminRole.CUSTOMER_SUPPORT] },
  { name: "Chat", href: "/admin/chat", icon: MessageCircle, roles: [EAdminRole.SUPER_ADMIN, EAdminRole.ADMIN, EAdminRole.MODERATOR, EAdminRole.CONTENT_MANAGER, EAdminRole.CUSTOMER_SUPPORT] },
  { name: "Stats", href: "/admin/monitoring", icon: ChartAreaIcon, roles: [EAdminRole.SUPER_ADMIN, EAdminRole.ADMIN] },
];