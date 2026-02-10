import AuthLogsContainer from "@/components/containers/admin/AuthLogsContainer";
import { requireAdminRoles } from "@/lib/guards/requireAuth";

export default async function AuthLogsPage() {
     requireAdminRoles(new Set(["ADMIN", "SUPER_ADMIN"]));
     return (
          <AuthLogsContainer />
     );
}