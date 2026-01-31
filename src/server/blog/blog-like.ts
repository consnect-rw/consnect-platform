"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createBlogLike(data: Prisma.BlogLikeCreateInput) {
     try{
          const res = await prisma.blogLike.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating BlogLike: ",error);
          return null;
     }
}

export async function deleteBlogLike (userId:string, blogId:string) {
     try {
          const res = await prisma.blogLike.delete({where: {
               userId_blogId: {userId, blogId}
          }});

          if(res) revalidatePages();
          return res;
     } catch (error) {
          console.log("Error deleting BlogLike with id: ", error);
          return null;
     }
}

export const fetchBlogLikes = cache(async <T extends Prisma.BlogLikeSelect>(
          selectType: T, search?: Prisma.BlogLikeWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.BlogLikeOrderByWithRelationInput | Prisma.BlogLikeOrderByWithRelationInput[]  = { userId: 'asc' }
     ):Promise<{data: Prisma.BlogLikeGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.blogLike.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.blogLike.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching BlogLikes: ", error);
          return {data:[], pagination:{total:0}}
     }
});