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
  Edit, 
  UserX,
  Calendar,
  Loader2,
  BadgeCheck,
  AlertCircle,
  Phone,
  Copy
} from "lucide-react";
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
      const res = await updateUser(user.id, { active: !user.active });
      if (!res) return toast.error("Error updating user status");
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
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-all duration-200">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* User Info Section */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Name and Status Row */}
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-11 h-11 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-base">
              {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-gray-900 text-base leading-tight">{user.name || 'No Name'}</h3>
                {user.active ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold shrink-0">
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold shrink-0">
                    <XCircle className="w-3 h-3" />
                    Inactive
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => { navigator.clipboard.writeText(user.email); toast.success("Email copied!"); }}
                className="flex items-center gap-1.5 mt-1 group max-w-full"
                title="Click to copy email"
              >
                <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-600 group-hover:text-amber-600 transition-colors truncate">{user.email}</span>
                <Copy className="w-3 h-3 text-gray-300 group-hover:text-amber-500 shrink-0 transition-colors" />
              </button>
              {user.phone && (
                <button
                  type="button"
                  onClick={() => { navigator.clipboard.writeText(user.phone!); toast.success("Phone copied!"); }}
                  className="flex items-center gap-1.5 mt-0.5 group max-w-full"
                  title="Click to copy phone"
                >
                  <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-600 group-hover:text-amber-600 transition-colors truncate">{user.phone}</span>
                  <Copy className="w-3 h-3 text-gray-300 group-hover:text-amber-500 shrink-0 transition-colors" />
                </button>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 pt-3 border-t border-gray-100">
            {/* Company Info */}
            {user.company && (
              <div className="flex items-center gap-2 min-w-0">
                <div className="shrink-0 p-1.5 bg-gray-100 rounded-lg">
                  <Building2 className="w-3.5 h-3.5 text-gray-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Company</p>
                  <p className="text-xs font-medium text-gray-900 truncate">{user.company.name}</p>
                </div>
              </div>
            )}

            {/* Email Verification */}
            <div className="flex items-center gap-2 min-w-0">
              <div className={cn("shrink-0 p-1.5 rounded-lg", user.isEmailVerified ? "bg-green-100" : "bg-yellow-100")}>
                <Mail className={cn("w-3.5 h-3.5", user.isEmailVerified ? "text-green-600" : "text-yellow-600")} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-xs font-medium text-gray-900 truncate">
                  {user.isEmailVerified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
            </div>

            {/* 2FA Status */}
            <div className="flex items-center gap-2 min-w-0">
              <div className={cn("shrink-0 p-1.5 rounded-lg", user.isTwoFactorEnabled ? "bg-blue-100" : "bg-gray-100")}>
                <Shield className={cn("w-3.5 h-3.5", user.isTwoFactorEnabled ? "text-blue-600" : "text-gray-600")} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">2FA</p>
                <p className="text-xs font-medium text-gray-900 truncate">
                  {user.isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>

            {/* Company Verification */}
            {user.company?.verification && (
              <div className="flex items-center gap-2 min-w-0">
                <div className="shrink-0 p-1.5 bg-purple-100 rounded-lg">
                  <BadgeCheck className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Company</p>
                  <VerificationBadge status={user.company.verification.status} />
                </div>
              </div>
            )}

            {/* Join Date */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="shrink-0 p-1.5 bg-gray-100 rounded-lg">
                <Calendar className="w-3.5 h-3.5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Joined</p>
                <p className="text-xs font-medium text-gray-900 truncate">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row lg:flex-col gap-2 lg:ml-4 lg:shrink-0">
          <UserFormToggleBtn
            title="Edit User Info"
            entityId={user.id}
            role={"USER"}
            icon={<Edit className="w-4 h-4" />}
            name="Edit"
            className="flex-1 lg:w-28 flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md text-sm"
          />
          <button
            onClick={handleDeactivate}
            disabled={deactivating}
            className={cn(
              "flex-1 lg:w-28 flex items-center justify-center gap-2 px-4 py-2.5 font-medium rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm",
              user.active
                ? "bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                : "bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            )}
          >
            {deactivating ? (
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            ) : (
              <UserX className="w-4 h-4 shrink-0" />
            )}
            <span>{deactivating ? 'Processing...' : user.active ? 'Deactivate' : 'Activate'}</span>
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