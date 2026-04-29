import AdminBannersNavBar from "@/components/layout/admin/AdminBannersNavBar";
import { ReactNode } from "react";

export default function AdminBannersLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex flex-col gap-8">
      <AdminBannersNavBar />
      {children}
    </div>
  );
}
