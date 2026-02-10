import { getSessionUser } from "@/server/auth/user";
import { EAdminRole } from "@prisma/client";
import { redirect } from "next/navigation";

export async function requireAdminRoles(allowedRoles: Set<EAdminRole>) 
{
     const {user} = await getSessionUser();
     if(!user) return redirect("/auth/login");
     if(!allowedRoles.has(user.adminRole)) return redirect("/admin");
     return user;
} 