import { Prisma } from "@prisma/client";

export const SSupportMessage = {
     id:true, name:true, email:true, phone:true, subject:true, message:true, images:true, isRead:true, createdAt:true
} satisfies Prisma.SupportMessageSelect;
export type TSupportMessage = Prisma.SupportMessageGetPayload<{select: typeof SSupportMessage}>;