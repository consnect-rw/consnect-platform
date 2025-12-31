import { Prisma } from "@prisma/client";

export const SBlogUpdate = {
     id:true, title:true, description:true, detailedDescription:true, 
     featuredImageUrl:true, images:true, status:true, tags:true, 
     category:{select:{id:true, name:true}}

} satisfies Prisma.BlogSelect;
export type TBlogUpdate = Prisma.BlogGetPayload<{ select: typeof SBlogUpdate }>;

export const SAdminBlogCard = {
     id:true, title:true, createdAt:true, featuredImageUrl:true, status:true, images:true,
     viewCount:true, likeCount:true, commentCount:true, publishedAt:true, readingTime:true, description:true,
     category:{select:{name:true}}
} satisfies Prisma.BlogSelect;

export type TAdminBlogCard = Prisma.BlogGetPayload<{select:typeof SAdminBlogCard}>

export const SBlogCard = {
     id:true, title:true, createdAt:true, featuredImageUrl:true, status:true, images:true,
     viewCount:true, likeCount:true, commentCount:true, publishedAt:true, readingTime:true, description:true,
     category:{select:{name:true}}, tags:true,
} satisfies Prisma.BlogSelect;

export type TBlogCard = Prisma.BlogGetPayload<{select:typeof SBlogCard}>