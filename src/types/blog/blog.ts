import { Prisma } from "@prisma/client";

export const SBlogUpdate = {
     id:true, title:true, description:true, detailedDescription:true, 
     featuredImageUrl:true, images:true, status:true, tags:true, 
     category:{select:{id:true, name:true}}

} satisfies Prisma.BlogSelect;
export type TBlogUpdate = Prisma.BlogGetPayload<{ select: typeof SBlogUpdate }>;

export const SAdminBlogCard = {
     id:true, title:true, createdAt:true, featuredImageUrl:true, status:true, images:true,
     publishedAt:true, readingTime:true, description:true,
     _count:{select:{comments:true, views:true, likes:true,}},
     category:{select:{name:true}}
} satisfies Prisma.BlogSelect;

export type TAdminBlogCard = Prisma.BlogGetPayload<{select:typeof SAdminBlogCard}>

export const SBlogCard = {
     id:true, title:true, createdAt:true, featuredImageUrl:true, status:true, images:true,
      publishedAt:true, readingTime:true, description:true,
     category:{select:{name:true}}, tags:true,
     _count: {select: {views:true, comments:true, likes:true}}
} satisfies Prisma.BlogSelect;

export type TBlogCard = Prisma.BlogGetPayload<{select:typeof SBlogCard}>

export const SBlogPage = {
     id:true, title:true, description:true, detailedDescription:true, 
     featuredImageUrl:true, images:true, tags: true,
     publishedAt:true, createdAt: true,
     category:{select: {name:true, id:true}},
     author:{select:{name:true, image:true}},
     _count:{select:{comments:true, views:true, likes:true,}},
     likes: {select:{user:{select:{id:true}}}},
     views: {select:{user:{select:{id:true}}}},
} satisfies Prisma.BlogSelect;
export type TBlogPage = Prisma.BlogGetPayload<{select: typeof SBlogPage}>