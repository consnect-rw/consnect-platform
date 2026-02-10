import { TAuthLog } from "@/types/auth/auth-log";
import { 
  LogIn, 
  LogOut, 
  KeyRound, 
  Shield, 
  ShieldOff, 
  Mail, 
  Lock, 
  LockOpen,
  CheckCircle,
  XCircle,
  User,
  Monitor,
  MapPin,
  Calendar
} from "lucide-react";
import { EAuthAction } from "@prisma/client";

interface AuthLogCardProps {
  log: TAuthLog;
}

const actionConfig = {
  LOGIN: { icon: LogIn, label: "Login", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  LOGOUT: { icon: LogOut, label: "Logout", color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200" },
  PASSWORD_CHANGE: { icon: KeyRound, label: "Password Change", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
  TWO_FACTOR_ENABLE: { icon: Shield, label: "2FA Enabled", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  TWO_FACTOR_DISABLE: { icon: ShieldOff, label: "2FA Disabled", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  EMAIL_VERIFICATION: { icon: Mail, label: "Email Verified", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  ACCOUNT_LOCK: { icon: Lock, label: "Account Locked", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  ACCOUNT_UNLOCK: { icon: LockOpen, label: "Account Unlocked", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
};

export function AuthLogCard({ log }: AuthLogCardProps) {
  const config = actionConfig[log.action as EAuthAction];
  const IconComponent = config?.icon || LogIn;

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-yellow-400 hover:shadow-lg transition-all">
      <div className="flex items-start gap-4">
        {/* Action Icon */}
        <div className={`w-12 h-12 ${config?.bg} rounded-xl flex items-center justify-center shrink-0 border-2 ${config?.border}`}>
          <IconComponent className={`w-6 h-6 ${config?.color}`} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header: Action & Status */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="text-lg font-black text-gray-900">
                {config?.label || log.action}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(log.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            
            {/* Success/Failure Badge */}
            {log.success ? (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border-2 border-emerald-200 rounded-full">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                  Success
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 border-2 border-red-200 rounded-full">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-xs font-bold text-red-700 uppercase tracking-wide">
                  Failed
                </span>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-bold text-gray-900">
              {log.user.name || "Unknown User"}
            </span>
            <span className="text-sm text-gray-500">
              ({log.user.email})
            </span>
          </div>

          {/* Role Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <div className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-700 uppercase">
              {log.user.role}
            </div>
            {log.user.adminRole !== "NONE" && (
              <div className="px-2 py-1 bg-yellow-100 rounded text-xs font-bold text-yellow-700 uppercase">
                {log.user.adminRole}
              </div>
            )}
          </div>

          {/* Network Info */}
          <div className="space-y-1.5 pt-3 border-t-2 border-gray-100">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <span className="text-xs text-gray-600 font-medium break-all">
                {log.ipAddress}
              </span>
            </div>
            {log.userAgent && (
              <div className="flex items-start gap-2">
                <Monitor className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <span className="text-xs text-gray-600 font-medium break-all line-clamp-2">
                  {log.userAgent}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
