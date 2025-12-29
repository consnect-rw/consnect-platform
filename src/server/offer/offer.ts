"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createOffer(data: Prisma.OfferCreateInput) {
     try{
          const res = await prisma.offer.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating Offer: ",error);
          return null;
     }
}

export async function updateOffer (id:string, data:Prisma.OfferUpdateInput) {
     try {
          const res = await prisma.offer.update({where: {id}, data});
          if(res) revalidatePages();
          return res; 
     } catch (error) {
          console.log(`Error updating Offer with id: ${id}`, error);
          return null;
     }
}

export async function deleteOffer (id:string) {
     try {
          const res = await prisma.offer.delete({where: {id}});
          
          const Offer = await prisma.offer.findUnique({where:{id}});

          if (!Offer) throw new Error("Offer not found");

          if(res) revalidatePages();
           
          return res;
     } catch (error) {
          console.log("Error deleting Offer with id: ", id, error);
          return null;
     }
}

export const fetchOffers = cache(async <T extends Prisma.OfferSelect>(
          selectType: T, search?: Prisma.OfferWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.OfferOrderByWithRelationInput | Prisma.OfferOrderByWithRelationInput[]  = { createdAt: 'desc' }
     ):Promise<{data: Prisma.OfferGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.offer.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.offer.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching Offers: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchOfferById = cache(async <T extends Prisma.OfferSelect>(id:string, selectType: T): Promise<Prisma.OfferGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.offer.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Offer data for id: ${id}`, error);
          return null;
     }
})