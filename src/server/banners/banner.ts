"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createBanner(data: Prisma.BannerCreateInput) {
     try{
          const res = await prisma.banner.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating Banner: ",error);
          return null;
     }
}

export async function updateBanner (id:string, data:Prisma.BannerUpdateInput) {
     try {
          const res = await prisma.banner.update({where: {id}, data});
          if(res) revalidatePages();
          return res; 
     } catch (error) {
          console.log(`Error updating Banner with id: ${id}`, error);
          return null;
     }
}

export async function deleteBanner (id:string) {
     try {
          const res = await prisma.banner.delete({where: {id}});
          
          const Banner = await prisma.banner.findUnique({where:{id}});

          if (!Banner) throw new Error("Banner not found");

          if(res) revalidatePages();
           
          return res;
     } catch (error) {
          console.log("Error deleting Banner with id: ", id, error);
          return null;
     }
}

export const fetchBanners = cache(async <T extends Prisma.BannerSelect>(
          selectType: T, search?: Prisma.BannerWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.BannerOrderByWithRelationInput | Prisma.BannerOrderByWithRelationInput[]  = { createdAt: 'desc' }
     ):Promise<{data: Prisma.BannerGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.banner.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.banner.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching Banners: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchBannerById = cache(async <T extends Prisma.BannerSelect>(id:string, selectType: T): Promise<Prisma.BannerGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.banner.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Banner data for id: ${id}`, error);
          return null;
     }
})