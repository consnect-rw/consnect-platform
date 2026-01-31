"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createFounder(data: Prisma.FounderCreateInput) {
     try{
          const res = await prisma.founder.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating Founder: ",error);
          return null;
     }
}

export async function updateFounder (id:string, data:Prisma.FounderUpdateInput) {
     try {
          const res = await prisma.founder.update({where: {id}, data});
          if(res) revalidatePages();
          return res; 
     } catch (error) {
          console.log(`Error updating Founder with id: ${id}`, error);
          return null;
     }
}

export async function deleteFounder (id:string) {
     try {
          const res = await prisma.founder.delete({where: {id}});
          if(res) revalidatePages();
           
          return res;
     } catch (error) {
          console.log("Error deleting Founder with id: ", id, error);
          return null;
     }
}

export const fetchFounders = cache(async <T extends Prisma.FounderSelect>(
          selectType: T, search?: Prisma.FounderWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.FounderOrderByWithRelationInput | Prisma.FounderOrderByWithRelationInput[]  = { name: 'asc' }
     ):Promise<{data: Prisma.FounderGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.founder.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.founder.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching Founders: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchFounderById = cache(async <T extends Prisma.FounderSelect>(id:string, selectType: T): Promise<Prisma.FounderGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.founder.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Founder data for id: ${id}`, error);
          return null;
     }
})