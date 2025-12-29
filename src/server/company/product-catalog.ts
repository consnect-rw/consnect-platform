"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createProductCatalog(data: Prisma.ProductCatalogCreateInput) {
     try{
          const res = await prisma.productCatalog.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating ProductCatalog: ",error);
          return null;
     }
}

export async function updateProductCatalog (id:string, data:Prisma.ProductCatalogUpdateInput) {
     try {
          const res = await prisma.productCatalog.update({where: {id}, data});
          if(res) revalidatePages();
          return res; 
     } catch (error) {
          console.log(`Error updating ProductCatalog with id: ${id}`, error);
          return null;
     }
}

export async function deleteProductCatalog (id:string) {
     try {
          const res = await prisma.productCatalog.delete({where: {id}});
          
          const ProductCatalog = await prisma.productCatalog.findUnique({where:{id}});

          if (!ProductCatalog) throw new Error("ProductCatalog not found");

          if(res) revalidatePages();
           
          return res;
     } catch (error) {
          console.log("Error deleting ProductCatalog with id: ", id, error);
          return null;
     }
}

export const fetchProductCatalogs = cache(async <T extends Prisma.ProductCatalogSelect>(
          selectType: T, search?: Prisma.ProductCatalogWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.ProductCatalogOrderByWithRelationInput | Prisma.ProductCatalogOrderByWithRelationInput[]  = { name: 'asc' }
     ):Promise<{data: Prisma.ProductCatalogGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.productCatalog.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.productCatalog.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching ProductCatalogs: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchProductCatalogById = cache(async <T extends Prisma.ProductCatalogSelect>(id:string, selectType: T): Promise<Prisma.ProductCatalogGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.productCatalog.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching ProductCatalog data for id: ${id}`, error);
          return null;
     }
})