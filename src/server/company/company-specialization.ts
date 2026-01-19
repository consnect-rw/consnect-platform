"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createCompanySpecialization(data: Prisma.CompanySpecializationCreateInput) {
     try{
          const res = await prisma.companySpecialization.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating CompanySpecialization: ",error);
          return null;
     }
}

export async function updateCompanySpecialization (id:string, data:Prisma.CompanySpecializationUpdateInput) {
     try {
          const res = await prisma.companySpecialization.update({where: {id}, data});
          if(res) revalidatePages();
          return res; 
     } catch (error) {
          console.log(`Error updating CompanySpecialization with id: ${id}`, error);
          return null;
     }
}

export async function deleteCompanySpecialization (id:string) {
     try {
          const res = await prisma.companySpecialization.delete({where: {id}});
          if(res) revalidatePages();
           
          return res;
     } catch (error) {
          console.log("Error deleting CompanySpecialization with id: ", id, error);
          return null;
     }
}

export const fetchCompanySpecializations = cache(async <T extends Prisma.CompanySpecializationSelect>(
          selectType: T, search?: Prisma.CompanySpecializationWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.CompanySpecializationOrderByWithRelationInput | Prisma.CompanySpecializationOrderByWithRelationInput[]  = { name: 'asc' }
     ):Promise<{data: Prisma.CompanySpecializationGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.companySpecialization.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.companySpecialization.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching CompanySpecializations: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchCompanySpecializationById = cache(async <T extends Prisma.CompanySpecializationSelect>(id:string, selectType: T): Promise<Prisma.CompanySpecializationGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.companySpecialization.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching CompanySpecialization data for id: ${id}`, error);
          return null;
     }
})