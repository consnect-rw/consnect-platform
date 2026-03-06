"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createOfferDocument(data: Prisma.OfferDocumentCreateInput) {
     try{
          const res = await prisma.offerDocument.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating OfferDocument: ",error);
          return null;
     }
}

export async function updateOfferDocument (id:string, data:Prisma.OfferDocumentUpdateInput) {
     try {
          const res = await prisma.offerDocument.update({where: {id}, data});
          if(res) revalidatePages();
          return res; 
     } catch (error) {
          console.log(`Error updating OfferDocument with id: ${id}`, error);
          return null;
     }
}

export async function deleteOfferDocument (id:string) {
     try {
          const res = await prisma.offerDocument.delete({where: {id}});
          if(res) revalidatePages();
          return res;
     } catch (error) {
          console.log("Error deleting OfferDocument with id: ", id, error);
          return null;
     }
}

export const fetchOfferDocuments = cache(async <T extends Prisma.OfferDocumentSelect>(
          selectType: T, search?: Prisma.OfferDocumentWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.OfferDocumentOrderByWithRelationInput | Prisma.OfferDocumentOrderByWithRelationInput[]  = { uploadedAt: 'desc' }
     ):Promise<{data: Prisma.OfferDocumentGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.offerDocument.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.offerDocument.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching OfferDocuments: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchOfferDocumentById = cache(async <T extends Prisma.OfferDocumentSelect>(id:string, selectType: T): Promise<Prisma.OfferDocumentGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.offerDocument.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching OfferDocument data for id: ${id}`, error);
          return null;
     }
})