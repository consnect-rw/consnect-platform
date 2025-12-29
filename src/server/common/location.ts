"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createLocation(data: Prisma.LocationCreateInput) {
     try{
          const res = await prisma.location.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating Location: ",error);
          return null;
     }
}

export async function updateLocation (id:string, data:Prisma.LocationUpdateInput) {
     try {
          const res = await prisma.location.update({where: {id}, data});
          if(res) revalidatePages();
          return res; 
     } catch (error) {
          console.log(`Error updating Location with id: ${id}`, error);
          return null;
     }
}

export async function deleteLocation (id:string) {
     try {
          const res = await prisma.location.delete({where: {id}});
          
          const Location = await prisma.location.findUnique({where:{id}});

          if (!Location) throw new Error("Location not found");

          if(res) revalidatePages();
           
          return res;
     } catch (error) {
          console.log("Error deleting Location with id: ", id, error);
          return null;
     }
}

export const fetchLocations = cache(async <T extends Prisma.LocationSelect>(
          selectType: T, search?: Prisma.LocationWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.LocationOrderByWithRelationInput | Prisma.LocationOrderByWithRelationInput[]  = { country: 'asc' }
     ):Promise<{data: Prisma.LocationGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.location.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.location.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching Locations: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchLocationById = cache(async <T extends Prisma.LocationSelect>(id:string, selectType: T): Promise<Prisma.LocationGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.location.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Location data for id: ${id}`, error);
          return null;
     }
})