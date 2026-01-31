"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createBlogView(data: Prisma.BlogViewCreateInput) {
     try{
          const res = await prisma.blogView.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating BlogView: ",error);
          return null;
     }
}

export const fetchBlogViews = cache(async <T extends Prisma.BlogViewSelect>(
          selectType: T, search?: Prisma.BlogViewWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.BlogViewOrderByWithRelationInput | Prisma.BlogViewOrderByWithRelationInput[]  = { createdAt: 'asc' }
     ):Promise<{data: Prisma.BlogViewGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.blogView.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.blogView.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching BlogViews: ", error);
          return {data:[], pagination:{total:0}}
     }
});
