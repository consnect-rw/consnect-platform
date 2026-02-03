"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createCompany(data: Prisma.CompanyCreateInput) {
     try{
          const res = await prisma.company.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating Company: ",error);
          return null;
     }
}

export async function updateCompany (id:string, data:Prisma.CompanyUpdateInput) {
     try {
          const res = await prisma.company.update({where: {id}, data});
          if(res) revalidatePages();
          return res; 
     } catch (error) {
          console.log(`Error updating Company with id: ${id}`, error);
          return null;
     }
}

export async function deleteCompany (id:string) {
     try {
          const res = await prisma.company.delete({where: {id}});
          
          const Company = await prisma.company.findUnique({where:{id}});

          if (!Company) throw new Error("Company not found");

          if(res) revalidatePages();
           
          return res;
     } catch (error) {
          console.log("Error deleting Company with id: ", id, error);
          return null;
     }
}

export const fetchCompanys = cache(async <T extends Prisma.CompanySelect>(
          selectType: T, search?: Prisma.CompanyWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.CompanyOrderByWithRelationInput | Prisma.CompanyOrderByWithRelationInput[]  = { createdAt: 'desc' }
     ):Promise<{data: Prisma.CompanyGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.company.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.company.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching Companys: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchCompanyById = cache(async <T extends Prisma.CompanySelect>(id:string, selectType: T): Promise<Prisma.CompanyGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.company.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Company data for id: ${id}`, error);
          return null;
     }
})

export const fetchCompanyByHandle = cache(async <T extends Prisma.CompanySelect>(handle:string, selectType: T): Promise<Prisma.CompanyGetPayload<{select:T}> | null> => {
     try {
          // First try: exact match with the provided handle
          let res = await prisma.company.findUnique({where:{handle},select: selectType});
          
          // Second try: case-insensitive search if exact match fails
          if (!res) {
               res = await prisma.company.findFirst({
                    where: {
                         handle: {
                              equals: handle,
                              mode: 'insensitive'
                         }
                    },
                    select: selectType
               });
          }
          
          return res;
     } catch (error) {
          console.log(`Error fetching Company data for handle: ${handle}`, error);
          return null;
     }
})