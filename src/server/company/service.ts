"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createService(data: Prisma.ServiceCreateInput) {
     try{
          const res = await prisma.service.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating Service: ",error);
          return null;
     }
}

export async function updateService (id:string, data:Prisma.ServiceUpdateInput) {
     try {
          const res = await prisma.service.update({where: {id}, data});
          if(res) revalidatePages();
          return res; 
     } catch (error) {
          console.log(`Error updating Service with id: ${id}`, error);
          return null;
     }
}

export async function deleteService (id:string) {
     try {
          const res = await prisma.service.delete({where: {id}});
          
          const Service = await prisma.service.findUnique({where:{id}});

          if (!Service) throw new Error("Service not found");

          if(res) revalidatePages();
           
          return res;
     } catch (error) {
          console.log("Error deleting Service with id: ", id, error);
          return null;
     }
}

export const fetchServices = cache(async <T extends Prisma.ServiceSelect>(
          selectType: T, search?: Prisma.ServiceWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.ServiceOrderByWithRelationInput | Prisma.ServiceOrderByWithRelationInput[]  = { createdAt: 'desc' }
     ):Promise<{data: Prisma.ServiceGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.service.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.service.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching Services: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchServiceById = cache(async <T extends Prisma.ServiceSelect>(id:string, selectType: T): Promise<Prisma.ServiceGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.service.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Service data for id: ${id}`, error);
          return null;
     }
})