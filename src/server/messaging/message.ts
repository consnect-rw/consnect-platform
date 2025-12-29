"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createMessage(data: Prisma.MessageCreateInput) {
     try{
          const res = await prisma.message.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating Message: ",error);
          return null;
     }
}

export async function updateMessage (id:string, data:Prisma.MessageUpdateInput) {
     try {
          const res = await prisma.message.update({where: {id}, data});
          if(res) revalidatePages();
          return res; 
     } catch (error) {
          console.log(`Error updating Message with id: ${id}`, error);
          return null;
     }
}

export async function deleteMessage (id:string) {
     try {
          const res = await prisma.message.delete({where: {id}});
          
          const Message = await prisma.message.findUnique({where:{id}});

          if (!Message) throw new Error("Message not found");

          if(res) revalidatePages();
           
          return res;
     } catch (error) {
          console.log("Error deleting Message with id: ", id, error);
          return null;
     }
}

export const fetchMessages = cache(async <T extends Prisma.MessageSelect>(
          selectType: T, search?: Prisma.MessageWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.MessageOrderByWithRelationInput | Prisma.MessageOrderByWithRelationInput[]  = { createdAt: 'desc' }
     ):Promise<{data: Prisma.MessageGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.message.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.message.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching Messages: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchMessageById = cache(async <T extends Prisma.MessageSelect>(id:string, selectType: T): Promise<Prisma.MessageGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.message.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Message data for id: ${id}`, error);
          return null;
     }
})