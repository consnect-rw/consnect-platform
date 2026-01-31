"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createCategory(data: Prisma.CategoryCreateInput) {
     try{
          const res = await prisma.category.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating Category: ",error);
          return null;
     }
}

export async function updateCategory (id:string, data:Prisma.CategoryUpdateInput) {
     try {
          const res = await prisma.category.update({where: {id}, data});
          if(res) revalidatePages();
          return res; 
     } catch (error) {
          console.log(`Error updating Category with id: ${id}`, error);
          return null;
     }
}

export async function deleteCategory (id:string) {
     try {
          const res = await prisma.category.delete({where: {id}});
          if(res) revalidatePages();
           
          return res;
     } catch (error) {
          console.log("Error deleting Category with id: ", id, error);
          return null;
     }
}

export const fetchCategorys = cache(async <T extends Prisma.CategorySelect>(
          selectType: T, search?: Prisma.CategoryWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.CategoryOrderByWithRelationInput | Prisma.CategoryOrderByWithRelationInput[]  = { name: 'asc' }
     ):Promise<{data: Prisma.CategoryGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.category.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.category.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching Categorys: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchCategoryById = cache(async <T extends Prisma.CategorySelect>(id:string, selectType: T): Promise<Prisma.CategoryGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.category.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Category data for id: ${id}`, error);
          return null;
     }
})