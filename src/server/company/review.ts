"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createReview(data: Prisma.ReviewCreateInput) {
     try{
          const res = await prisma.review.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating Review: ",error);
          return null;
     }
}

export async function updateReview (id:string, data:Prisma.ReviewUpdateInput) {
     try {
          const res = await prisma.review.update({where: {id}, data});
          if(res) revalidatePages();
          return res; 
     } catch (error) {
          console.log(`Error updating Review with id: ${id}`, error);
          return null;
     }
}

export async function deleteReview (id:string) {
     try {
          const res = await prisma.review.delete({where: {id}});
          
          const Review = await prisma.review.findUnique({where:{id}});

          if (!Review) throw new Error("Review not found");

          if(res) revalidatePages();
           
          return res;
     } catch (error) {
          console.log("Error deleting Review with id: ", id, error);
          return null;
     }
}

export const fetchReviews = cache(async <T extends Prisma.ReviewSelect>(
          selectType: T, search?: Prisma.ReviewWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.ReviewOrderByWithRelationInput | Prisma.ReviewOrderByWithRelationInput[]  = { createdAt: 'asc' }
     ):Promise<{data: Prisma.ReviewGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.review.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.review.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching Reviews: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchReviewById = cache(async <T extends Prisma.ReviewSelect>(id:string, selectType: T): Promise<Prisma.ReviewGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.review.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Review data for id: ${id}`, error);
          return null;
     }
})