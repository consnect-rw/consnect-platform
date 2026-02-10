import AdminsView from "@/components/containers/admin/AdminsView";
import { requireAdminRoles } from "@/lib/guards/requireAuth";

export default async function AdminsPage() {
  requireAdminRoles(new Set(["ADMIN", "SUPER_ADMIN"]));
  return (
    <AdminsView />
  )
}