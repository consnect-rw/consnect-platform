import { Prisma } from "@prisma/client";

export const SComment = {
     id:true, content:true, createdAt:true, user:{select:{id:true, name:true, image:true}}
} satisfies Prisma.CommentSelect;
export type TComment = Prisma.CommentGetPayload<{select: typeof SComment}>