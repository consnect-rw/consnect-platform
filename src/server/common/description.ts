"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createDescription(data: Prisma.DescriptionCreateInput) {
     try{
          const res = await prisma.description.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating Description: ",error);
          return null;
     }
}

export async function updateDescription (id:string, data:Prisma.DescriptionUpdateInput) {
     try {
          const res = await prisma.description.update({where: {id}, data});
          if(res) revalidatePages();
          return res; 
     } catch (error) {
          console.log(`Error updating Description with id: ${id}`, error);
          return null;
     }
}

export async function deleteDescription (id:string) {
     try {
          const res = await prisma.description.delete({where: {id}});
          
          const Description = await prisma.description.findUnique({where:{id}});

          if (!Description) throw new Error("Description not found");

          if(res) revalidatePages();
           
          return res;
     } catch (error) {
          console.log("Error deleting Description with id: ", id, error);
          return null;
     }
}

export const fetchDescriptions = cache(async <T extends Prisma.DescriptionSelect>(
          selectType: T, search?: Prisma.DescriptionWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.DescriptionOrderByWithRelationInput | Prisma.DescriptionOrderByWithRelationInput[]  = {description: "asc" }
     ):Promise<{data: Prisma.DescriptionGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.description.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.description.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching Descriptions: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchDescriptionById = cache(async <T extends Prisma.DescriptionSelect>(id:string, selectType: T): Promise<Prisma.DescriptionGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.description.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Description data for id: ${id}`, error);
          return null;
     }
})