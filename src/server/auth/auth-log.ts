"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { EAuthAction, Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";
import { getClientIp, getUserAgent } from "@/util/agent-capture";

export async function createAuthLog(userId:string, action: EAuthAction, success:boolean, ) {
     try{
          const ipAddress = await getClientIp();
          const userAgent = await getUserAgent();

          const res = await prisma.authLog.create({
               data: {
                    ipAddress: ipAddress || "UNKNOWN",
                    userAgent: userAgent || "UNKNOWN",
                    user: {connect: {id: userId}},
                    action,
                    success
               }
          });
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating AuthLog: ",error);
          return null;
     }
}

export async function deleteAuthLog (id:string) {
     try {
          const res = await prisma.authLog.delete({where: {id}});
          if(res) revalidatePages();
           
          return res;
     } catch (error) {
          console.log("Error deleting AuthLog with id: ", id, error);
          return null;
     }
}

export const fetchAuthLogs = cache(async <T extends Prisma.AuthLogSelect>(
          selectType: T, search?: Prisma.AuthLogWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.AuthLogOrderByWithRelationInput | Prisma.AuthLogOrderByWithRelationInput[]  = { createdAt: 'desc' }
     ):Promise<{data: Prisma.AuthLogGetPayload<{select: T}>[], total:number}> => {
     try {
          const res = await prisma.authLog.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.authLog.count({where:search});
          return {data:res, total};
     } catch (error) {
          console.log("Error fetching AuthLogs: ", error);
          return {data:[], total:0}
     }
});