import { Prisma } from "@prisma/client";

export const SMessage = {
     id:true, message:true, status:true, files: true,
     createdAt:true, updatedAt:true, 
     repliedMessage:{select: {id:true, message:true}},

} satisfies Prisma.MessageSelect;
export type TMessage = Prisma.MessageGetPayload<{select: typeof SMessage}>


export const SConversationMessage = {
     id:true, message:true, status:true, files:true,
     createdAt:true, updatedAt:true, 
     repliedMessage:{select: {id:true, message:true}},
     sender:{select:{name:true, role:true,id:true, company:{select:{name:true, id:true}}}},
} satisfies Prisma.MessageSelect;
export type TConversationMessage = Prisma.MessageGetPayload<{select: typeof SConversationMessage}>