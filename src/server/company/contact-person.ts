"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createContactPerson(data: Prisma.ContactPersonCreateInput) {
     try{
          const res = await prisma.contactPerson.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating ContactPerson: ",error);
          return null;
     }
}

export async function updateContactPerson (id:string, data:Prisma.ContactPersonUpdateInput) {
     try {
          const res = await prisma.contactPerson.update({where: {id}, data});
          if(res) revalidatePages();
          return res; 
     } catch (error) {
          console.log(`Error updating ContactPerson with id: ${id}`, error);
          return null;
     }
}

export async function deleteContactPerson (id:string) {
     try {
          const res = await prisma.contactPerson.delete({where: {id}});
          if(res) revalidatePages();
           
          return res;
     } catch (error) {
          console.log("Error deleting ContactPerson with id: ", id, error);
          return null;
     }
}

export const fetchContactPersons = cache(async <T extends Prisma.ContactPersonSelect>(
          selectType: T, search?: Prisma.ContactPersonWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.ContactPersonOrderByWithRelationInput | Prisma.ContactPersonOrderByWithRelationInput[]  = { name: 'asc' }
     ):Promise<{data: Prisma.ContactPersonGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.contactPerson.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.contactPerson.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching ContactPersons: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchContactPersonById = cache(async <T extends Prisma.ContactPersonSelect>(id:string, selectType: T): Promise<Prisma.ContactPersonGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.contactPerson.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching ContactPerson data for id: ${id}`, error);
          return null;
     }
})