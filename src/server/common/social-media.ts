"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createSocialMedia(data: Prisma.SocialMediaCreateInput) {
     try{
          const res = await prisma.socialMedia.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating SocialMedia: ",error);
          return null;
     }
}

export async function updateSocialMedia (id:string, data:Prisma.SocialMediaUpdateInput) {
     try {
          const res = await prisma.socialMedia.update({where: {id}, data});
          if(res) revalidatePages();
          return res; 
     } catch (error) {
          console.log(`Error updating SocialMedia with id: ${id}`, error);
          return null;
     }
}

export async function deleteSocialMedia (id:string) {
     try {
          const res = await prisma.socialMedia.delete({where: {id}});
          
          const SocialMedia = await prisma.socialMedia.findUnique({where:{id}});

          if (!SocialMedia) throw new Error("SocialMedia not found");

          if(res) revalidatePages();
           
          return res;
     } catch (error) {
          console.log("Error deleting SocialMedia with id: ", id, error);
          return null;
     }
}

export const fetchSocialMedias = cache(async <T extends Prisma.SocialMediaSelect>(
          selectType: T, search?: Prisma.SocialMediaWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.SocialMediaOrderByWithRelationInput | Prisma.SocialMediaOrderByWithRelationInput[]  = {}
     ):Promise<{data: Prisma.SocialMediaGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.socialMedia.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.socialMedia.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching SocialMedias: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchSocialMediaById = cache(async <T extends Prisma.SocialMediaSelect>(id:string, selectType: T): Promise<Prisma.SocialMediaGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.socialMedia.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching SocialMedia data for id: ${id}`, error);
          return null;
     }
})