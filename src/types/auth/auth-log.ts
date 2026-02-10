import { Prisma } from "@prisma/client";

export const SAuthLog = {
     id:true, 
     user: {select: {id:true, name:true, email:true, role:true, adminRole:true}},
     ipAddress: true, 
     userAgent: true,
     action: true,
     success:true,
     createdAt:true
} satisfies Prisma.AuthLogSelect;

export type TAuthLog = Prisma.AuthLogGetPayload<{select: typeof SAuthLog}>;