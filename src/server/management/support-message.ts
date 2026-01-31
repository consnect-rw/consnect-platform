"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createSupportMessage(data: Prisma.SupportMessageCreateInput) {
     try{
          const res = await prisma.supportMessage.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating SupportMessage: ",error);
          return null;
     }
}

export async function updateSupportMessage (id:string, data:Prisma.SupportMessageUpdateInput) {
     try {
          const res = await prisma.supportMessage.update({where: {id}, data});
          if(res) revalidatePages();
          return res; 
     } catch (error) {
          console.log(`Error updating SupportMessage with id: ${id}`, error);
          return null;
     }
}

export async function deleteSupportMessage (id:string) {
     try {
          const res = await prisma.supportMessage.delete({where: {id}});
          if(res) revalidatePages();
           
          return res;
     } catch (error) {
          console.log("Error deleting SupportMessage with id: ", id, error);
          return null;
     }
}

export const fetchSupportMessages = cache(async <T extends Prisma.SupportMessageSelect>(
          selectType: T, search?: Prisma.SupportMessageWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.SupportMessageOrderByWithRelationInput | Prisma.SupportMessageOrderByWithRelationInput[]  = { name: 'asc' }
     ):Promise<{data: Prisma.SupportMessageGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.supportMessage.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.supportMessage.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching SupportMessages: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchSupportMessageById = cache(async <T extends Prisma.SupportMessageSelect>(id:string, selectType: T): Promise<Prisma.SupportMessageGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.supportMessage.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching SupportMessage data for id: ${id}`, error);
          return null;
     }
})