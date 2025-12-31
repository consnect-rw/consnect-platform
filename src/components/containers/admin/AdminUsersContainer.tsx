"use client";

import { useState } from "react";
import { TAdminUserRow } from "@/types/auth/user";
import { 
  User, 
  Building2, 
  Mail, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Edit, 
  UserX,
  Calendar,
  Loader2,
  BadgeCheck,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import queryClient from "@/lib/queryClient";
import { updateUser } from "@/server/auth/user";
import { UserFormToggleBtn } from "@/components/forms/auth/UserForm";

const VerificationBadge = ({ status }: { status: string }) => {
  const config = {
    VERIFIED: {
      color: "bg-green-100 text-green-700 border-green-200",
      icon: <BadgeCheck className="w-3 h-3" />,
      label: "Verified"
    },
    PENDING: {
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      icon: <AlertCircle className="w-3 h-3" />,
      label: "Pending"
    },
    REJECTED: {
      color: "bg-red-100 text-red-700 border-red-200",
      icon: <XCircle className="w-3 h-3" />,
      label: "Rejected"
    }
  };

  const statusConfig = config[status as keyof typeof config] || config.PENDING;

  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border", statusConfig.color)}>
      {statusConfig.icon}
      {statusConfig.label}
    </span>
  );
};

const UserRow = ({ user }: { user: TAdminUserRow }) => {
  const [deactivating, setDeactivating] = useState(false);

  const handleDeactivate = async () => {
    if (!confirm(`Are you sure you want to ${user.active ? 'deactivate' : 'activate'} this user?`)) {
      return;
    }

    setDeactivating(true);
    try {
      const res = await updateUser(user.id, {
          active: !user.active
      });
      if(!res) return toast.error("Error updating user status");
      queryClient.invalidateQueries();
      toast.success(`User ${user.active ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user status");
    } finally {
      setDeactivating(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* User Info Section */}
        <div className="flex-1 space-y-3">
          {/* Name and Status Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{user.name || 'No Name'}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{user.email}</span>
                </div>
              </div>
            </div>

            {/* Active Status */}
            <div>
              {user.active ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  <CheckCircle className="w-3 h-3" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                  <XCircle className="w-3 h-3" />
                  Inactive
                </span>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-gray-100">
            {/* Company Info */}
            {user.company && (
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Building2 className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">Company</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{user.company.name}</p>
                </div>
              </div>
            )}

            {/* Email Verification */}
            <div className="flex items-center gap-2">
              <div className={cn("p-2 rounded-lg", user.isEmailVerified ? "bg-green-100" : "bg-yellow-100")}>
                <Mail className={cn("w-4 h-4", user.isEmailVerified ? "text-green-600" : "text-yellow-600")} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">
                  {user.isEmailVerified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
            </div>

            {/* 2FA Status */}
            <div className="flex items-center gap-2">
              <div className={cn("p-2 rounded-lg", user.isTwoFactorEnabled ? "bg-blue-100" : "bg-gray-100")}>
                <Shield className={cn("w-4 h-4", user.isTwoFactorEnabled ? "text-blue-600" : "text-gray-600")} />
              </div>
              <div>
                <p className="text-xs text-gray-500">2FA</p>
                <p className="text-sm font-medium text-gray-900">
                  {user.isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>

            {/* Company Verification */}
            {user.company?.verification && (
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BadgeCheck className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Company Status</p>
                  <VerificationBadge status={user.company.verification.status} />
                </div>
              </div>
            )}

            {/* Join Date */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Calendar className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Joined</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex lg:flex-col gap-2 lg:ml-4">
          {/* <Link
            href={`/admin/users/${user.id}`}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">View</span>
          </Link> */}
            <UserFormToggleBtn title="Edit User Info" role={"USER"} icon={<Edit className="w-4 h-4" />} name="Edit" className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md"  />

          <button
            onClick={handleDeactivate}
            disabled={deactivating}
            className={cn(
              "flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 font-medium rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed",
              user.active
                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            )}
          >
            {deactivating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UserX className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {deactivating ? 'Processing...' : user.active ? 'Deactivate' : 'Activate'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminUsersContainer = ({ users }: { users: TAdminUserRow[] }) => {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <User className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Users Found</h3>
        <p className="text-gray-600 text-center max-w-md">
          There are no users matching your criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserRow key={user.id} user={user} />
      ))}
    </div>
  );
};