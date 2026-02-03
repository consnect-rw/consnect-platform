"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createBlog(data: Prisma.BlogCreateInput) {
     try{
          const res = await prisma.blog.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating Blog: ",error);
          return null;
     }
}

export async function updateBlog (id:string, data:Prisma.BlogUpdateInput) {
     try {
          const res = await prisma.blog.update({where: {id}, data});
          if(res) revalidatePages();
          return res; 
     } catch (error) {
          console.log(`Error updating Blog with id: ${id}`, error);
          return null;
     }
}

export async function deleteBlog (id:string) {
     try {
          const res = await prisma.blog.delete({where: {id}});
          
          const Blog = await prisma.blog.findUnique({where:{id}});

          if (!Blog) throw new Error("Blog not found");

          if(res) revalidatePages();
           
          return res;
     } catch (error) {
          console.log("Error deleting Blog with id: ", id, error);
          return null;
     }
}

export const fetchBlogs = cache(async <T extends Prisma.BlogSelect>(
          selectType: T, search?: Prisma.BlogWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.BlogOrderByWithRelationInput | Prisma.BlogOrderByWithRelationInput[]  = { createdAt: 'desc' }
     ):Promise<{data: Prisma.BlogGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.blog.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.blog.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching Blogs: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchBlogById = cache(async <T extends Prisma.BlogSelect>(id:string, selectType: T): Promise<Prisma.BlogGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.blog.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Blog data for id: ${id}`, error);
          return null;
     }
})