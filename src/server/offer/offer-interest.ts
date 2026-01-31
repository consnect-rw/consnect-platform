"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createOfferInterest(data: Prisma.OfferInterestCreateInput) {
     try{
          const res = await prisma.offerInterest.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating OfferInterest: ",error);
          return null;
     }
}

export async function updateOfferInterest (id:string, data:Prisma.OfferInterestUpdateInput) {
     try {
          const res = await prisma.offerInterest.update({where: {id}, data});
          if(res) revalidatePages();
          return res; 
     } catch (error) {
          console.log(`Error updating OfferInterest with id: ${id}`, error);
          return null;
     }
}

export async function deleteOfferInterest (id:string) {
     try {
          const res = await prisma.offerInterest.delete({where: {id}});
          
          const OfferInterest = await prisma.offerInterest.findUnique({where:{id}});

          if (!OfferInterest) throw new Error("OfferInterest not found");

          if(res) revalidatePages();
           
          return res;
     } catch (error) {
          console.log("Error deleting OfferInterest with id: ", id, error);
          return null;
     }
}

export const fetchOfferInterests = cache(async <T extends Prisma.OfferInterestSelect>(
          selectType: T, search?: Prisma.OfferInterestWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.OfferInterestOrderByWithRelationInput | Prisma.OfferInterestOrderByWithRelationInput[]  = { createdAt: 'desc' }
     ):Promise<{data: Prisma.OfferInterestGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.offerInterest.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.offerInterest.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching OfferInterests: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchOfferInterestById = cache(async <T extends Prisma.OfferInterestSelect>(id:string, selectType: T): Promise<Prisma.OfferInterestGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.offerInterest.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching OfferInterest data for id: ${id}`, error);
          return null;
     }
})