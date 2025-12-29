"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createUserOTP(data: Prisma.UserOTPCreateInput) {
     try{
          const res = await prisma.userOTP.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating UserOTP: ",error);
          return null;
     }
}

export async function updateUserOTP (id:string, data:Prisma.UserOTPUpdateInput) {
     try {
          const res = await prisma.userOTP.update({where: {id}, data});
          if(res) revalidatePages();
          return res; 
     } catch (error) {
          console.log(`Error updating UserOTP with id: ${id}`, error);
          return null;
     }
}

export async function deleteUserOTP (id:string) {
     try {
          const res = await prisma.userOTP.delete({where: {id}});
          
          const UserOTP = await prisma.userOTP.findUnique({where:{id}});

          if (!UserOTP) throw new Error("UserOTP not found");

          if(res) revalidatePages();
           
          return res;
     } catch (error) {
          console.log("Error deleting UserOTP with id: ", id, error);
          return null;
     }
}

export const fetchUserOTPs = cache(async <T extends Prisma.UserOTPSelect>(
          selectType: T, search?: Prisma.UserOTPWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.UserOTPOrderByWithRelationInput | Prisma.UserOTPOrderByWithRelationInput[]  = { expiresAt: 'desc' }
     ):Promise<{data: Prisma.UserOTPGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.userOTP.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.userOTP.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching UserOTPs: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchUserOTPById = cache(async <T extends Prisma.UserOTPSelect>(id:string, selectType: T): Promise<Prisma.UserOTPGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.userOTP.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching UserOTP data for id: ${id}`, error);
          return null;
     }
})