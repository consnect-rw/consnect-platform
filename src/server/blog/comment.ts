"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createComment(data: Prisma.CommentCreateInput) {
     try{
          const res = await prisma.comment.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating Comment: ",error);
          return null;
     }
}

export async function updateComment (id:string, data:Prisma.CommentUpdateInput) {
     try {
          const res = await prisma.comment.update({where: {id}, data});
          if(res) revalidatePages();
          return res; 
     } catch (error) {
          console.log(`Error updating Comment with id: ${id}`, error);
          return null;
     }
}

export async function deleteComment (id:string) {
     try {
          const res = await prisma.comment.delete({where: {id}});
          
          const Comment = await prisma.comment.findUnique({where:{id}});

          if (!Comment) throw new Error("Comment not found");

          if(res) revalidatePages();
           
          return res;
     } catch (error) {
          console.log("Error deleting Comment with id: ", id, error);
          return null;
     }
}

export const fetchComments = cache(async <T extends Prisma.CommentSelect>(
          selectType: T, search?: Prisma.CommentWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.CommentOrderByWithRelationInput | Prisma.CommentOrderByWithRelationInput[]  = { createdAt: 'asc' }
     ):Promise<{data: Prisma.CommentGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.comment.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.comment.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching Comments: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchCommentById = cache(async <T extends Prisma.CommentSelect>(id:string, selectType: T): Promise<Prisma.CommentGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.comment.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Comment data for id: ${id}`, error);
          return null;
     }
})