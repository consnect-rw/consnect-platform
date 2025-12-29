import { Prisma } from "@prisma/client";

export const SAdminLog = {
     id:true, type:true, actionByUserId:true, actionOnUserId:true, 
     userIp:true, userAgent:true, resourceType:true, resourceId:true, changes:true, 
     description:true, success:true, module:true, createdAt:true
} satisfies Prisma.LogSelect;
export type TAdminLog = Prisma.LogGetPayload<{select: typeof SAdminLog}>