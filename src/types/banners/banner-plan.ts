import { Prisma } from "@prisma/client";

export const SBannerPlan = {
     id: true, 
     name:true, 
     description:true, 
     benefits:true, 
     price:true, 
     currency:true, 
     duration:true, 
     durationUnit:true,
     width:true, 
     height: true,
     isActive:true,
     location:true,
     orientation:true,
     pagePosition: true,
     _count: {select: {banners:true}}

} satisfies Prisma.BannerPlanSelect;
export type TBannerPlan = Prisma.BannerPlanGetPayload<{select: typeof SBannerPlan}>;
/** @deprecated use TBannerPlan */
export type TBannerPlanEdit = TBannerPlan;