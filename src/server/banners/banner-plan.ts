"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createBannerPlan(data: Prisma.BannerPlanCreateInput) {
     try{
          const res = await prisma.bannerPlan.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating BannerPlan: ",error);
          return null;
     }
}

export async function updateBannerPlan (id:string, data:Prisma.BannerPlanUpdateInput) {
     try {
          const res = await prisma.bannerPlan.update({where: {id}, data});
          if(res) revalidatePages();
          return res; 
     } catch (error) {
          console.log(`Error updating BannerPlan with id: ${id}`, error);
          return null;
     }
}

export async function deleteBannerPlan (id:string) {
     try {
          const BannerPlan = await prisma.bannerPlan.findUnique({where:{id}});

          if (!BannerPlan) throw new Error("BannerPlan not found");
          const res = await prisma.bannerPlan.delete({where: {id}});

          if(res) revalidatePages();
           
          return res;
     } catch (error) {
          console.log("Error deleting BannerPlan with id: ", id, error);
          return null;
     }
}

export const fetchBannerPlans = cache(async <T extends Prisma.BannerPlanSelect>(
          selectType: T, search?: Prisma.BannerPlanWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.BannerPlanOrderByWithRelationInput | Prisma.BannerPlanOrderByWithRelationInput[]  = { name: 'asc' }
     ):Promise<{data: Prisma.BannerPlanGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.bannerPlan.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.bannerPlan.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching BannerPlans: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchBannerPlanById = cache(async <T extends Prisma.BannerPlanSelect>(id:string, selectType: T): Promise<Prisma.BannerPlanGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.bannerPlan.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching BannerPlan data for id: ${id}`, error);
          return null;
     }
})