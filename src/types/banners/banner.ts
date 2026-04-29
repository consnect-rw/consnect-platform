import { Prisma } from "@prisma/client";

export const SBanner = {
     id:true, 
     title:true, 
     destinationUrl:true,
     imageUrl:true,
     expireAt:true,
     plan: {select: {id:true, name:true, orientation:true, location:true, price:true, currency:true, height:true, width:true, duration:true, durationUnit:true, isActive:true, pagePosition:true}},
     user: {select: {id:true, name:true}},
     company: {select: {id:true, name:true}},
     createdAt:true,
     updatedAt:true
} satisfies Prisma.BannerSelect;

export type TBanner = Prisma.BannerGetPayload<{select: typeof SBanner}>;